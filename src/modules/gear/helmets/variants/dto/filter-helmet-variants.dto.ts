import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
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
import {
  ColorFamily,
  HelmetCertification,
  HelmetClosureType,
  HelmetFinish,
  HelmetShellMaterial,
  HelmetType,
  VisorPinlock,
} from '../../enums';

export class FilterHelmetVariantsDto extends PaginationDto {
  // ─── Búsqueda general ────────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'Busca en nombre del modelo, marca, color y gráfico' })
  @IsOptional()
  @IsString()
  search?: string;

  // ─── Filtros de variante ─────────────────────────────────────────────────────

  @ApiPropertyOptional({ enum: ColorFamily })
  @IsOptional()
  @IsEnum(ColorFamily)
  colorFamily?: ColorFamily;

  @ApiPropertyOptional({ enum: HelmetFinish })
  @IsOptional()
  @IsEnum(HelmetFinish)
  finish?: HelmetFinish;

  // ─── Filtros de modelo ───────────────────────────────────────────────────────

  @ApiPropertyOptional({ description: 'UUID del modelo de casco' })
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @ApiPropertyOptional({ description: 'Slug de la marca' })
  @IsOptional()
  @IsString()
  brandSlug?: string;

  @ApiPropertyOptional({ enum: HelmetType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  type?: HelmetType[];

  @ApiPropertyOptional({ enum: HelmetShellMaterial, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShellMaterial, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  shellMaterial?: HelmetShellMaterial[];

  @ApiPropertyOptional({ enum: HelmetClosureType })
  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @ApiPropertyOptional({ enum: VisorPinlock, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(VisorPinlock, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
  @IsEnum(HelmetCertification, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  certification?: HelmetCertification[];

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
