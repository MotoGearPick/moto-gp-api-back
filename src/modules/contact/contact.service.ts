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
      const data = await this.resend.emails.send({
        // Resend requires a verified domain or 'onboarding@resend.dev' for free testing.
        // Assuming user has a verified domain for an email on motogearpick.com
        from: `Contact Form <onboarding@resend.dev>`,
        to: 'contact@motogearpick.com',
        subject: `New contact message from ${name}`,
        text: `From: ${name} (${email})\n\nMessage:\n${message}`,
        replyTo: email,
      });

      this.logger.log(`Email sent successfully: ${data.data?.id}`);
      return { success: true, message: 'Email received' };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
