import { Module } from '@nestjs/common';
import { GearModule } from './modules/gear/gear.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './modules/logger';
import { BackupModule } from './modules/backup/backup.module';

@Module({
  imports: [PrismaModule, LoggerModule, GearModule, AuthModule, BackupModule],
})
export class AppModule {}
