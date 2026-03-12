import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAccessTokenGuard extends AuthGuard('admin-access') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }
}
