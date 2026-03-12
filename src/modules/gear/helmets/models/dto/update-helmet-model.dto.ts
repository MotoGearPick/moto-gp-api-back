import { PartialType } from '@nestjs/swagger';
import { CreateHelmetModelDto } from './create-helmet-model.dto';

export class UpdateHelmetModelDto extends PartialType(CreateHelmetModelDto) {}
