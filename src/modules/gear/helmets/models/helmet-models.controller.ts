import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelmetModelsService } from './helmet-models.service';
import { FilterHelmetModelsDto } from './dto/filter-helmet-models.dto';

@ApiTags('Helmets')
@Controller('gear/helmets')
export class HelmetModelsController {
  constructor(private readonly service: HelmetModelsService) {}

  @Get('brands')
  @ApiOperation({
    summary: 'Listar marcas con cascos',
    description: 'Retorna solo las marcas que tienen al menos un modelo de casco activo.',
  })
  @ApiResponse({ status: 200, description: 'Lista de marcas' })
  findBrands() {
    return this.service.findBrands();
  }

  @Get()
  @ApiOperation({
    summary: 'Listar cascos',
    description: 'Retorna cascos activos con sus variantes, tallas y precio mínimo por tienda. Soporta múltiples filtros.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de cascos' })
  findAll(@Query() filters: FilterHelmetModelsDto) {
    return this.service.findAll(filters, false);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener casco por ID',
    description: 'Retorna el detalle completo de un casco con todas sus variantes y tallas.',
  })
  @ApiParam({ name: 'id', description: 'UUID del modelo de casco' })
  @ApiResponse({ status: 200, description: 'Detalle del casco' })
  @ApiResponse({ status: 404, description: 'Casco no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, false);
  }
}
