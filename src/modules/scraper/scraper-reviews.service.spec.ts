import { BadRequestException } from '@nestjs/common';
import { ScraperReviewsService } from './scraper-reviews.service';

const modelData = { brandSlug: 'shoei', modelSlug: 'rf-1400', modelName: 'RF-1400', sizes: [] };
const review = (id: string, colorName: string) => ({
  id,
  status: 'pending',
  variant_review_status: 'reviewed',
  model_review_status: 'reviewed',
  raw_model_data: modelData,
  raw_variant_data: { colorName, graphicName: null, colorFamilies: [], imageUrls: [`https://brand.example/${colorName}.jpg`] },
});

describe('ScraperReviewsService.batchApprove', () => {
  it('uploads every variant to the CDN and stores the CDN keys, not the brand URLs', async () => {
    const variantWrites: unknown[] = [];
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: {
        findFirst: jest.fn(async () => null),
        create: jest.fn(async (args) => {
          variantWrites.push(args);
          return { id: `v-${args.data.color_name}` };
        }),
      },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: {
        findMany: jest.fn(async () => [review('r1', 'black'), review('r2', 'white')]),
        updateMany: jest.fn(),
      },
      helmet_model_variant: { updateMany: jest.fn(async () => ({ count: 1 })), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = { processVariantImages: jest.fn(async (_urls, _b, _m, variantId) => [`cdn/${variantId}.webp`]) };
    const cache = { invalidateHelmet: jest.fn() };
    const searchSync = { upsertModel: jest.fn() };
    const service = new ScraperReviewsService(prisma as any, cdnImages as any, cache as any, searchSync as any);

    await expect(service.batchApprove('rf-1400', {})).resolves.toEqual({ approved: 2 });

    expect(cdnImages.processVariantImages).toHaveBeenCalledTimes(2);
    // New variants were created hidden; their first images publish them.
    expect(prisma.helmet_model_variant.updateMany).toHaveBeenCalledWith({
      where: { id: 'v-black', image_url: { isEmpty: true } },
      data: { image_url: ['cdn/v-black.webp'], deleted_at: null },
    });
    expect(prisma.helmet_model_variant.updateMany).toHaveBeenCalledTimes(2);
    expect(prisma.helmet_model_variant.update).not.toHaveBeenCalled();
    // The transaction itself must never write the raw brand URLs.
    expect(JSON.stringify(variantWrites)).not.toContain('brand.example');
    expect(prisma.scrape_review.updateMany).toHaveBeenCalled();
    expect(cache.invalidateHelmet).toHaveBeenCalledWith('m1');
  });

  it('approves two reviews of the same color (a model scraped twice) as one variant', async () => {
    const created = new Map<string, { id: string }>();
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: {
        findFirst: jest.fn(async ({ where }) => created.get(where.color_name) ?? null),
        create: jest.fn(async ({ data }) => {
          if (created.has(data.color_name)) throw new Error('unique violation'); // what the index does
          created.set(data.color_name, { id: `v-${data.color_name}` });
          return created.get(data.color_name);
        }),
        update: jest.fn(),
      },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: { findMany: jest.fn(async () => [review('r1', 'black'), review('r2', 'black')]), updateMany: jest.fn() },
      helmet_model_variant: { updateMany: jest.fn(async () => ({ count: 1 })), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = { processVariantImages: jest.fn(async () => ['cdn/black.webp']) };
    const service = new ScraperReviewsService(
      prisma as any, cdnImages as any, { invalidateHelmet: jest.fn() } as any, { upsertModel: jest.fn() } as any,
    );

    await expect(service.batchApprove('rf-1400', {})).resolves.toEqual({ approved: 2 });

    expect(tx.helmet_model_variant.create).toHaveBeenCalledTimes(1);
    expect(cdnImages.processVariantImages).toHaveBeenCalledTimes(1); // same variant, uploaded once
  });

  it('refreshes cache and search for the variants already live when a later upload fails', async () => {
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: {
        findFirst: jest.fn(async () => null),
        create: jest.fn(async ({ data }) => ({ id: `v-${data.color_name}` })),
      },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: { findMany: jest.fn(async () => [review('r1', 'black'), review('r2', 'white')]), updateMany: jest.fn() },
      helmet_model_variant: { updateMany: jest.fn(async () => ({ count: 1 })), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = {
      processVariantImages: jest.fn(async (_u, _b, _m, variantId) => {
        if (variantId === 'v-white') throw new Error('HTTP 404 downloading image');
        return ['cdn/v-black.webp'];
      }),
    };
    const cache = { invalidateHelmet: jest.fn() };
    const searchSync = { upsertModel: jest.fn() };
    const service = new ScraperReviewsService(prisma as any, cdnImages as any, cache as any, searchSync as any);

    await expect(service.batchApprove('rf-1400', {})).rejects.toThrow('HTTP 404');

    expect(prisma.scrape_review.updateMany).not.toHaveBeenCalled(); // reviews stay pending, re-approve retries
    expect(cache.invalidateHelmet).toHaveBeenCalledWith('m1');
    expect(searchSync.upsertModel).toHaveBeenCalledWith('m1'); // v-black is live and must be searchable
  });

  it('refuses to approve a variant with no images, before writing anything', async () => {
    const noImages = { ...review('r1', 'black'), raw_variant_data: { colorName: 'black', graphicName: null, colorFamilies: [], imageUrls: [] } };
    const prisma = {
      scrape_review: { findMany: jest.fn(async () => [noImages]), updateMany: jest.fn() },
      $transaction: jest.fn(),
    };
    const service = new ScraperReviewsService(prisma as any, {} as any, {} as any, {} as any);

    await expect(service.batchApprove('rf-1400', {})).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('refreshes images of a variant an admin deleted, without bringing it back', async () => {
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: { findFirst: jest.fn(async () => ({ id: 'v-old' })), update: jest.fn() },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: { findMany: jest.fn(async () => [review('r1', 'black')]), updateMany: jest.fn() },
      // It already has images, so the "first images publish it" update matches nothing.
      helmet_model_variant: { updateMany: jest.fn(async () => ({ count: 0 })), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = { processVariantImages: jest.fn(async () => ['cdn/new.webp']) };
    const service = new ScraperReviewsService(
      prisma as any, cdnImages as any, { invalidateHelmet: jest.fn() } as any, { upsertModel: jest.fn() } as any,
    );

    await service.batchApprove('rf-1400', {});

    expect(prisma.helmet_model_variant.update).toHaveBeenCalledWith({ where: { id: 'v-old' }, data: { image_url: ['cdn/new.webp'] } });
  });
});

describe('ScraperReviewsService.approveSingle', () => {
  it('refreshes cache and search with the saved fields even when the image upload fails', async () => {
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: { findFirst: jest.fn(async () => ({ id: 'v-black' })), update: jest.fn() },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: { findUnique: jest.fn(async () => review('r1', 'black')), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = { processVariantImages: jest.fn(async () => { throw new Error('HTTP 404 downloading image'); }) };
    const cache = { invalidateHelmet: jest.fn() };
    const searchSync = { upsertModel: jest.fn() };
    const service = new ScraperReviewsService(prisma as any, cdnImages as any, cache as any, searchSync as any);

    await expect(service.approveSingle('r1')).rejects.toThrow('HTTP 404');

    expect(tx.helmet_model_variant.update).toHaveBeenCalled(); // e.g. a new finish is already saved
    expect(searchSync.upsertModel).toHaveBeenCalledWith('m1');
    expect(cache.invalidateHelmet).toHaveBeenCalledWith('m1');
    expect(prisma.scrape_review.update).not.toHaveBeenCalled(); // stays pending for a retry
  });
});

describe('ScraperReviewsService legacy color data', () => {
  it('turns carbon/multicolor/"Mono" from old reviews into flags, counting carbon as black', async () => {
    const legacy = {
      ...review('r1', 'Red'),
      raw_variant_data: { colorName: 'Red', graphicName: 'Mono', colorFamilies: ['red', 'carbon', 'multicolor'], imageUrls: ['https://brand.example/red.jpg'] },
    };
    const create = jest.fn(async () => ({ id: 'v1' }));
    const tx = {
      brand: { upsert: jest.fn(async () => ({ id: 'b1' })) },
      helmet_model: { upsert: jest.fn(async () => ({ id: 'm1' })) },
      helmet_model_variant: { findFirst: jest.fn(async () => null), create },
      helmet_model_size: { findMany: jest.fn(async () => []), createMany: jest.fn() },
    };
    const prisma = {
      scrape_review: { findMany: jest.fn(async () => [legacy]), updateMany: jest.fn() },
      helmet_model_variant: { updateMany: jest.fn(async () => ({ count: 1 })), update: jest.fn() },
      $transaction: jest.fn(async (fn) => fn(tx)),
    };
    const cdnImages = { processVariantImages: jest.fn(async () => []) };
    const service = new ScraperReviewsService(prisma as any, cdnImages as any, { invalidateHelmet: jest.fn() } as any, { upsertModel: jest.fn() } as any);

    await service.batchApprove('rf-1400', {});

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ color_families: ['red', 'black'], exposed_carbon: true, is_mono: true }),
    }));
  });
});
