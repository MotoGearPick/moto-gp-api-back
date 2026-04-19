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
import { PaginationDto } from '../../../../../common/pagination';
import {
  HelmetCertification,
  HelmetClosureType,
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
  @IsString()
  brandSlug?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShape, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  shape?: HelmetShape[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetPurpose, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  purpose?: HelmetPurpose[];

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShellMaterial, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  shellMaterial?: HelmetShellMaterial[];

  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @IsOptional()
  @IsArray()
  @IsEnum(VisorPinlock, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
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
