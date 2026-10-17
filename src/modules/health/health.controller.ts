import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import Valkey from 'iovalkey';
import { PrismaService } from '../../prisma/prisma.service';
import { VALKEY_CLIENT } from '../valkey/valkey.constants';

interface CheckResult {
  status: 'ok' | 'error';
  error?: string;
}

@SkipThrottle()
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly db: PrismaService,
    @Inject(VALKEY_CLIENT) private readonly valkey: Valkey,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Liveness + dependency readiness probe' })
  async check(@Res({ passthrough: true }) res: Response) {
    const [db, cache] = await Promise.all([
      this.probe(() => this.db.$queryRaw`SELECT 1`),
      this.probe(() => this.valkey.ping()),
    ]);

    const status = [db, cache].every((c) => c.status === 'ok') ? 'ok' : 'degraded';
    // Probes and uptime monitors read the status code, not the body.
    if (status === 'degraded') res.status(HttpStatus.SERVICE_UNAVAILABLE);

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: { db, cache },
    };
  }

  private async probe(fn: () => Promise<unknown>): Promise<CheckResult> {
    try {
      await fn();
      return { status: 'ok' };
    } catch (err) {
      return { status: 'error', error: err instanceof Error ? err.message : String(err) };
    }
  }
}
