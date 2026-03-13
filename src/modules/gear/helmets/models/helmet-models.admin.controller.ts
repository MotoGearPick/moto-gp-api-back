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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccessTokenGuard } from '../../../auth/guards';
import { HelmetModelsService } from './helmet-models.service';
import { HelmetVariantsService } from '../variants/helmet-variants.service';
import { FilterHelmetModelsDto } from './dto/filter-helmet-models.dto';
import { FilterHelmetVariantsDto } from '../variants/dto/filter-helmet-variants.dto';
import { CreateHelmetModelDto } from './dto/create-helmet-model.dto';
import { UpdateHelmetModelDto } from './dto/update-helmet-model.dto';

@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Helmets')
@Controller('admin/gear/helmets')
export class HelmetModelsAdminController {
  constructor(
    private readonly service: HelmetModelsService,
    private readonly variantsService: HelmetVariantsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '[Admin] Listar cascos',
    description: 'Igual que el endpoint público pero incluye campos internos (SKU, deletedAt). Usa `includeDeleted=true` para ver eliminados.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de cascos (vista admin)' })
  findAll(@Query() filters: FilterHelmetModelsDto) {
    return this.service.findAll(filters, true);
  }

  @Get('variants')
  @ApiOperation({
    summary: '[Admin] Listar todas las variantes',
    description: 'Lista plana de todas las variantes con su modelo. Usa `includeDeleted=true` para ver eliminadas.',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de variantes (vista admin)' })
  findAllVariants(@Query() filters: FilterHelmetVariantsDto) {
    return this.variantsService.findAllAdmin(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: '[Admin] Obtener casco por ID',
    description: 'Incluye todos los campos internos y variantes eliminadas.',
  })
  @ApiParam({ name: 'id', description: 'UUID del modelo de casco' })
  @ApiResponse({ status: 200, description: 'Detalle completo del casco (vista admin)' })
  @ApiResponse({ status: 404, description: 'Casco no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id, true);
  }

  @Post()
  @ApiOperation({ summary: '[Admin] Crear modelo de casco' })
  @ApiBody({ type: CreateHelmetModelDto })
  @ApiResponse({ status: 201, description: 'Casco creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: CreateHelmetModelDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: '[Admin] Actualizar modelo de casco',
    description: 'Todos los campos son opcionales (actualización parcial).',
  })
  @ApiParam({ name: 'id', description: 'UUID del modelo de casco' })
  @ApiBody({ type: UpdateHelmetModelDto })
  @ApiResponse({ status: 200, description: 'Casco actualizado' })
  @ApiResponse({ status: 404, description: 'Casco no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateHelmetModelDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '[Admin] Eliminar casco (soft delete)',
    description: 'Marca el casco como eliminado sin borrarlo de la base de datos. Restaurable con /restore.',
  })
  @ApiParam({ name: 'id', description: 'UUID del modelo de casco' })
  @ApiResponse({ status: 204, description: 'Casco eliminado (soft delete)' })
  @ApiResponse({ status: 404, description: 'Casco no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: '[Admin] Restaurar casco eliminado',
    description: 'Revierte el soft delete, el casco vuelve al estado activo.',
  })
  @ApiParam({ name: 'id', description: 'UUID del modelo de casco' })
  @ApiResponse({ status: 201, description: 'Casco restaurado' })
  @ApiResponse({ status: 404, description: 'Casco no encontrado' })
  restore(@Param('id') id: string) {
    return this.service.restore(id);
  }
}
