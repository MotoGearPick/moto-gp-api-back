import { Request } from 'express';

export type JwtPayload = {
  id: string;
};

export type ResetJwtPayload = {
  id: string;
};

export interface InnerRequest<Payload = JwtPayload> extends Request {
  user: Payload;
}

export type Constructor<I> = new (...args: any[]) => I;
