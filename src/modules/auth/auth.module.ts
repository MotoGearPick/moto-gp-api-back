import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthAdminController } from './controllers/auth.admin.controller';
import { AuthAdminService } from './services/auth.admin.service';
import { AuthRepository } from './repositories/auth.repository';
import {
  LoginStrategy,
  AdminAccessTokenStrategy,
  AdminRefreshTokenStrategy,
} from './strategies';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthAdminController],
  providers: [
    AuthAdminService,
    AuthRepository,
    LoginStrategy,
    AdminAccessTokenStrategy,
    AdminRefreshTokenStrategy,
  ],
  exports: [AuthAdminService],
})
export class AuthModule {}
