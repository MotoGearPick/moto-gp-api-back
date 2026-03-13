import { IsString, Matches } from 'class-validator';

export class UpdateHelmetSizeDto {
  @IsString()
  @Matches(/^(XXS|XS|S|M|L|XL|XXL|XXXL|[0-9]{2,3})$/, {
    message: 'sizeLabel must be a valid size (e.g. XS, S, M, L, XL, 57, 58)',
  })
  sizeLabel: string;
}
