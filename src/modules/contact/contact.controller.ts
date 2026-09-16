import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SharedThrottle } from '../security/decorators/shared-throttle.decorator';
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
  // Envía un email vía Resend. Bucket único para todo el sitio: tras el proxy de
  // Vercel todas las peticiones llegan con la misma IP, así que un límite por IP
  // sería global de todas formas. @SharedThrottle lo hace explícito.
  @SharedThrottle()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email enviado satisfactoriamente' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Datos inválidos' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Error al enviar el email' })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Demasiados mensajes enviados' })
  async sendContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.sendContactEmail(createContactDto);
  }
}

