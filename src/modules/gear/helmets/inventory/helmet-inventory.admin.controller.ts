import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccessTokenGuard } from '../../../auth/guards';
import { HelmetInventoryService } from './helmet-inventory.service';
import { CreateHelmetInventoryDto } from './dto/create-helmet-inventory.dto';
import { UpdateHelmetInventoryDto } from './dto/update-helmet-inventory.dto';

@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Helmet Inventory')
@Controller('admin/gear/helmets/inventory')
export class HelmetInventoryAdminController {
  constructor(private readonly service: HelmetInventoryService) {}

  @Post()
  @ApiOperation({
    summary: '[Admin] Agregar entrada de inventario',
    description:
      'Crea un registro de precio y stock para una variante/talla específica en una tienda afiliada. ' +
      'La combinación variantId + sizeId + storeId debe ser única.',
  })
  @ApiBody({ type: CreateHelmetInventoryDto })
  @ApiResponse({ status: 201, description: 'Inventario creado' })
  @ApiResponse({ status: 400, description: 'Combinación variante+talla+tienda ya existe o datos inválidos' })
  create(@Body() dto: CreateHelmetInventoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: '[Admin] Actualizar inventario',
    description: 'Actualiza precio, stock o URL de afiliado. Registra `lastChecked` automáticamente. Todos los campos son opcionales.',
  })
  @ApiParam({ name: 'id', description: 'UUID del registro de inventario' })
  @ApiBody({ type: UpdateHelmetInventoryDto })
  @ApiResponse({ status: 200, description: 'Inventario actualizado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateHelmetInventoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[Admin] Eliminar inventario',
    description: 'Elimina permanentemente el registro de precio/stock de una tienda para una talla.',
  })
  @ApiParam({ name: 'id', description: 'UUID del registro de inventario' })
  @ApiResponse({ status: 204, description: 'Inventario eliminado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
