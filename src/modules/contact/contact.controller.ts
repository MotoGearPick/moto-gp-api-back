import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email enviado satisfactoriamente' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error al enviar el email' })
  async sendContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.sendContactEmail(createContactDto);
  }
}

