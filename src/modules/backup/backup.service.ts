import { Injectable } from '@nestjs/common';
import { ProductsPrismaService } from '../../prisma/products-prisma.service';

@Injectable()
export class BackupService {
  constructor(private readonly productsPrisma: ProductsPrismaService) {}

  async exportProductsDatabase() {
    const [
      brands,
      affiliateStores,
      helmetModels,
      helmetVariants,
      helmetSizes,
      helmetInventory,
      helmetSizeCharts,
      scrapeReviews,
    ] = await Promise.all([
      this.productsPrisma.brand.findMany(),
      this.productsPrisma.affiliate_store.findMany(),
      this.productsPrisma.helmet_model.findMany(),
      this.productsPrisma.helmet_model_variant.findMany(),
      this.productsPrisma.helmet_model_size.findMany(),
      this.productsPrisma.helmet_inventory.findMany(),
      this.productsPrisma.helmet_size_chart_by_brand.findMany(),
      this.productsPrisma.scrape_review.findMany(),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      database: 'products',
      tables: {
        brand: { count: brands.length, data: brands },
        affiliate_store: { count: affiliateStores.length, data: affiliateStores },
        helmet_model: { count: helmetModels.length, data: helmetModels },
        helmet_model_variant: { count: helmetVariants.length, data: helmetVariants },
        helmet_model_size: { count: helmetSizes.length, data: helmetSizes },
        helmet_inventory: { count: helmetInventory.length, data: helmetInventory },
        helmet_size_chart_by_brand: { count: helmetSizeCharts.length, data: helmetSizeCharts },
        scrape_review: { count: scrapeReviews.length, data: scrapeReviews },
      },
    };
  }
}
