import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/products-client';
import {PrismaPg} from "@prisma/adapter-pg";

@Injectable()
export class ProductsPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
      super({ adapter: new PrismaPg({ connectionString: process.env.PRODUCTS_DATABASE_URL! }) });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
