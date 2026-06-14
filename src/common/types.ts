import { Request } from 'express';
import { AdminRole } from '@prisma/products-client';

export type JwtPayload = {
  id: string;
  role: AdminRole;
};

export type ResetJwtPayload = {
  id: string;
};

export interface InnerRequest<Payload = JwtPayload> extends Request {
  user: Payload;
}

export type Constructor<I> = new (...args: any[]) => I;
