import { Injectable, NotFoundException } from '@nestjs/common';
import { AppPrismaService } from '../../../prisma/app-prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: AppPrismaService) {}

  findByEmail(email: string) {
    return this.db.admin.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.db.admin.findUnique({ where: { id } });
  }

  async findByIdOrFail(id: string) {
    const admin = await this.findById(id);
    if (!admin) throw new NotFoundException(`Admin #${id} not found`);
    return admin;
  }

  findAll() {
    return this.db.admin.findMany({ orderBy: { createdAt: 'desc' } });
  }

  create(data: { name: string; email: string; passwordHash: string }) {
    return this.db.admin.create({ data });
  }

  remove(id: string) {
    return this.db.admin.delete({ where: { id } });
  }
}
