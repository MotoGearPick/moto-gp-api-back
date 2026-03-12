import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccessTokenGuard } from '../../../auth/guards';
import { HelmetSizesService } from './helmet-sizes.service';
import { CreateHelmetSizeDto } from './dto/create-helmet-size.dto';

@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Helmet Sizes')
@Controller('admin/gear/helmets/:modelId/sizes')
export class HelmetSizesAdminController {
  constructor(private readonly service: HelmetSizesService) {}

  @Get()
  @ApiOperation({
    summary: '[Admin] Listar tallas de un modelo',
    description: 'Retorna las tallas disponibles con su inventario detallado por tienda.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiResponse({ status: 200, description: 'Lista de tallas con inventario' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  findAll(@Param('modelId') modelId: string) {
    return this.service.findAll(modelId);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Agregar talla a un modelo' })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiBody({ type: CreateHelmetSizeDto })
  @ApiResponse({ status: 201, description: 'Talla creada' })
  @ApiResponse({ status: 400, description: 'Talla ya existe para este modelo' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  create(
    @Param('modelId') modelId: string,
    @Body() dto: CreateHelmetSizeDto,
  ) {
    return this.service.create(modelId, dto);
  }

  @Delete(':sizeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[Admin] Eliminar talla',
    description: 'Elimina permanentemente la talla y su inventario asociado (cascade). No tiene restore.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiParam({ name: 'sizeId', description: 'UUID de la talla' })
  @ApiResponse({ status: 204, description: 'Talla eliminada' })
  @ApiResponse({ status: 404, description: 'Talla o modelo no encontrado' })
  remove(
    @Param('modelId') modelId: string,
    @Param('sizeId') sizeId: string,
  ) {
    return this.service.remove(modelId, sizeId);
  }
}
