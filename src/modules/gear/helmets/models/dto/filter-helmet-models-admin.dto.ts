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

export class FilterHelmetModelsAdminDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(toArray)
  brandSlug?: string[];

  @IsOptional()
  @IsIn(['name', 'createdAt', 'updatedAt', 'safetyRating', 'weightGrams'])
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'safetyRating' | 'weightGrams';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  // Variant appearance: a model matches when at least one live variant matches all of these.
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
  @IsArray()
  @IsEnum(HelmetFinish, { each: true })
  @Transform(toArray)
  finish?: HelmetFinish[];

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  exposedCarbon?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isMono?: boolean;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

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
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorAntiScratch?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  visorAntiFog?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  sunVisor?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  intercomReady?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  removableLining?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  washableLining?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  emergencyRelease?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  minSafetyRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  maxSafetyRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minWeightGrams?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxWeightGrams?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(toArray)
  certification?: HelmetCertification[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minCreatedAt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxCreatedAt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minUpdatedAt?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxUpdatedAt?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeDeleted?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onlyDeleted?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingWeightGrams?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingSafetyRating?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingSunVisorType?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingIntercomDesignedBrand?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingIntercomDesignedModel?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  missingPinlockDksCode?: boolean;
}
