import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateHelmetInventoryDto {
  @ApiProperty({ example: 'uuid-del-size', description: 'ID de la talla a la que pertenece este inventario' })
  @IsString()
  sizeId: string;

  @ApiProperty({ example: 'uuid-de-la-tienda', description: 'ID de la tienda afiliada' })
  @IsString()
  storeId: string;

  @ApiProperty({ example: 599.99, minimum: 0, description: 'Precio en la tienda' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD', description: 'Código de moneda ISO 4217' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({ example: true, description: 'Si el producto está en stock en esta tienda' })
  @IsBoolean()
  inStock: boolean;

  @ApiProperty({
    example: 'https://tienda.com/casco?ref=motogear',
    description: 'URL de afiliado a la tienda',
  })
  @IsUrl()
  affiliateUrl: string;
}
