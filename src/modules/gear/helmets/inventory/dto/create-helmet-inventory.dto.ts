import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateHelmetInventoryDto {
  @IsString()
  sizeId: string;

  @IsString()
  storeId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @IsBoolean()
  inStock: boolean;

  @IsUrl()
  affiliateUrl: string;
}
