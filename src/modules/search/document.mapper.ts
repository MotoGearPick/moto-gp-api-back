import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/products-client';
import { HelmetSearchDoc } from './search.types';

const variantWithRelations = Prisma.validator<Prisma.helmet_model_variantDefaultArgs>()({
  include: {
    helmet_model: { include: { brand: true } },
    helmet_inventory: { select: { price: true, currency: true } },
  },
});

export type VariantWithRelations = Prisma.helmet_model_variantGetPayload<typeof variantWithRelations>;

@Injectable()
export class DocumentMapper {
  toDoc(variant: VariantWithRelations): HelmetSearchDoc {
    const model = variant.helmet_model;
    const brand = model.brand;
    const inventory = variant.helmet_inventory ?? [];
    const prices = inventory.map((i) => Number(i.price)).filter((p) => Number.isFinite(p));
    const cheapest = inventory.length
      ? [...inventory].sort((a, b) => Number(a.price) - Number(b.price))[0]
      : null;

    const fullName = [brand.name, model.name, variant.graphic_name, variant.color_name]
      .filter(Boolean)
      .join(' ');

    return {
      id: variant.id,
      variantId: variant.id,
      modelId: model.id,
      brandId: brand.id,

      brandName: brand.name,
      brandSlug: brand.slug,
      modelName: model.name,
      modelSlug: model.slug,
      colorName: variant.color_name,
      graphicName: variant.graphic_name,
      sku: variant.sku,
      fullName,

      image: variant.image_url?.[0] ?? null,

      shape: model.helmet_shape ?? [],
      purpose: model.helmet_purpose ?? [],
      shellMaterial: model.shell_material ?? [],
      certification: model.certification ?? [],
      colorFamilies: variant.color_families ?? [],
      finish: variant.finish ?? null,
      closureType: model.closure_type ?? null,

      priceFrom: prices.length ? Math.min(...prices) : null,
      currency: cheapest?.currency ?? null,
    };
  }
}
