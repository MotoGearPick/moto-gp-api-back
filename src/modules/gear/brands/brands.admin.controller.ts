import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccessTokenGuard } from '../../auth/guards';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Brands')
@Controller('admin/gear/brands')
export class BrandsAdminController {
  constructor(private readonly service: BrandsService) {}

  @Post()
  @ApiOperation({ summary: '[Admin] Crear marca' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ status: 201, description: 'Marca creada' })
  @ApiResponse({ status: 409, description: 'Ya existe una marca con ese nombre o slug' })
  create(@Body() dto: CreateBrandDto) {
    return this.service.create(dto);
  }
}
