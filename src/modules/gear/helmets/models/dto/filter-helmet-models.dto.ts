import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
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

export class FilterHelmetModelsDto extends PaginationDto {
  // The public listing sorts and pages client-side, so it asks for the whole catalog.
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @Transform(toArray)
  brandSlug?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShape, { each: true })
  @Transform(toArray)
  shape?: HelmetShape[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetPurpose, { each: true })
  @Transform(toArray)
  purpose?: HelmetPurpose[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShellMaterial, { each: true })
  @Transform(toArray)
  shellMaterial?: HelmetShellMaterial[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetClosureType, { each: true })
  @Transform(toArray)
  closureType?: HelmetClosureType[];

  @IsOptional()
  @IsArray()
  @IsEnum(VisorPinlock, { each: true })
  @Transform(toArray)
  visorPinlockCompatible?: VisorPinlock[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorPinlockIncluded?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  tearOffCompatible?: boolean;

  @IsOptional()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(toArray)
  certification?: HelmetCertification[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minShellSizes?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetFinish, { each: true })
  @Transform(toArray)
  finish?: HelmetFinish[];

  @IsOptional()
  @IsArray()
  @IsEnum(ColorFamily, { each: true })
  @Transform(toArray)
  colorFamily?: ColorFamily[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  exclusive?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  exposedCarbon?: boolean;

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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  emergencyRelease?: boolean;

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
}
