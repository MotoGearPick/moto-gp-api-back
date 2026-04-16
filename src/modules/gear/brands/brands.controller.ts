import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiKeyGuard } from '../../../common/guards';
import { BrandsService } from './brands.service';
import { GearType } from '../common/enums/gear-type.enum';

class BrandsQueryDto {
  @IsOptional()
  @IsEnum(GearType)
  category?: GearType;
}

@ApiTags('Brands')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('gear/brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar marcas',
    description: 'Sin `category` devuelve todas las marcas activas. Con `category` filtra solo las que tienen productos activos en esa categoría.',
  })
  @ApiQuery({ name: 'category', required: false, enum: GearType })
  @ApiResponse({ status: 200, description: 'Lista de marcas' })
  findAll(@Query() query: BrandsQueryDto) {
    return this.service.findAll(query.category);
  }
}
