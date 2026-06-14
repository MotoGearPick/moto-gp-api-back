import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/products-client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Enforces role restrictions declared with @Roles().
 * Must run AFTER AdminAccessTokenGuard (it needs req.user).
 *
 * Rules:
 * - `superadmin` always passes (no need to list it in @Roles()).
 * - No @Roles() on the route: any authenticated admin passes.
 * - With @Roles(...): passes if the role is in the list.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AdminRole[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const role: AdminRole | undefined = user?.role;

    if (role === AdminRole.superadmin || (role && required.includes(role))) {
      return true;
    }

    throw new ForbiddenException('Insufficient role for this resource');
  }
}
