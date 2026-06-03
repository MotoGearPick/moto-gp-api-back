import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '@prisma/app-client';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles.
 * `superadmin` always has access without needing to be listed.
 *
 * @example
 * \@Roles(AdminRole.variant_reviewer) // superadmin + variant_reviewer
 */
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
