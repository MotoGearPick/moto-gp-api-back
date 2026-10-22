import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../../../common/pagination';
import { toArray } from '../../../../../common/transforms';
import {
  ColorFamily,
  HelmetCertification,
  HelmetClosureType,
  HelmetFinish,
  HelmetPurpose,
  HelmetShape,
  HelmetShellMaterial,
  VisorPinlock,
} from '../../enums';

export class FilterHelmetVariantsDto extends PaginationDto {
  // ─── Búsqueda general ────────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Busca en nombre del modelo, marca, color, gráfico y SKU' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['colorName', 'createdAt', 'updatedAt'] })
  @IsOptional()
  @IsIn(['colorName', 'createdAt', 'updatedAt'])
  sortBy?: 'colorName' | 'createdAt' | 'updatedAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  // ─── Filtros de variante ─────────────────────────────────────────────────────

  @ApiPropertyOptional({ enum: ColorFamily, isArray: true, description: 'La variante tiene TODOS estos colores' })
  @IsOptional()
  @IsArray()
  @IsEnum(ColorFamily, { each: true })
  @Transform(toArray)
  colorFamily?: ColorFamily[];

  @ApiPropertyOptional({ description: 'Si es true, la variante tiene SOLO esos colores. Requiere colorFamily.' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  exclusive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingImages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingSku?: boolean;

  @ApiPropertyOptional({ description: 'Gráfico vacío o "Mono" (pendiente de restaurar)' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingGraphic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  exposedCarbon?: boolean;

  @ApiPropertyOptional({ description: 'Variantes de color sólido, sin gráfico' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isMono?: boolean;

  @ApiPropertyOptional({ enum: HelmetFinish, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetFinish, { each: true })
  @Transform(toArray)
  finish?: HelmetFinish[];

  // ─── Filtros de modelo ───────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'UUID del modelo de casco' })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({ description: 'Slugs de marca', isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(toArray)
  brandSlug?: string[];

  @ApiPropertyOptional({ enum: HelmetShape, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShape, { each: true })
  @Transform(toArray)
  shape?: HelmetShape[];

  @ApiPropertyOptional({ enum: HelmetPurpose, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetPurpose, { each: true })
  @Transform(toArray)
  purpose?: HelmetPurpose[];

  @ApiPropertyOptional({ enum: HelmetShellMaterial, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShellMaterial, { each: true })
  @Transform(toArray)
  shellMaterial?: HelmetShellMaterial[];

  @ApiPropertyOptional({ enum: HelmetClosureType })
  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @ApiPropertyOptional({ enum: VisorPinlock, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(VisorPinlock, { each: true })
  @Transform(toArray)
  visorPinlockCompatible?: VisorPinlock[];

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorPinlockIncluded?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  tearOffCompatible?: boolean;

  @ApiPropertyOptional({ enum: HelmetCertification, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(toArray)
  certification?: HelmetCertification[];

  @ApiPropertyOptional({ minimum: 1, description: 'Número mínimo de tamaños de shell disponibles' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minShellSizes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  sunVisor?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  intercomReady?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorAntiScratch?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorAntiFog?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  removableLining?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  washableLining?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  emergencyRelease?: boolean;

  @ApiPropertyOptional({ minimum: 1, maximum: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minSafetyRating?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxWeightGrams?: number;

  // ─── Filtros de inventario ───────────────────────────────────────────────────

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ description: 'Ej: XS, S, M, L, XL, XXL' })
  @IsOptional()
  @IsString()
  sizeLabel?: string;

  // Solo tiene efecto en el endpoint admin
  @ApiPropertyOptional({ description: 'Incluir variantes y modelos con soft delete' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDeleted?: boolean;
}
