import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DocumentMapper, variantWithRelations } from './document.mapper';
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
        ...variantWithRelations,
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
        ...variantWithRelations,
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
        ...variantWithRelations,
      });

      if (variants.length) {
        await this.meili.index.addDocuments(variants.map((v) => this.mapper.toDoc(v)));
      }
    } catch (err) {
      this.logger.error(`Failed to upsert brand ${brandId} in Meili`, err);
    }
  }

  // A store's prices feed priceFrom of every variant it sells; resync those after it is deleted or restored.
  async upsertStore(storeId: string): Promise<void> {
    try {
      const variants = await this.db.helmet_model_variant.findMany({
        where: {
          deleted_at: null,
          helmet_model: { deleted_at: null },
          helmet_inventory: { some: { store_id: storeId } },
        },
        ...variantWithRelations,
      });

      if (variants.length) {
        await this.meili.index.addDocuments(variants.map((v) => this.mapper.toDoc(v)));
      }
    } catch (err) {
      this.logger.error(`Failed to upsert store ${storeId} in Meili`, err);
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
