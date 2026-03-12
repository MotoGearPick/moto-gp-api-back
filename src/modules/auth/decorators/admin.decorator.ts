import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

import { ADMIN_NOT_EXIST } from '../../../common/constants';
import { UserId } from '../../../common/decorators';
import { Admin as AdminEntity } from '../entities';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable()
export class GetAdminPipe implements PipeTransform {
  constructor(private readonly authRepository: AuthRepository) {}

  async transform(adminId: string): Promise<AdminEntity> {
    const admin = await this.authRepository.findById(adminId);

    if (!admin) {
      throw new NotFoundException(ADMIN_NOT_EXIST);
    }

    return admin;
  }
}

export const Admin = () => UserId(undefined, GetAdminPipe);
