import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HelmetVariantsService } from './helmet-variants.service';
import { FilterHelmetVariantsDto } from './dto/filter-helmet-variants.dto';

@ApiTags('Helmets')
@Controller('gear/helmets/variants')
export class HelmetVariantsController {
  constructor(private readonly service: HelmetVariantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos los cascos (variantes)',
    description:
      'Retorna todas las variantes activas con su modelo, tallas e inventario. ' +
      'Soporta filtros por modelo, características técnicas, color, precio, talla y búsqueda por nombre.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de variantes' })
  findAll(@Query() filters: FilterHelmetVariantsDto) {
    return this.service.findAllPublic(filters);
  }
}
