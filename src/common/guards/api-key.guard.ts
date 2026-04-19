import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { timingSafeEqual } from 'crypto';
import { optionalEnv } from '../../config/util';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const providedHeader = request.headers['x-api-key'];
    const provided = Array.isArray(providedHeader) ? providedHeader[0] : providedHeader;
    const expected = optionalEnv('PUBLIC_API_KEY', '');

    if (!expected) throw new InternalServerErrorException('PUBLIC_API_KEY is not configured');
    if (typeof provided !== 'string') throw new UnauthorizedException('Invalid API key');

    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);
    if (
      providedBuf.length !== expectedBuf.length ||
      !timingSafeEqual(providedBuf, expectedBuf)
    ) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}