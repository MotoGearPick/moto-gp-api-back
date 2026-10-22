import { color_family, helmet_finish, Prisma } from '@prisma/products-client';
import { ColorFamily, HelmetFinish } from '../enums';

export interface VariantAppearanceFilters {
  colorFamily?: ColorFamily[];
  exclusive?: boolean;
  finish?: HelmetFinish[];
  exposedCarbon?: boolean;
  isMono?: boolean;
}

/**
 * Same color semantics as the public catalog: the variant has every selected color,
 * and with `exclusive` no other color.
 */
export function variantAppearanceWhere(f: VariantAppearanceFilters): Prisma.helmet_model_variantWhereInput {
  const colors = f.colorFamily ?? [];
  const others = Object.values(ColorFamily).filter((c) => !colors.includes(c));
  return {
    ...(colors.length && { color_families: { hasEvery: colors as color_family[] } }),
    ...(colors.length && f.exclusive && { NOT: { color_families: { hasSome: others as color_family[] } } }),
    ...(f.finish?.length && { finish: { in: f.finish as helmet_finish[] } }),
    ...(f.exposedCarbon !== undefined && { exposed_carbon: f.exposedCarbon }),
    ...(f.isMono !== undefined && { is_mono: f.isMono }),
  };
}

export function hasAppearanceFilter(f: VariantAppearanceFilters): boolean {
  return Object.keys(variantAppearanceWhere(f)).length > 0;
}
