import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ColorFamily } from '../../gear/helmets/enums';
import { HelmetFinish } from '../../gear/helmets/enums';

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

  @ApiPropertyOptional({ enum: ColorFamily, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ColorFamily, { each: true })
  colorFamilies?: ColorFamily[];

  @ApiPropertyOptional({ enum: HelmetFinish, nullable: true })
  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  graphicName?: string | null;
}
