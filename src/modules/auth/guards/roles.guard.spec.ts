import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '@prisma/app-client';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const makeContext = (role?: AdminRole): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ user: role ? { role } : {} }) }),
      getHandler: () => undefined,
      getClass: () => undefined,
    }) as unknown as ExecutionContext;

  const makeGuard = (required?: AdminRole[]) => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(required),
    } as unknown as Reflector;
    return new RolesGuard(reflector);
  };

  it('allows any authenticated admin when no roles are required', () => {
    const guard = makeGuard(undefined);
    expect(guard.canActivate(makeContext(AdminRole.variant_reviewer))).toBe(true);
  });

  it('allows superadmin even when not listed in @Roles', () => {
    const guard = makeGuard([AdminRole.variant_reviewer]);
    expect(guard.canActivate(makeContext(AdminRole.superadmin))).toBe(true);
  });

  it('allows a role that is in the required list', () => {
    const guard = makeGuard([AdminRole.variant_reviewer]);
    expect(guard.canActivate(makeContext(AdminRole.variant_reviewer))).toBe(true);
  });

  it('rejects a role that is not in the required list', () => {
    const guard = makeGuard([AdminRole.superadmin]);
    expect(() => guard.canActivate(makeContext(AdminRole.variant_reviewer))).toThrow(
      ForbiddenException,
    );
  });

  it('rejects when no role is present and a role is required', () => {
    const guard = makeGuard([AdminRole.variant_reviewer]);
    expect(() => guard.canActivate(makeContext(undefined))).toThrow(ForbiddenException);
  });
});
