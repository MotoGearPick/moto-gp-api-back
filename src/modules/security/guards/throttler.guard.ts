import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SHARED_THROTTLE_KEY } from '../decorators/shared-throttle.decorator';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Reads the real client IP from x-forwarded-for (set by the SSR server).
   * This ensures each end-user gets their own rate-limit bucket instead of
   * all SSR requests sharing the same server IP.
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const forwarded = req.headers['x-forwarded-for'] as string | string[] | undefined;
    if (forwarded) {
      const first = Array.isArray(forwarded) ? forwarded[0] : forwarded;
      return first.split(',')[0].trim();
    }
    return req.ip ?? 'unknown';
  }

  /**
   * La clave ya incluye clase y handler, así que el bucket es por ruta. Cuando
   * la ruta lleva @SharedThrottle() sustituimos el sufijo (la IP) por una
   * constante, de forma que todos los clientes comparten un único contador.
   */
  protected generateKey(context: ExecutionContext, suffix: string, name: string): string {
    const shared = this.reflector.getAllAndOverride<boolean>(SHARED_THROTTLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    return super.generateKey(context, shared ? 'shared' : suffix, name);
  }
}
