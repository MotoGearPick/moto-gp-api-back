import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ADMIN_REFRESH_COOKIE } from '../cookies';

@Injectable()
export class AdminRefreshTokenGuard extends AuthGuard('admin-refresh') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.cookies?.[ADMIN_REFRESH_COOKIE] ?? req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }
}
