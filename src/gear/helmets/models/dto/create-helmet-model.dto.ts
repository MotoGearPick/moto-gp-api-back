import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
} from '../../../../modules/gear/helmets/enums';

export class CreateHelmetModelDto {
  @ApiProperty({ example: 'RF-1400', description: 'Nombre del modelo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'rf-1400', description: 'Slug URL-friendly único por marca' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'uuid-de-la-marca', description: 'ID de la marca' })
  @IsString()
  brandId: string;

  @ApiProperty({ enum: HelmetType, description: 'Tipo de casco' })
  @IsEnum(HelmetType)
  helmetType: HelmetType;

  @ApiPropertyOptional({ minimum: 1, maximum: 5, example: 5, description: 'Rating de seguridad SHARP (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  safetyRating?: number;

  @ApiPropertyOptional({ enum: HelmetShellMaterial, description: 'Material de la carcasa' })
  @IsOptional()
  @IsEnum(HelmetShellMaterial)
  shellMaterial?: HelmetShellMaterial;

  @ApiPropertyOptional({ example: 3, description: 'Número de tallas de carcasa disponibles' })
  @IsOptional()
  @IsInt()
  @Min(1)
  shellSizes?: number;

  @ApiPropertyOptional({ example: 1450, description: 'Peso en gramos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  weightGrams?: number;

  @ApiPropertyOptional({ default: false, description: 'Visera anti-arañazos' })
  @IsOptional()
  @IsBoolean()
  visorAntiScratch?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Visera anti-vaho' })
  @IsOptional()
  @IsBoolean()
  visorAntiFog?: boolean;

  @ApiPropertyOptional({ enum: VisorPinlock, default: 'not_compatible', description: 'Compatibilidad con Pinlock' })
  @IsOptional()
  @IsEnum(VisorPinlock)
  visorPinlock?: VisorPinlock;

  @ApiPropertyOptional({ default: false, description: 'Tiene visor solar integrado' })
  @IsOptional()
  @IsBoolean()
  sunVisor?: boolean;

  @ApiPropertyOptional({ example: 'Drop down interno', description: 'Descripción del tipo de visor solar' })
  @IsOptional()
  @IsString()
  sunVisorType?: string;

  @ApiPropertyOptional({ default: false, description: 'Preparado para intercom' })
  @IsOptional()
  @IsBoolean()
  intercomReady?: boolean;

  @ApiPropertyOptional({ example: 'Sena', description: 'Marca de intercom diseñado para este casco' })
  @IsOptional()
  @IsString()
  intercomDesignedBrand?: string;

  @ApiPropertyOptional({ example: 'SRL2', description: 'Modelo de intercom diseñado para este casco' })
  @IsOptional()
  @IsString()
  intercomDesignedModel?: string;

  @ApiPropertyOptional({ default: true, description: 'Interior desmontable' })
  @IsOptional()
  @IsBoolean()
  removableLining?: boolean;

  @ApiPropertyOptional({ default: true, description: 'Interior lavable' })
  @IsOptional()
  @IsBoolean()
  washableLining?: boolean;

  @ApiPropertyOptional({ default: false, description: 'Sistema de liberación de emergencia' })
  @IsOptional()
  @IsBoolean()
  emergencyRelease?: boolean;

  @ApiPropertyOptional({ enum: HelmetClosureType, description: 'Tipo de cierre de la correa' })
  @IsOptional()
  @IsEnum(HelmetClosureType)
  closureType?: HelmetClosureType;

  @ApiPropertyOptional({
    enum: HelmetCertification,
    isArray: true,
    example: ['dot', 'ece_2206'],
    description: 'Certificaciones de seguridad',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(HelmetCertification, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  certification?: HelmetCertification[];
}
