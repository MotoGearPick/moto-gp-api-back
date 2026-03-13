import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BrandsService } from './brands.service';
import { GearType } from '../common/enums/gear-type.enum';

class BrandsQueryDto {
  @IsOptional()
  @IsEnum(GearType)
  category?: GearType;
}

@ApiTags('Brands')
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
