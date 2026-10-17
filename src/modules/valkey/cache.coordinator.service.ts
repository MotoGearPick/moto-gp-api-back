import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BrandCacheService } from './brand-cache.service';
import { HelmetCacheService } from './helmet-cache.service';

@Injectable()
export class CacheCoordinatorService implements OnModuleInit {
  private readonly logger = new Logger(CacheCoordinatorService.name);

  constructor(
    private readonly helmetCache: HelmetCacheService,
    private readonly brandCache: BrandCacheService,
  ) {}

  async onModuleInit() {
    await this.reloadAll();
  }

  // Admin writes refresh Valkey immediately; this catches changes made outside the API (e.g. direct DB edits).
  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledReload() {
    this.logger.log('Scheduled cache reload started');
    await this.reloadAll();
  }

  async reloadAll(): Promise<void> {
    try {
      await Promise.all([this.helmetCache.reload(), this.brandCache.reload()]);
      this.logger.log('Cache reload complete');
    } catch (err) {
      this.logger.error('Cache reload failed', err);
    }
  }
}
