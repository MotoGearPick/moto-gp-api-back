import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/app-client';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../config';

@Injectable()
export class AppPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
      super({ adapter: new PrismaPg({ connectionString: config().APP_DATABASE_URL }) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
