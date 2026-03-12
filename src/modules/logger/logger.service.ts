import { Injectable, Logger as NestLogger, LoggerService } from '@nestjs/common';

@Injectable()
export class Logger implements LoggerService {
  private readonly logger = new NestLogger();

  log(message: string, params?: object) {
    this.logger.log(params ? `${message} ${JSON.stringify(params)}` : message);
  }

  error(message: string, exception?: object) {
    this.logger.error(exception ? `${message} ${JSON.stringify(exception)}` : message);
  }

  warn(message: string, data?: object) {
    this.logger.warn(data ? `${message} ${JSON.stringify(data)}` : message);
  }
}
