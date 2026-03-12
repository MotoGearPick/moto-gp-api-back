import { PartialType } from '@nestjs/swagger';
import { CreateHelmetVariantDto } from './create-helmet-variant.dto';

export class UpdateHelmetVariantDto extends PartialType(CreateHelmetVariantDto) {}
