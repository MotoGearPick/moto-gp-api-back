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

  @IsEnum(HelmetType)
  helmetType: HelmetType;

  @IsOptional()
  @IsInt()
  @Min(1)
  safetyRating?: number;

  @IsOptional()
  @IsEnum(HelmetShellMaterial)
  shellMaterial?: HelmetShellMaterial;

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
  @IsEnum(VisorPinlock)
  visorPinlock?: VisorPinlock;

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
}
