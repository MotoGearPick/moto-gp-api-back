import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsPrismaService } from '../../../../prisma/products-prisma.service';
import { CreateHelmetVariantDto } from './dto/create-helmet-variant.dto';
import { UpdateHelmetVariantDto } from './dto/update-helmet-variant.dto';

@Injectable()
export class HelmetVariantsService {
  constructor(private readonly db: ProductsPrismaService) {}

  async findAll(modelId: string, includeDeleted = false) {
    await this.assertModelExists(modelId);

    const variants = await this.db.helmet_model_variant.findMany({
      where: {
        helmet_id: modelId,
        ...(!includeDeleted && { deleted_at: null }),
      },
      include: {
        helmet_inventory: {
          include: {
            affiliate_store: true,
            helmet_size: true,
          },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { color_name: 'asc' },
    });

    return variants.map((v) => this.mapVariant(v));
  }

  async findOne(modelId: string, variantId: string) {
    const variant = await this.db.helmet_model_variant.findFirst({
      where: { id: variantId, helmet_id: modelId },
      include: {
        helmet_inventory: {
          include: {
            affiliate_store: true,
            helmet_size: true,
          },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!variant)
      throw new NotFoundException(
        `Variant #${variantId} not found for helmet #${modelId}`,
      );

    return this.mapVariant(variant);
  }

  async create(modelId: string, dto: CreateHelmetVariantDto) {
    await this.assertModelExists(modelId);

    return this.db.helmet_model_variant.create({
      data: {
        helmet_id: modelId,
        color_name: dto.colorName,
        color_families: (dto.colorFamilies as any[]) ?? [],
        finish: dto.finish as any,
        graphic_name: dto.graphicName,
        sku: dto.sku,
        image_url: dto.imageUrl ?? [],
      },
    });
  }

  async update(modelId: string, variantId: string, dto: UpdateHelmetVariantDto) {
    await this.findOne(modelId, variantId);

    return this.db.helmet_model_variant.update({
      where: { id: variantId },
      data: {
        ...(dto.colorName && { color_name: dto.colorName }),
        ...(dto.colorFamilies && { color_families: dto.colorFamilies as any[] }),
        ...(dto.finish && { finish: dto.finish as any }),
        ...(dto.graphicName !== undefined && { graphic_name: dto.graphicName }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.imageUrl && { image_url: dto.imageUrl }),
        updated_at: new Date(),
      },
    });
  }

  async remove(modelId: string, variantId: string) {
    await this.findOne(modelId, variantId);
    await this.db.helmet_model_variant.update({
      where: { id: variantId },
      data: { deleted_at: new Date() },
    });
  }

  async restore(modelId: string, variantId: string) {
    const variant = await this.db.helmet_model_variant.findFirst({
      where: { id: variantId, helmet_id: modelId },
    });
    if (!variant)
      throw new NotFoundException(
        `Variant #${variantId} not found for helmet #${modelId}`,
      );

    return this.db.helmet_model_variant.update({
      where: { id: variantId },
      data: { deleted_at: null, updated_at: new Date() },
    });
  }

  private async assertModelExists(modelId: string) {
    const model = await this.db.helmet_model.findUnique({
      where: { id: modelId },
    });
    if (!model)
      throw new NotFoundException(`Helmet model #${modelId} not found`);
  }

  private mapVariant(v: any) {
    return {
      id: v.id,
      colorName: v.color_name,
      colorFamilies: v.color_families,
      finish: v.finish,
      graphicName: v.graphic_name,
      sku: v.sku,
      images: v.image_url,
      deletedAt: v.deleted_at,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
      inventory: (v.helmet_inventory ?? []).map((i: any) => ({
        id: i.id,
        size: i.helmet_size
          ? { id: i.helmet_size.id, sizeLabel: i.helmet_size.size_label }
          : null,
        price: Number(i.price),
        currency: i.currency,
        inStock: i.in_stock,
        affiliateUrl: i.affiliate_url,
        lastChecked: i.last_checked,
        store: {
          id: i.affiliate_store.id,
          name: i.affiliate_store.name,
          domain: i.affiliate_store.domain,
        },
      })),
    };
  }
}
