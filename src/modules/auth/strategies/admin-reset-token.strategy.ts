import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../common/types';
import { config } from '../../../config';
import { Logger } from '../../logger';

@Injectable()
export class AdminResetTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-reset',
) {
  constructor(private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().JWT_ADMIN_RESET_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    return payload;
  }
}
