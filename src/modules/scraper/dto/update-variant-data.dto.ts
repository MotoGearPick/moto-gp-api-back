import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ScrapedVariantDataDto } from './scraped-variant-data.dto';

/**
 * Variant-only edit payload. Unlike UpdateReviewDto it cannot touch model data,
 * so it is safe to expose to `variant_reviewer` admins.
 */
export class UpdateVariantDataDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ScrapedVariantDataDto)
  editedVariantData?: ScrapedVariantDataDto | null;
}
