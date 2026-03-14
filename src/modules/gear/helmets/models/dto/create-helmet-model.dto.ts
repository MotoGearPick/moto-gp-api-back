import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  HelmetCertification,
  HelmetClosureType,
  HelmetShellMaterial,
  HelmetType,
  VisorPinlock,
} from '../../enums';

export class CreateHelmetModelDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  brandId: string;

  @IsArray()
  @IsEnum(HelmetType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  helmetType: HelmetType[];

  @IsOptional()
  @IsInt()
  @Min(1)
  safetyRating?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetShellMaterial, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  shellMaterial?: HelmetShellMaterial[];

  @IsOptional()
  @IsInt()
  @Min(1)
  shellSizes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  weightGrams?: number;

  @IsOptional()
  @IsBoolean()
  visorAntiScratch?: boolean;

  @IsOptional()
  @IsBoolean()
  visorAntiFog?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(VisorPinlock, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  visorPinlockCompatible?: VisorPinlock[];

  @IsOptional()
  @IsBoolean()
  visorPinlockIncluded?: boolean;

  @IsOptional()
  @IsString()
  pinlockDksCode?: string;

  @IsOptional()
  @IsBoolean()
  tearOffCompatible?: boolean;

  @IsOptional()
  @IsBoolean()
  sunVisor?: boolean;

  @IsOptional()
  @IsString()
  sunVisorType?: string;

  @IsOptional()
  @IsBoolean()
  intercomReady?: boolean;

  @IsOptional()
  @IsString()
  intercomDesignedBrand?: string;

  @IsOptional()
  @IsString()
  intercomDesignedModel?: string;

  @IsOptional()
  @IsBoolean()
  removableLining?: boolean;

  @IsOptional()
  @IsBoolean()
  washableLining?: boolean;

  @IsOptional()
  @IsBoolean()
  emergencyRelease?: boolean;

  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @IsOptional()
  @IsArray()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  certification?: HelmetCertification[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  includedAccessories?: string[];
}
