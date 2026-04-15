import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Aaron', description: 'Nombre del remitente' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'aaronq@motogearpick.com', description: 'Correo del remitente' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Tengo una pregunta...', description: 'Mensaje' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

