import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CachedCatalogItem, HelmetCacheService } from '../../../valkey/helmet-cache.service';
import { FilterHelmetModelsDto } from './dto/filter-helmet-models.dto';
import { HelmetModelsService } from './helmet-models.service';

function item(overrides: Partial<CachedCatalogItem> & { closureType?: string | null } = {}): CachedCatalogItem {
  const { closureType = null, ...rest } = overrides;
  return {
    id: rest.slug ?? 'x',
    slug: 'x',
    name: 'X',
    brand: { id: 'b', name: 'Shoei', slug: 'shoei' },
    shape: [],
    purpose: [],
    safetyRating: null,
    shellMaterial: [],
    shellSizes: null,
    weightGrams: null,
    features: { closureType } as CachedCatalogItem['features'],
    certification: [],
    includedAccessories: [],
    variantsCount: 1,
    variantImages: [{ colorName: 'Black', image: null }],
    priceFrom: null,
    currency: null,
    _variants: [{ colorFamilies: ['black'], finish: 'matte' }],
    ...rest,
  };
}

// Mirrors the global ValidationPipe ({ whitelist: true, transform: true }).
async function parse(query: Record<string, unknown>) {
  const dto = plainToInstance(FilterHelmetModelsDto, query);
  const errors = await validate(dto, { whitelist: true });
  return { dto, errors };
}

describe('HelmetModelsService.findAll', () => {
  const catalog = [
    item({ slug: 'k6', name: 'K6', brand: { id: 'a', name: 'AGV', slug: 'agv' }, closureType: 'double_d_ring' }),
    item({ slug: 'rf-1400', name: 'RF-1400', closureType: 'micrometric' }),
    item({ slug: 'neotec-3', name: 'Neotec 3', closureType: 'micrometric', _variants: [{ colorFamilies: ['white'], finish: 'gloss' }] }),
    item({ slug: 'gt-air', name: 'GT-Air', closureType: null }),
  ];
  const service = new HelmetModelsService({ getCatalog: async () => catalog } as unknown as HelmetCacheService);
  const slugs = async (query: Record<string, unknown>) => {
    const { dto, errors } = await parse(query);
    expect(errors).toEqual([]);
    return (await service.findAll(dto)).data.map((d) => d.slug);
  };

  it('searches brand + model name, case-insensitively', async () => {
    expect(await slugs({ search: 'agv k6' })).toEqual(['k6']);
    expect(await slugs({ search: 'SHOEI' })).toEqual(['rf-1400', 'neotec-3', 'gt-air']);
  });

  it('accepts one or several closure types', async () => {
    expect(await slugs({ closureType: 'double_d_ring' })).toEqual(['k6']);
    expect(await slugs({ closureType: ['double_d_ring', 'micrometric'] })).toEqual(['k6', 'rf-1400', 'neotec-3']);
  });

  it('filters by variant attributes and keeps only matching variant images', async () => {
    const { dto } = await parse({ colorFamily: 'white' });
    const res = await service.findAll(dto);
    expect(res.data.map((d) => d.slug)).toEqual(['neotec-3']);
    expect(res.data[0].variantsCount).toBe(1);
  });

  it('lets the public listing request the whole catalog, but no more than 1000', async () => {
    const { dto, errors } = await parse({ limit: '1000' });
    expect(errors).toEqual([]);
    expect((await service.findAll(dto)).data).toHaveLength(catalog.length);
    expect((await parse({ limit: '1001' })).errors).not.toEqual([]);
    expect((await parse({})).dto.limit).toBe(20);
  });
});
