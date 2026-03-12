import { JwtPayload } from '../../../common/types';

export class AccessTokenRes {
  id: string;

  constructor(payload: JwtPayload) {
    this.id = payload.id;
  }
}
