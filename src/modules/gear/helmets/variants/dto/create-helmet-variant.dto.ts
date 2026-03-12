import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ColorFamily, HelmetFinish } from '../../enums';

export class CreateHelmetVariantDto {
  @IsString()
  colorName: string;

  @IsArray()
  @IsEnum(ColorFamily, { each: true })
  colorFamilies: ColorFamily[];

  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish;

  @IsOptional()
  @IsString()
  graphicName?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrl?: string[];
}
