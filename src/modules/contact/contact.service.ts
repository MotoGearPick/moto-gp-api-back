import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Resend } from 'resend';
import { config } from '../../config';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly resend: Resend;
  private readonly logger = new Logger(ContactService.name);

  constructor() {
    this.resend = new Resend(config().RESEND_API_KEY);
  }

  async sendContactEmail(contactDto: CreateContactDto) {
    const { name, email, message } = contactDto;

    try {
      const { data, error } = await this.resend.emails.send({
        // Por defecto usa el remitente de pruebas de Resend, que solo entrega al email
        // dueño de la cuenta. Al verificar el dominio en resend.com/domains basta con
        // definir RESEND_FROM y CONTACT_TO en el entorno: aquí no hay que tocar nada.
        from: config().RESEND_FROM,
        to: config().CONTACT_TO,
        subject: `New contact message from ${name}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
        replyTo: email,
      });

      // El SDK de Resend no lanza: devuelve { data, error }. Sin esto, un rechazo
      // (dominio sin verificar, cuota, destinatario inválido) se reportaba como éxito.
      if (error) {
        this.logger.error(`Resend rechazó el email: ${error.name} — ${error.message}`);
        throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
      return { success: true, message: 'Email received' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
