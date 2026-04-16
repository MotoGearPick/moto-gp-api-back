import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly service: StoresService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tiendas afiliadas activas' })
  @ApiResponse({ status: 200, description: 'Lista de tiendas' })
  findAll() {
    return this.service.findAll();
  }
}