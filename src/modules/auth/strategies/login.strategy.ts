import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { isEmail } from 'class-validator';

import { Logger } from '../../logger';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class LoginStrategy extends PassportStrategy(Strategy, 'login') {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly logger: Logger,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Invalid credentials payload');
    }
    const normalized = email.trim().toLowerCase();
    if (!isEmail(normalized)) {
      throw new BadRequestException('Invalid email format');
    }

    const user = await this.authRepository.findByEmail(normalized);

    if (!user) {
      this.logger.warn(UnauthorizedException.name, { email: normalized });
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      this.logger.warn(UnauthorizedException.name, { email: normalized, id: user.id });
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
