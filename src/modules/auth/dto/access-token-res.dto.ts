import { AdminRole } from '@prisma/app-client';
import { JwtPayload } from '../../../common/types';

export class AccessTokenRes {
  id: string;
  role: AdminRole;

  constructor(payload: JwtPayload) {
    this.id = payload.id;
    this.role = payload.role;
  }
}
