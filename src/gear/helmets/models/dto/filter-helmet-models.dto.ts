import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { PaginationDto } from '../../../../common/pagination';
import {
  ColorFamily,
  HelmetCertification,
  HelmetClosureType,
  HelmetShellMaterial,
  HelmetType,
  VisorPinlock,
} from '../../../../modules/gear/helmets/enums';

export class FilterHelmetModelsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Slug de la marca (ej: shoei, arai)' })
  @IsOptional()
  brandSlug?: string;

  @ApiPropertyOptional({ enum: HelmetType, description: 'Tipo de casco' })
  @IsOptional()
  @IsEnum(HelmetType)
  type?: HelmetType;

  @ApiPropertyOptional({ enum: HelmetShellMaterial, description: 'Material de la carcasa' })
  @IsOptional()
  @IsEnum(HelmetShellMaterial)
  shellMaterial?: HelmetShellMaterial;

  @ApiPropertyOptional({ enum: HelmetClosureType, description: 'Tipo de cierre' })
  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @ApiPropertyOptional({ enum: VisorPinlock, description: 'Compatibilidad con Pinlock' })
  @IsOptional()
  @IsEnum(VisorPinlock)
  visorPinlock?: VisorPinlock;

  @ApiPropertyOptional({
    enum: HelmetCertification,
    isArray: true,
    description: 'Certificaciones requeridas (se pueden pasar múltiples)',
  })
  @IsOptional()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  certification?: HelmetCertification[];

  @ApiPropertyOptional({ enum: ColorFamily, description: 'Familia de color de la variante' })
  @IsOptional()
  @IsEnum(ColorFamily)
  colorFamily?: ColorFamily;

  @ApiPropertyOptional({ description: 'Filtrar cascos con visor solar integrado' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  sunVisor?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar cascos preparados para intercom' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  intercomReady?: boolean;

  @ApiPropertyOptional({ minimum: 1, maximum: 5, description: 'Rating de seguridad mínimo (1-5)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minSafetyRating?: number;

  @ApiPropertyOptional({ description: 'Peso máximo en gramos' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxWeightGrams?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Precio mínimo (USD)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Precio máximo (USD)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Incluir cascos eliminados (soft delete) — solo admin' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDeleted?: boolean;
}
