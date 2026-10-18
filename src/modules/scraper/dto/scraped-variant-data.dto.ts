import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { ColorFamily } from '../../gear/helmets/enums';
import { HelmetFinish } from '../../gear/helmets/enums';

// shortcut: reviews scraped before 2026-10-18 still carry these; upsertVariant converts them. Drop once none are pending.
export const REVIEW_COLOR_FAMILIES = [...Object.values(ColorFamily), 'carbon', 'multicolor'];

export class ScrapedVariantDataDto {
  @IsString()
  variantName: string;

  @IsString()
  colorName: string;

  @IsArray()
  @IsIn(REVIEW_COLOR_FAMILIES, { each: true })
  colorFamilies: string[];

  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish | null;

  @IsOptional()
  @IsString()
  graphicName?: string | null;

  @IsOptional()
  @IsBoolean()
  exposedCarbon?: boolean;

  @IsOptional()
  @IsBoolean()
  isMono?: boolean;

  @IsOptional()
  @IsString()
  sku?: string | null;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];
}
