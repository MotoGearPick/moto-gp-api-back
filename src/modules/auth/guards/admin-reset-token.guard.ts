import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminResetTokenGuard extends AuthGuard('admin-reset') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }
}
