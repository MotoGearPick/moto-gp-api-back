import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminRefreshTokenGuard extends AuthGuard('admin-refresh') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }
}
