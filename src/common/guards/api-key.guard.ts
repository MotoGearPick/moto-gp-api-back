import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-api-key'];
    const expected = process.env.PUBLIC_API_KEY;

    if (!expected) throw new Error('PUBLIC_API_KEY is not configured');
    if (provided !== expected) throw new UnauthorizedException('Invalid API key');

    return true;
  }
}