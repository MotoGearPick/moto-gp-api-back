import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { AdminAccessTokenGuard } from '../auth/guards';
import { BackupService } from './backup.service';

@SkipThrottle()
@UseGuards(AdminAccessTokenGuard)
@ApiBearerAuth()
@ApiTags('Admin — Backup')
@Controller('admin/backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('products')
  @ApiOperation({
    summary: '[Admin] Descargar respaldo de la base de datos de productos',
    description: 'Exporta todas las tablas de la base de datos de productos como un archivo JSON descargable.',
  })
  @ApiResponse({ status: 200, description: 'Archivo JSON de respaldo' })
  async downloadProductsBackup(@Res() res: Response) {
    const backup = await this.backupService.exportProductsDatabase();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products-backup-${timestamp}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(JSON.stringify(backup, null, 2));
  }
}
