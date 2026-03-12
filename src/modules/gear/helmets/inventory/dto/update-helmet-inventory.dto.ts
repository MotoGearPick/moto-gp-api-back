import { PartialType } from '@nestjs/swagger';
import { CreateHelmetInventoryDto } from './create-helmet-inventory.dto';

export class UpdateHelmetInventoryDto extends PartialType(CreateHelmetInventoryDto) {}
