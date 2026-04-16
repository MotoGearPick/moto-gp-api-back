import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthAdminService } from '../services/auth.admin.service';
import { LoginAdminDto } from '../dto';
import { RegisterAdminDto } from '../dto';
import { AdminAccessTokenGuard, LoginGuard } from '../guards';

@SkipThrottle()
@ApiTags('Admin — Auth')
@Controller('admin/auth')
export class AuthAdminController {
  constructor(private readonly service: AuthAdminService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SkipThrottle({skip: false})
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @UseGuards(LoginGuard)
  @ApiOperation({ summary: '[Admin] Iniciar sesión' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna el token de acceso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req: any) {
    const tokens = await this.service.generateTokens(req.user);
    return { ...tokens };
  }

  @Post('register')
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Registrar nuevo usuario admin' })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({ status: 201, description: 'Usuario admin creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Email ya en uso' })
  register(@Body() dto: RegisterAdminDto) {
    return this.service.register(dto);
  }

  @Get('users')
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.service.findAll();
  }

  @Get('users/:id')
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Detalle del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Eliminar usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
