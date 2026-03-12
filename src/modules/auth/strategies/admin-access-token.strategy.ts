import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../common/types';
import { config } from '../../../config';
import { Logger } from '../../logger';
import { AccessTokenRes } from '../dto';

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'admin-access',
) {
  constructor(private readonly logger: Logger) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().JWT_ADMIN_ACCESS_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<AccessTokenRes> {
    return new AccessTokenRes(payload);
  }
}
