import { AdminRole } from '@prisma/products-client';

export type JwtPayload = {
  id: string;
  role: AdminRole;
};
