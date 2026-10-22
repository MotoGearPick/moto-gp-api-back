import { ColorFamily, HelmetFinish } from '../enums';
import { hasAppearanceFilter, variantAppearanceWhere } from './variant-appearance-where';

describe('variantAppearanceWhere', () => {
  it('requires every selected color', () => {
    expect(variantAppearanceWhere({ colorFamily: [ColorFamily.BLACK, ColorFamily.RED] })).toEqual({
      color_families: { hasEvery: ['black', 'red'] },
    });
  });

  it('exclusive excludes every other color', () => {
    const where = variantAppearanceWhere({ colorFamily: [ColorFamily.BLACK], exclusive: true });
    const others = (where.NOT as any).color_families.hasSome as string[];
    expect(others).not.toContain('black');
    expect(others).toHaveLength(Object.values(ColorFamily).length - 1);
  });

  it('exclusive without colors does nothing', () => {
    expect(variantAppearanceWhere({ exclusive: true })).toEqual({});
    expect(hasAppearanceFilter({ exclusive: true })).toBe(false);
  });

  it('keeps false flags so "No" filters work', () => {
    expect(variantAppearanceWhere({ exposedCarbon: false, isMono: true, finish: [HelmetFinish.MATTE] })).toEqual({
      exposed_carbon: false,
      is_mono: true,
      finish: { in: ['matte'] },
    });
  });
});
