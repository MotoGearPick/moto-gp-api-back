import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/products-client';
import { PrismaService } from '../../prisma/prisma.service';
import { FilterVariantReviewsDto, ReviewVariantDto } from './dto';
import { ScrapedModelData, ScrapedVariantData } from './interfaces';

/**
 * Review narrowed to variant data (name, color, families, finish, graphic).
 * Intended for `variant_reviewer` admins: does NOT expose model-data editing nor approval.
 * The `variant_review_status` sub-state is independent of the pipeline approval `status`.
 */
@Injectable()
export class VariantReviewService {
  constructor(private readonly prisma: PrismaService) {}

  private getRawVariant(review: any): ScrapedVariantData | null {
    if (review.raw_variant_data) {
      return review.raw_variant_data as ScrapedVariantData;
    }
    const raw = review.raw_data as Record<string, any> | null;
    if (raw?.variantData) return raw.variantData as ScrapedVariantData;
    return null;
  }

  private getModelContext(review: any): { modelName: string; brandSlug: string } {
    const edited = review.edited_model_data as Partial<ScrapedModelData> | null;
    const rawModel = review.raw_model_data as Partial<ScrapedModelData> | null;
    const fromRaw = (review.raw_data as any)?.modelData as
      | Partial<ScrapedModelData>
      | undefined;
    const src = edited ?? rawModel ?? fromRaw ?? {};
    return {
      modelName: src.modelName ?? '',
      brandSlug: src.brandSlug ?? '',
    };
  }

  /**
   * Reviewer view: variant data (raw + applied edits) plus READ-ONLY model context.
   * sku/images are exposed as context only, not editable.
   */
  private mapVariantReview(review: any) {
    const raw = this.getRawVariant(review);
    const edited = (review.edited_variant_data as Partial<ScrapedVariantData>) ?? null;
    const resolved = { ...(raw ?? {}), ...(edited ?? {}) } as ScrapedVariantData;
    const { modelName, brandSlug } = this.getModelContext(review);

    return {
      reviewId: review.id,
      sourceUrl: review.source_url,
      source: review.source,
      approvalStatus: review.status,
      variantReviewStatus: review.variant_review_status,
      variantReviewedAt: review.variant_reviewed_at,
      variantReviewedBy: review.variant_reviewed_by,
      // Model context (read-only)
      modelName,
      brandSlug,
      // Editable variant data
      variant: {
        variantName: resolved.variantName ?? '',
        colorName: resolved.colorName ?? '',
        colorFamilies: resolved.colorFamilies ?? [],
        finish: resolved.finish ?? null,
        graphicName: resolved.graphicName ?? null,
      },
      // Variant context (read-only)
      sku: resolved.sku ?? null,
      imageUrls: resolved.imageUrls ?? [],
      createdAt: review.created_at,
    };
  }

  async findToReview(filters: FilterVariantReviewsDto) {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const where: Prisma.scrape_reviewWhereInput = {};
    if (filters.variantReviewStatus) {
      where.variant_review_status = filters.variantReviewStatus;
    }

    const reviews = await this.prisma.scrape_review.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    let mapped = reviews
      .filter((r) => this.getRawVariant(r) !== null)
      .map((r) => this.mapVariantReview(r));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      mapped = mapped.filter(
        (m) =>
          m.variant.colorName.toLowerCase().includes(q) ||
          (m.variant.graphicName ?? '').toLowerCase().includes(q) ||
          m.variant.variantName.toLowerCase().includes(q) ||
          m.modelName.toLowerCase().includes(q) ||
          m.brandSlug.toLowerCase().includes(q),
      );
    }

    const total = mapped.length;
    const totalPages = Math.ceil(total / limit);
    const items = mapped.slice((page - 1) * limit, page * limit);

    return { items, total, page, limit, totalPages };
  }

  async findOne(id: string) {
    const review = await this.prisma.scrape_review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    return this.mapVariantReview(review);
  }

  /**
   * Applies variant edits (only the allowed fields) onto edited_variant_data,
   * preserving existing sku/images.
   */
  async editVariant(id: string, dto: ReviewVariantDto) {
    const review = await this.prisma.scrape_review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const base: Partial<ScrapedVariantData> =
      (review.edited_variant_data as Partial<ScrapedVariantData>) ??
      this.getRawVariant(review) ??
      {};

    const merged: Partial<ScrapedVariantData> = { ...base };
    if (dto.variantName !== undefined) merged.variantName = dto.variantName;
    if (dto.colorName !== undefined) merged.colorName = dto.colorName;
    if (dto.colorFamilies !== undefined) merged.colorFamilies = dto.colorFamilies;
    if (dto.finish !== undefined) merged.finish = dto.finish;
    if (dto.graphicName !== undefined) merged.graphicName = dto.graphicName;

    const updated = await this.prisma.scrape_review.update({
      where: { id },
      data: {
        edited_variant_data: merged as unknown as Prisma.InputJsonValue,
      },
    });

    return this.mapVariantReview(updated);
  }

  async markReviewed(id: string, adminId: string) {
    const review = await this.prisma.scrape_review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.scrape_review.update({
      where: { id },
      data: {
        variant_review_status: 'reviewed',
        variant_reviewed_at: new Date(),
        variant_reviewed_by: adminId,
      },
    });
    return this.mapVariantReview(updated);
  }

  async unmarkReviewed(id: string) {
    const review = await this.prisma.scrape_review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.scrape_review.update({
      where: { id },
      data: {
        variant_review_status: 'pending',
        variant_reviewed_at: null,
        variant_reviewed_by: null,
      },
    });
    return this.mapVariantReview(updated);
  }
}
