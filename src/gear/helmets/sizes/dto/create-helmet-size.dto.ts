import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateHelmetSizeDto {
  @ApiProperty({
    example: 'M',
    description: 'Talla del casco. Puede ser XS/S/M/L/XL/XXL/XXXL o numérico (ej: 57, 58)',
    pattern: '^(XXS|XS|S|M|L|XL|XXL|XXXL|[0-9]{2,3})$',
  })
  @IsString()
  @Matches(/^(XXS|XS|S|M|L|XL|XXL|XXXL|[0-9]{2,3})$/, {
    message: 'sizeLabel must be a valid size (e.g. XS, S, M, L, XL, 57, 58)',
  })
  sizeLabel: string;
}
