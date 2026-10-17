import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { HelmetCacheService } from '../../../valkey/helmet-cache.service';
import { SearchSyncService } from '../../../search/search-sync.service';
import { CreateHelmetInventoryDto } from './dto/create-helmet-inventory.dto';
import { UpdateHelmetInventoryDto } from './dto/update-helmet-inventory.dto';

@Injectable()
export class HelmetInventoryService {
  constructor(
    private readonly db: PrismaService,
    private readonly cache: HelmetCacheService,
    private readonly searchSync: SearchSyncService,
  ) {}

  async create(dto: CreateHelmetInventoryDto) {
    const result = await this.db.helmet_inventory.create({
      data: {
        variant_id: dto.variantId,
        size_id: dto.sizeId,
        store_id: dto.storeId,
        price: dto.price,
        currency: dto.currency ?? 'USD',
        in_stock: dto.inStock,
        affiliate_url: dto.affiliateUrl,
      },
      include: {
        affiliate_store: { select: { name: true, domain: true } },
        helmet_size: { select: { id: true, size_label: true } },
      },
    });
    await this.invalidateVariantHelmet(dto.variantId);
    await this.searchSync.upsertVariant(dto.variantId);
    return result;
  }

  async update(id: string, dto: UpdateHelmetInventoryDto) {
    const existing = await this.assertExists(id);

    const result = await this.db.helmet_inventory.update({
      where: { id },
      data: {
        ...(dto.variantId && { variant_id: dto.variantId }),
        ...(dto.sizeId && { size_id: dto.sizeId }),
        ...(dto.storeId && { store_id: dto.storeId }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.currency && { currency: dto.currency }),
        ...(dto.inStock !== undefined && { in_stock: dto.inStock }),
        ...(dto.affiliateUrl && { affiliate_url: dto.affiliateUrl }),
        last_checked: new Date(),
        updated_at: new Date(),
      },
      include: {
        affiliate_store: { select: { name: true, domain: true } },
        helmet_size: { select: { id: true, size_label: true } },
      },
    });
    await this.invalidateVariantHelmet(result.variant_id);
    await this.searchSync.upsertVariant(result.variant_id);
    // The row moved to another variant: the old one lost this price too.
    if (existing.variant_id !== result.variant_id) {
      await this.invalidateVariantHelmet(existing.variant_id);
      await this.searchSync.upsertVariant(existing.variant_id);
    }
    return result;
  }

  async remove(id: string) {
    const existing = await this.assertExists(id);
    await this.db.helmet_inventory.delete({ where: { id } });
    await this.invalidateVariantHelmet(existing.variant_id);
    await this.searchSync.upsertVariant(existing.variant_id);
  }

  private async invalidateVariantHelmet(variantId: string) {
    const variant = await this.db.helmet_model_variant.findUnique({
      where: { id: variantId },
      select: { helmet_id: true },
    });
    if (variant) await this.cache.invalidateHelmet(variant.helmet_id);
  }

  private async assertExists(id: string) {
    const item = await this.db.helmet_inventory.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Inventory entry #${id} not found`);
    return item;
  }
}
