import { Injectable, Logger } from '@nestjs/common';
import { ProductsPrismaService } from '../../prisma/products-prisma.service';
import { DocumentMapper } from './document.mapper';
import { MeiliService } from './meili.service';
import { SearchQueryDto } from './dto/search-query.dto';

const REINDEX_BATCH = 500;

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly meili: MeiliService,
    private readonly db: ProductsPrismaService,
    private readonly mapper: DocumentMapper,
  ) {}

  async search(dto: SearchQueryDto) {
    const filters: string[] = [];
    if (dto.brandSlug) filters.push(`brandSlug = "${dto.brandSlug}"`);
    if (dto.shape?.length) filters.push(`shape IN [${dto.shape.map((s) => `"${s}"`).join(',')}]`);
    if (dto.purpose?.length) filters.push(`purpose IN [${dto.purpose.map((p) => `"${p}"`).join(',')}]`);
    if (dto.colorFamily?.length)
      filters.push(`colorFamilies IN [${dto.colorFamily.map((c) => `"${c}"`).join(',')}]`);
    if (dto.finish) filters.push(`finish = "${dto.finish}"`);

    const result = await this.meili.index.search(dto.q ?? '', {
      limit: dto.limit ?? 10,
      offset: dto.offset ?? 0,
      filter: filters.length ? filters : undefined,
      attributesToHighlight: ['modelName', 'brandName', 'graphicName', 'colorName'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    });

    return {
      hits: result.hits,
      totalHits: result.estimatedTotalHits ?? result.hits.length,
      query: result.query,
      processingTimeMs: result.processingTimeMs,
    };
  }

  async reindexAll(): Promise<{ indexed: number }> {
    this.logger.log('Starting full reindex');
    await this.meili.index.deleteAllDocuments();

    let cursor: string | undefined;
    let total = 0;

    for (;;) {
      const batch = await this.db.helmet_model_variant.findMany({
        where: { deleted_at: null, helmet_model: { deleted_at: null } },
        include: {
          helmet_model: { include: { brand: true } },
          helmet_inventory: { select: { price: true, currency: true } },
        },
        take: REINDEX_BATCH,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: { id: 'asc' },
      });

      if (!batch.length) break;

      await this.meili.index.addDocuments(batch.map((v) => this.mapper.toDoc(v)));
      total += batch.length;
      cursor = batch[batch.length - 1].id;

      if (batch.length < REINDEX_BATCH) break;
    }

    this.logger.log(`Reindex complete: ${total} documents`);
    return { indexed: total };
  }
}
