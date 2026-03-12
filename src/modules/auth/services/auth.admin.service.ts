import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/app-client';
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

  async generateTokens(admin: { id: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(admin.id),
      this.getRefreshToken(admin.id),
    ]);

    return { accessToken, refreshToken };
  }

  private getAccessToken(id: string): Promise<string> {
    return this.jwtService.signAsync(
        {
            id,
        },
        {
            secret: config().JWT_ADMIN_ACCESS_SECRET,
           /* expiresIn: expiresIn ?? config().JWT_ADMIN_ACCESS_EXPIRES,*/
        },
    );
  }

  private getRefreshToken(id: string): Promise<string> {
    return this.jwtService.signAsync(
      { id },
        {
            secret: config().JWT_ADMIN_REFRESH_SECRET,
            /* expiresIn: expiresIn ?? config().JWT_ADMIN_ACCESS_EXPIRES,*/
        },
    );
  }

  async register(dto: RegisterAdminDto) {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const admin = await this.authRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
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
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
