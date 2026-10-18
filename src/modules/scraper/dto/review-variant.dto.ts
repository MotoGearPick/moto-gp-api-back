import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { HelmetFinish } from '../../gear/helmets/enums';
import { REVIEW_COLOR_FAMILIES } from './scraped-variant-data.dto';

/**
 * Variant fields a color reviewer is allowed to edit.
 * Deliberately excludes sku and images (shown read-only) and any model-level field.
 */
export class ReviewVariantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variantName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  colorName?: string;

  @ApiPropertyOptional({ enum: REVIEW_COLOR_FAMILIES, isArray: true })
  @IsOptional()
  @IsArray()
  @IsIn(REVIEW_COLOR_FAMILIES, { each: true })
  colorFamilies?: string[];

  @ApiPropertyOptional({ enum: HelmetFinish, nullable: true })
  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  graphicName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  exposedCarbon?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMono?: boolean;
}
