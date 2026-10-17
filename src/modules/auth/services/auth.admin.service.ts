import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Admin, AdminRole } from '@prisma/products-client';
import * as bcrypt from 'bcrypt';
import Valkey from 'iovalkey';
import { VALKEY_CLIENT } from '../../valkey/valkey.constants';
import { config } from '../../../config';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterAdminDto } from '../dto';

const logoutKey = (adminId: string) => `auth:logout:${adminId}`;

@Injectable()
export class AuthAdminService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    @Inject(VALKEY_CLIENT) private readonly valkey: Valkey,
  ) {}

  // Refresh tokens are stateless JWTs and rotate on every refresh, so logout records a cutoff:
  // every refresh token of this admin issued up to now stops working, including older rotated ones.
  // One small key per admin, kept forever.
  async revokeSessions(adminId: string): Promise<void> {
    await this.valkey.set(logoutKey(adminId), String(Math.floor(Date.now() / 1000)));
  }

  // `<=`: iat has 1s resolution, and the admin-panel refreshes right before retrying logout.
  async isRefreshTokenRevoked(adminId: string, issuedAt: number): Promise<boolean> {
    const cutoff = await this.valkey.get(logoutKey(adminId));
    return cutoff !== null && issuedAt <= Number(cutoff);
  }

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
    // Login lowercases the email, so store it the same way.
    const email = dto.email.trim().toLowerCase();
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const admin = await this.authRepository.create({
      name: dto.name,
      email,
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
