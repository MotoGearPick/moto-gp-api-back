import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateHelmetInventoryDto {
  @IsUUID()
  variantId: string;

  @IsUUID()
  sizeId: string;

  @IsUUID()
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
