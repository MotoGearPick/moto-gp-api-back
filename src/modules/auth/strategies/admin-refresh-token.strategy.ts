import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../common/types';
import { config } from '../../../config';
import { Logger } from '../../logger';
import { ADMIN_REFRESH_COOKIE } from '../cookies';

/** Extrae el refresh token de la cookie httpOnly. */
const cookieExtractor = (req: Request): string | null =>
  req?.cookies?.[ADMIN_REFRESH_COOKIE] ?? null;

@Injectable()
export class AdminRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-refresh',
) {
  constructor(private readonly logger: Logger) {
    super({
      // Prioriza la cookie; fallback al header Bearer (Swagger/Postman).
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      passReqToCallback: true,
      secretOrKey: config().JWT_ADMIN_REFRESH_SECRET,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken =
      cookieExtractor(req) ??
      req.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      this.logger.warn(UnauthorizedException.name, {
        id: payload?.id,
        error: new UnauthorizedException(),
      });
      throw new UnauthorizedException();
    }

    return { ...payload, refreshToken };
  }
}
