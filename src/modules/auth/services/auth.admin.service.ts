import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Admin, AdminRole } from '@prisma/app-client';
import * as bcrypt from 'bcrypt';
import { config } from '../../../config';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterAdminDto } from '../dto';

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(admin: { id: string; role: AdminRole }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(admin),
      this.getRefreshToken(admin),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(id: string) {
    // El admin pudo haber sido eliminado después de emitir el refresh token.
    // Re-read the role so permission changes take effect on refresh.
    const admin = await this.authRepository.findByIdOrFail(id);
    return this.generateTokens({ id, role: admin.role });
  }

  private getAccessToken(admin: { id: string; role: AdminRole }): Promise<string> {
    const opts: JwtSignOptions = {
      secret: config().JWT_ADMIN_ACCESS_SECRET,
      expiresIn: config().JWT_ADMIN_ACCESS_EXPIRES as unknown as number,
    };
    return this.jwtService.signAsync({ id: admin.id, role: admin.role }, opts);
  }

  private getRefreshToken(admin: { id: string; role: AdminRole }): Promise<string> {
    const opts: JwtSignOptions = {
      secret: config().JWT_ADMIN_REFRESH_SECRET,
      expiresIn: config().JWT_ADMIN_REFRESH_EXPIRES as unknown as number,
    };
    return this.jwtService.signAsync({ id: admin.id, role: admin.role }, opts);
  }

  async register(dto: RegisterAdminDto) {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const admin = await this.authRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role ?? AdminRole.superadmin,
    });

    return { admin: this.mapAdmin(admin) };
  }

  async findAll() {
    const admins = await this.authRepository.findAll();
    return admins.map((a) => this.mapAdmin(a));
  }

  async findOne(id: string) {
    const admin = await this.authRepository.findByIdOrFail(id);
    return this.mapAdmin(admin);
  }

  async remove(id: string) {
    await this.authRepository.findByIdOrFail(id);
    await this.authRepository.remove(id);
  }

  mapAdmin(admin: Admin) {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
