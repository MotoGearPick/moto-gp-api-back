export interface HelmetSearchDoc {
  id: string;
  variantId: string;
  modelId: string;
  brandId: string;

  brandName: string;
  brandSlug: string;
  modelName: string;
  modelSlug: string;
  colorName: string;
  graphicName: string | null;
  sku: string | null;
  fullName: string;

  image: string | null;

  shape: string[];
  purpose: string[];
  shellMaterial: string[];
  certification: string[];
  colorFamilies: string[];
  finish: string | null;
  closureType: string | null;

  priceFrom: number | null;
  currency: string | null;
}
