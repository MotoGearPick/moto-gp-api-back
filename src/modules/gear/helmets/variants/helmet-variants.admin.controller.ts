import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccessTokenGuard } from '../../../auth/guards';
import { HelmetVariantsService } from './helmet-variants.service';
import { CreateHelmetVariantDto } from './dto/create-helmet-variant.dto';
import { UpdateHelmetVariantDto } from './dto/update-helmet-variant.dto';
import { FilterHelmetVariantsDto } from './dto/filter-helmet-variants.dto';

@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Helmet Variants')
@Controller()
export class HelmetVariantsAdminController {
  constructor(private readonly service: HelmetVariantsService) {}

  @Get('admin/gear/helmets/variants')
  @ApiOperation({
    summary: '[Admin] Listar todas las variantes',
    description: 'Lista global paginada de variantes con filtros avanzados (incluye datos del modelo).',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de variantes (vista admin)' })
  findAllGlobal(@Query() filters: FilterHelmetVariantsDto) {
    return this.service.findAllAdmin(filters);
  }

  @Get('admin/gear/helmets/:modelId/variants')
  @ApiOperation({
    summary: '[Admin] Listar variantes de un casco',
    description: 'Retorna todas las variantes (colores) del modelo con tallas e inventario.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiQuery({ name: 'includeDeleted', required: false, type: Boolean, description: 'Incluir variantes con soft delete' })
  @ApiResponse({ status: 200, description: 'Lista de variantes' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  findAll(
    @Param('modelId') modelId: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.service.findAll(modelId, includeDeleted === 'true');
  }

  @Get('admin/gear/helmets/:modelId/variants/:variantId')
  @ApiOperation({ summary: '[Admin] Obtener variante por ID' })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiParam({ name: 'variantId', description: 'UUID de la variante' })
  @ApiResponse({ status: 200, description: 'Detalle de la variante con tallas e inventario' })
  @ApiResponse({ status: 404, description: 'Variante o modelo no encontrado' })
  findOne(
    @Param('modelId') modelId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.service.findOne(modelId, variantId);
  }

  @Post('admin/gear/helmets/:modelId/variants')
  @ApiOperation({
    summary: '[Admin] Crear variante',
    description: 'Agrega un nuevo color/variante al modelo de casco.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiBody({ type: CreateHelmetVariantDto })
  @ApiResponse({ status: 201, description: 'Variante creada' })
  @ApiResponse({ status: 404, description: 'Modelo no encontrado' })
  create(
    @Param('modelId') modelId: string,
    @Body() dto: CreateHelmetVariantDto,
  ) {
    return this.service.create(modelId, dto);
  }

  @Put('admin/gear/helmets/:modelId/variants/:variantId')
  @ApiOperation({
    summary: '[Admin] Actualizar variante',
    description: 'Todos los campos son opcionales.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiParam({ name: 'variantId', description: 'UUID de la variante' })
  @ApiBody({ type: UpdateHelmetVariantDto })
  @ApiResponse({ status: 200, description: 'Variante actualizada' })
  @ApiResponse({ status: 404, description: 'Variante o modelo no encontrado' })
  update(
    @Param('modelId') modelId: string,
    @Param('variantId') variantId: string,
    @Body() dto: UpdateHelmetVariantDto,
  ) {
    return this.service.update(modelId, variantId, dto);
  }

  @Delete('admin/gear/helmets/:modelId/variants/:variantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[Admin] Eliminar variante (soft delete)',
    description: 'Restaurable con /:variantId/restore.',
  })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiParam({ name: 'variantId', description: 'UUID de la variante' })
  @ApiResponse({ status: 204, description: 'Variante eliminada (soft delete)' })
  @ApiResponse({ status: 404, description: 'Variante o modelo no encontrado' })
  remove(
    @Param('modelId') modelId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.service.remove(modelId, variantId);
  }

  @Post('admin/gear/helmets/:modelId/variants/:variantId/restore')
  @ApiOperation({ summary: '[Admin] Restaurar variante eliminada' })
  @ApiParam({ name: 'modelId', description: 'UUID del modelo de casco' })
  @ApiParam({ name: 'variantId', description: 'UUID de la variante' })
  @ApiResponse({ status: 201, description: 'Variante restaurada' })
  @ApiResponse({ status: 404, description: 'Variante o modelo no encontrado' })
  restore(
    @Param('modelId') modelId: string,
    @Param('variantId') variantId: string,
  ) {
    return this.service.restore(modelId, variantId);
  }
}
