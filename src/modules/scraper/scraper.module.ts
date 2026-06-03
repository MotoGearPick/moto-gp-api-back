import { Module } from '@nestjs/common';
import { ScraperReviewsController } from './scraper-reviews.controller';
import { ScraperReviewsService } from './scraper-reviews.service';
import { VariantReviewController } from './variant-review.controller';
import { VariantReviewService } from './variant-review.service';
import { AuthModule } from '../auth/auth.module';
import { CdnModule } from '../cdn/cdn.module';

@Module({
  imports: [AuthModule, CdnModule],
  controllers: [ScraperReviewsController, VariantReviewController],
  providers: [ScraperReviewsService, VariantReviewService],
})
export class ScraperModule {}
