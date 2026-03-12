import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

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
    const user = await this.authRepository.findByEmail(email.toLowerCase());

    if (!user) {
      this.logger.warn(UnauthorizedException.name, { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);

    if (!match) {
      this.logger.warn(UnauthorizedException.name, { email, id: user.id });
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
