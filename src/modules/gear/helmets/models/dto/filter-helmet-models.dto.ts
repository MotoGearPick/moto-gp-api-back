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
import { PaginationDto } from '../../../../../common/pagination';
import {
  ColorFamily,
  HelmetCertification,
  HelmetClosureType,
  HelmetShellMaterial,
  HelmetType,
  VisorPinlock,
} from '../../enums';

export class FilterHelmetModelsDto extends PaginationDto {
  @IsOptional()
  brandSlug?: string;

  @IsOptional()
  @IsEnum(HelmetType)
  type?: HelmetType;

  @IsOptional()
  @IsEnum(HelmetShellMaterial)
  shellMaterial?: HelmetShellMaterial;

  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @IsOptional()
  @IsEnum(VisorPinlock)
  visorPinlock?: VisorPinlock;

  @IsOptional()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  certification?: HelmetCertification[];

  @IsOptional()
  @IsEnum(ColorFamily)
  colorFamily?: ColorFamily;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  sunVisor?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  intercomReady?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minSafetyRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxWeightGrams?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  // Solo tiene efecto en admin view
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDeleted?: boolean;
}
