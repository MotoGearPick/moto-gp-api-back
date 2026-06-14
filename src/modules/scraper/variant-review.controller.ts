import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AdminRole } from '@prisma/products-client';
import { AdminAccessTokenGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserId } from '../../common/decorators';
import { VariantReviewService } from './variant-review.service';
import { FilterVariantReviewsDto, ReviewVariantDto } from './dto';

/**
 * Narrow surface for variant reviewers (color/graphic/finish).
 * Accessible by `variant_reviewer` and, by default, `superadmin`.
 * Does not expose editable model data nor the pipeline approval.
 */
@SkipThrottle()
@UseGuards(AdminAccessTokenGuard, RolesGuard)
@Roles(AdminRole.variant_reviewer)
@ApiBearerAuth()
@ApiTags('Variant Review')
@Controller('scraper/variant-review')
export class VariantReviewController {
  constructor(private readonly service: VariantReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Listar variantes para revisar (color/gráfico/acabado)' })
  findToReview(@Query() filters: FilterVariantReviewsDto) {
    return this.service.findToReview(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variante a revisar por ID de review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Editar datos de variante (nombre, color, familias, acabado, gráfico)' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  editVariant(@Param('id') id: string, @Body() dto: ReviewVariantDto) {
    return this.service.editVariant(id, dto);
  }

  @Post(':id/mark-reviewed')
  @ApiOperation({ summary: 'Marcar la variante como revisada' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  markReviewed(@Param('id') id: string, @UserId() adminId: string) {
    return this.service.markReviewed(id, adminId);
  }

  @Post(':id/unmark-reviewed')
  @ApiOperation({ summary: 'Revertir la variante a pendiente de revisión' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  unmarkReviewed(@Param('id') id: string) {
    return this.service.unmarkReviewed(id);
  }
}
