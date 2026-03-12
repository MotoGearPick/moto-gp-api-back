import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@motogear.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'supersecret123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}
