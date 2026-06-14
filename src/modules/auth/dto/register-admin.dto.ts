import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/products-client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

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

  @ApiProperty({
    enum: AdminRole,
    required: false,
    default: AdminRole.superadmin,
    description: 'Rol del admin.',
  })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
