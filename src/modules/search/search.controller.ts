import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards';
import { AdminAccessTokenGuard } from '../auth/guards';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Full-text search across helmet variants' })
  async query(@Query() dto: SearchQueryDto) {
    return this.search.search(dto);
  }

  @Post('reindex')
  @UseGuards(AdminAccessTokenGuard)
  @ApiSecurity('bearer')
  @ApiOperation({ summary: 'Rebuild the full Meili index from the products DB' })
  async reindex() {
    return this.search.reindexAll();
  }
}
