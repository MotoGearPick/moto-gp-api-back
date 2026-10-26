import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CdnImagesService } from '../src/modules/cdn/cdn-images.service';
import { HelmetCacheService } from '../src/modules/valkey/helmet-cache.service';
import { SearchSyncService } from '../src/modules/search/search-sync.service';

/**
 * Variants approved before the CDN module (2026-05-06) store the brand's raw image URLs
 * in image_url instead of CDN keys. This uploads those images to the CDN and swaps the
 * URLs for keys, keeping order and any entries that are already keys.
 *
 * Dry run by default; pass --apply to write.
 */
const isRawUrl = (img: string) => /^https?:\/\//i.test(img);

async function main() {
  const apply = process.argv.includes('--apply');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'error', 'warn'] });
  try {
    const db = app.get(PrismaService);
    const cdnImages = app.get(CdnImagesService, { strict: false });
    const cache = app.get(HelmetCacheService);
    const searchSync = app.get(SearchSyncService);

    const variants = await db.helmet_model_variant.findMany({
      select: {
        id: true,
        helmet_id: true,
        color_name: true,
        image_url: true,
        helmet_model: { select: { slug: true, brand: { select: { slug: true } } } },
      },
    });
    const legacy = variants.filter((v) => v.image_url.some(isRawUrl));
    console.log(`${legacy.length} variant(s) with raw image URLs${apply ? '' : ' (dry run, pass --apply to migrate)'}`);

    let migrated = 0;
    const failed: string[] = [];
    for (const v of legacy) {
      const { slug: modelSlug, brand } = v.helmet_model;
      const raw = v.image_url.filter(isRawUrl);
      console.log(`- ${brand.slug}/${modelSlug} "${v.color_name}" (${v.id}): ${raw.length} image(s)`);
      if (!apply) continue;

      try {
        const keys = await cdnImages.processVariantImages(raw, brand.slug, modelSlug, v.id);
        const byUrl = new Map(raw.map((url, i) => [url, keys[i]]));
        await db.helmet_model_variant.update({
          where: { id: v.id },
          data: { image_url: v.image_url.map((img) => byUrl.get(img) ?? img), updated_at: new Date() },
        });
        await cache.invalidateHelmet(v.helmet_id);
        await searchSync.upsertVariant(v.id);
        migrated++;
      } catch (err) {
        console.error(`  failed: ${(err as Error).message}`);
        failed.push(v.id);
      }
    }

    if (apply) {
      console.log(`Migrated ${migrated}/${legacy.length} variant(s)`);
      if (failed.length) console.log(`Failed: ${failed.join(', ')}`);
    }
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
