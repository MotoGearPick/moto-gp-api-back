import { Global, Module } from '@nestjs/common';
import { ProductsPrismaService } from './products-prisma.service';
import { AppPrismaService } from './app-prisma.service';

@Global()
@Module({
  providers: [ProductsPrismaService, AppPrismaService],
  exports: [ProductsPrismaService, AppPrismaService],
})
export class PrismaModule {}
