import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ColorFamily, HelmetFinish } from '../../../../modules/gear/helmets/enums';

export class CreateHelmetVariantDto {
  @ApiProperty({ example: 'Pearl Gloss Black', description: 'Nombre del color de la variante' })
  @IsString()
  colorName: string;

  @ApiProperty({
    enum: ColorFamily,
    isArray: true,
    example: ['black'],
    description: 'Familias de color para filtrado (puede ser más de una)',
  })
  @IsArray()
  @IsEnum(ColorFamily, { each: true })
  colorFamilies: ColorFamily[];

  @ApiPropertyOptional({ enum: HelmetFinish, description: 'Acabado de la pintura' })
  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish;

  @ApiPropertyOptional({ example: 'Winter Test Edition', description: 'Nombre del gráfico o edición especial' })
  @IsOptional()
  @IsString()
  graphicName?: string;

  @ApiPropertyOptional({ example: 'SHO-RF14-BLK-XL', description: 'SKU interno' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://cdn.example.com/img1.jpg'],
    description: 'URLs de imágenes de la variante',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrl?: string[];
}
