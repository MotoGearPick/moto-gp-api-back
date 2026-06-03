import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/pagination';

export class FilterVariantReviewsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['pending', 'reviewed'])
  variantReviewStatus?: 'pending' | 'reviewed';

  @IsOptional()
  @IsString()
  search?: string;
}
