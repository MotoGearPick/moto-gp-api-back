import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentMapper } from './document.mapper';
import { MeiliService } from './meili.service';

@Injectable()
export class SearchSyncService {
  private readonly logger = new Logger(SearchSyncService.name);

  constructor(
    private readonly db: PrismaService,
    private readonly meili: MeiliService,
    private readonly mapper: DocumentMapper,
  ) {}

  async upsertVariant(variantId: string): Promise<void> {
    try {
      const variant = await this.db.helmet_model_variant.findUnique({
        where: { id: variantId },
        include: {
          helmet_model: { include: { brand: true } },
          helmet_inventory: { select: { price: true, currency: true } },
        },
      });

      if (!variant || variant.deleted_at || variant.helmet_model.deleted_at) {
        await this.deleteVariant(variantId);
        return;
      }

      await this.meili.index.addDocuments([this.mapper.toDoc(variant)]);
    } catch (err) {
      this.logger.error(`Failed to upsert variant ${variantId} in Meili`, err);
    }
  }

  async upsertModel(modelId: string): Promise<void> {
    try {
      const variants = await this.db.helmet_model_variant.findMany({
        where: { helmet_id: modelId },
        include: {
          helmet_model: { include: { brand: true } },
          helmet_inventory: { select: { price: true, currency: true } },
        },
      });

      const liveVariants = variants.filter(
        (v) => !v.deleted_at && !v.helmet_model.deleted_at,
      );
      const removedIds = variants
        .filter((v) => v.deleted_at || v.helmet_model.deleted_at)
        .map((v) => v.id);

      if (liveVariants.length) {
        await this.meili.index.addDocuments(liveVariants.map((v) => this.mapper.toDoc(v)));
      }
      if (removedIds.length) {
        await this.meili.index.deleteDocuments(removedIds);
      }
    } catch (err) {
      this.logger.error(`Failed to upsert model ${modelId} in Meili`, err);
    }
  }

  async upsertBrand(brandId: string): Promise<void> {
    try {
      const variants = await this.db.helmet_model_variant.findMany({
        where: {
          deleted_at: null,
          helmet_model: { brand_id: brandId, deleted_at: null },
        },
        include: {
          helmet_model: { include: { brand: true } },
          helmet_inventory: { select: { price: true, currency: true } },
        },
      });

      if (variants.length) {
        await this.meili.index.addDocuments(variants.map((v) => this.mapper.toDoc(v)));
      }
    } catch (err) {
      this.logger.error(`Failed to upsert brand ${brandId} in Meili`, err);
    }
  }

  async deleteVariant(variantId: string): Promise<void> {
    try {
      await this.meili.index.deleteDocument(variantId);
    } catch (err) {
      this.logger.error(`Failed to delete variant ${variantId} from Meili`, err);
    }
  }
}
