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
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AdminRole } from '@prisma/products-client';
import { AuthAdminService } from '../services/auth.admin.service';
import { LoginAdminDto } from '../dto';
import { RegisterAdminDto } from '../dto';
import {
  AdminAccessTokenGuard,
  AdminRefreshTokenGuard,
  LoginGuard,
  RolesGuard,
} from '../guards';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../../../common/decorators';
import {
  ADMIN_REFRESH_COOKIE,
  clearRefreshCookieOptions,
  refreshCookieOptions,
} from '../cookies';

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
  @ApiResponse({ status: 200, description: 'Login exitoso. Retorna accessToken; el refreshToken se setea en cookie httpOnly' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.generateTokens(req.user);
    res.cookie(ADMIN_REFRESH_COOKIE, refreshToken, refreshCookieOptions());
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminRefreshTokenGuard)
  @ApiOperation({ summary: '[Admin] Refrescar el access token usando la cookie de refresh' })
  @ApiResponse({ status: 200, description: 'Nuevo accessToken; rota la cookie de refresh' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  @ApiResponse({ status: 404, description: 'Admin no encontrado' })
  async refresh(
    @UserId() id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.refreshTokens(id);
    res.cookie(ADMIN_REFRESH_COOKIE, refreshToken, refreshCookieOptions());
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Cerrar sesión (limpia la cookie de refresh)' })
  @ApiResponse({ status: 204, description: 'Sesión cerrada' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ADMIN_REFRESH_COOKIE, clearRefreshCookieOptions());
  }

  @Get('me')
  @UseGuards(AdminAccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Perfil del admin autenticado (incluye rol)' })
  @ApiResponse({ status: 200, description: 'Perfil del admin actual' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  me(@UserId() id: string) {
    return this.service.findOne(id);
  }

  @Post('register')
  @UseGuards(AdminAccessTokenGuard, RolesGuard)
  @Roles(AdminRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Registrar nuevo usuario admin' })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({ status: 201, description: 'Usuario admin creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 409, description: 'Email ya en uso' })
  async register(@Body() dto: RegisterAdminDto) {
    return this.service.register(dto);
  }

  @Get('users')
  @UseGuards(AdminAccessTokenGuard, RolesGuard)
  @Roles(AdminRole.superadmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.service.findAll();
  }

  @Get('users/:id')
  @UseGuards(AdminAccessTokenGuard, RolesGuard)
  @Roles(AdminRole.superadmin)
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
  @UseGuards(AdminAccessTokenGuard, RolesGuard)
  @Roles(AdminRole.superadmin)
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
