import { AdminRole } from '@prisma/products-client';
import { JwtPayload } from '../../../common/types';

export class AccessTokenRes {
  id: string;
  role: AdminRole;

  constructor(payload: JwtPayload) {
    this.id = payload.id;
    this.role = payload.role;
  }
}
