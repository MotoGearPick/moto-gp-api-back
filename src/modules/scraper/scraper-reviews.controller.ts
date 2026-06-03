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
import { AdminRole } from '@prisma/app-client';
import { AdminAccessTokenGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserId } from '../../common/decorators';
import { ScraperReviewsService } from './scraper-reviews.service';
import { VariantReviewService } from './variant-review.service';
import { FilterReviewsDto } from './dto';
import { UpdateReviewDto } from './dto';
import { UpdateVariantDataDto } from './dto';
import { EditGroupModelDto } from './dto';
import { BatchApproveDto, BatchRejectDto } from './dto';

/**
 * Class-level guards authenticate every route, but authorization is per-method:
 * reading the list/detail and editing/marking variants is open to any admin
 * (so `variant_reviewer` can work), while model edits, approvals and batch
 * actions are restricted to `superadmin` via @Roles on each handler.
 */
@SkipThrottle()
@UseGuards(AdminAccessTokenGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('Scraper Reviews')
@Controller('scraper/reviews')
export class ScraperReviewsController {
  constructor(
    private readonly service: ScraperReviewsService,
    private readonly variantReview: VariantReviewService,
  ) {}

  @Get('grouped')
  @ApiOperation({ summary: 'Get reviews grouped by model slug' })
  findGrouped(@Query() filters: FilterReviewsDto) {
    return this.service.findGrouped(filters);
  }

  @Post('group/:modelSlug/model/mark-reviewed')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Mark the shared model data of a group as reviewed' })
  @ApiParam({ name: 'modelSlug', description: 'Model slug' })
  markGroupModelReviewed(
    @Param('modelSlug') modelSlug: string,
    @UserId() adminId: string,
  ) {
    return this.service.markGroupModelReviewed(modelSlug, adminId);
  }

  @Post('group/:modelSlug/model/unmark-reviewed')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Revert the shared model data of a group to pending review' })
  @ApiParam({ name: 'modelSlug', description: 'Model slug' })
  unmarkGroupModelReviewed(@Param('modelSlug') modelSlug: string) {
    return this.service.unmarkGroupModelReviewed(modelSlug);
  }

  @Patch('group/:modelSlug/model')
  @Roles(AdminRole.superadmin)
  @ApiOperation({
    summary: 'Edit model data for all reviews in a model group',
  })
  @ApiParam({ name: 'modelSlug', description: 'Model slug (e.g. "pista-gp-rr")' })
  editGroupModel(
    @Param('modelSlug') modelSlug: string,
    @Body() dto: EditGroupModelDto,
  ) {
    return this.service.editGroupModel(modelSlug, dto.editedModelData);
  }

  @Post('group/:modelSlug/approve')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Batch approve reviews in a model group' })
  @ApiParam({ name: 'modelSlug', description: 'Model slug' })
  batchApprove(
    @Param('modelSlug') modelSlug: string,
    @Body() dto: BatchApproveDto,
  ) {
    return this.service.batchApprove(modelSlug, dto);
  }

  @Post('group/:modelSlug/reject')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Batch reject reviews in a model group' })
  @ApiParam({ name: 'modelSlug', description: 'Model slug' })
  batchReject(
    @Param('modelSlug') modelSlug: string,
    @Body() dto: BatchRejectDto,
  ) {
    return this.service.batchReject(modelSlug, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single review by ID' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/variant')
  @ApiOperation({
    summary: 'Edit only the variant data of a single review (variant reviewers)',
  })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  updateVariantData(
    @Param('id') id: string,
    @Body() dto: UpdateVariantDataDto,
  ) {
    return this.service.update(id, { editedVariantData: dto.editedVariantData });
  }

  @Patch(':id')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Edit a single review (model and/or variant data)' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/approve')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Approve a single review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  approveSingle(@Param('id') id: string) {
    return this.service.approveSingle(id);
  }

  @Post(':id/reject')
  @Roles(AdminRole.superadmin)
  @ApiOperation({ summary: 'Reject a single review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  rejectSingle(@Param('id') id: string) {
    return this.service.rejectSingle(id);
  }

  @Post(':id/variant/mark-reviewed')
  @ApiOperation({ summary: 'Mark a single variant as reviewed' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  markVariantReviewed(@Param('id') id: string, @UserId() adminId: string) {
    return this.variantReview.markReviewed(id, adminId);
  }

  @Post(':id/variant/unmark-reviewed')
  @ApiOperation({ summary: 'Revert a single variant to pending review' })
  @ApiParam({ name: 'id', description: 'Review UUID' })
  unmarkVariantReviewed(@Param('id') id: string) {
    return this.variantReview.unmarkReviewed(id);
  }
}
