import { DocumentMapper, VariantWithRelations } from './document.mapper';

const baseVariant: VariantWithRelations = {
  id: 'v-1',
  helmet_id: 'm-1',
  color_name: 'Blue',
  finish: 'gloss',
  graphic_name: 'Marquez 93',
  sku: 'SKU-001',
  image_url: ['https://cdn/img1.webp', 'https://cdn/img2.webp'],
  color_families: ['blue'],
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  helmet_model: {
    id: 'm-1',
    slug: 'rf-1400',
    name: 'RF-1400',
    brand_id: 'b-1',
    safety_rating: 5,
    shell_sizes: 3,
    weight_grams: 1500,
    visor_anti_scratch: true,
    visor_anti_fog: false,
    sun_visor: false,
    sun_visor_type: null,
    intercom_ready: false,
    intercom_designed_brand: null,
    intercom_designed_model: null,
    removable_lining: true,
    washable_lining: true,
    emergency_release: false,
    closure_type: 'double_d_ring',
    certification: ['dot', 'snell_m2020'],
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    helmet_shape: ['full_face'],
    helmet_purpose: ['street'],
    shell_material: ['fiberglass'],
    visor_pinlock_compatible: [],
    visor_pinlock_included: false,
    pinlock_dks_code: null,
    tear_off_compatible: false,
    included_accessories: [],
    brand: {
      id: 'b-1',
      name: 'Shoei',
      slug: 'shoei',
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    },
  },
  helmet_inventory: [
    { price: { toString: () => '599.99' } as any, currency: 'USD' },
    { price: { toString: () => '549.99' } as any, currency: 'USD' },
  ] as any,
};

describe('DocumentMapper', () => {
  const mapper = new DocumentMapper();

  it('builds fullName from brand + model + graphic + color', () => {
    const doc = mapper.toDoc(baseVariant);
    expect(doc.fullName).toBe('Shoei RF-1400 Marquez 93 Blue');
  });

  it('uses the cheapest inventory price as priceFrom', () => {
    const doc = mapper.toDoc(baseVariant);
    expect(doc.priceFrom).toBe(549.99);
    expect(doc.currency).toBe('USD');
  });

  it('returns null priceFrom when no inventory', () => {
    const doc = mapper.toDoc({ ...baseVariant, helmet_inventory: [] });
    expect(doc.priceFrom).toBeNull();
    expect(doc.currency).toBeNull();
  });

  it('uses the first image_url as image', () => {
    const doc = mapper.toDoc(baseVariant);
    expect(doc.image).toBe('https://cdn/img1.webp');
  });

  it('handles missing graphic_name in fullName', () => {
    const doc = mapper.toDoc({ ...baseVariant, graphic_name: null });
    expect(doc.fullName).toBe('Shoei RF-1400 Blue');
  });

  it('exposes id equal to variantId (Meili primary key)', () => {
    const doc = mapper.toDoc(baseVariant);
    expect(doc.id).toBe(doc.variantId);
    expect(doc.id).toBe('v-1');
  });
});
