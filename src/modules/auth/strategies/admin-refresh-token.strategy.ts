import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../common/types';
import { config } from '../../../config';
import { Logger } from '../../logger';

@Injectable()
export class AdminRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-refresh',
) {
  constructor(private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: config().JWT_ADMIN_REFRESH_SECRET,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const token = req.get('Authorization');
    if (!token) {
      this.logger.warn(UnauthorizedException.name, {
        id: payload?.id,
        error: new UnauthorizedException(),
      });
      throw new UnauthorizedException();
    }

    const refreshToken = token.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
