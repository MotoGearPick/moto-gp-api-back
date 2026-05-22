import { Global, Logger, Module } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { config } from '../../config';
import { DocumentMapper } from './document.mapper';
import { MeiliService, MEILI_CLIENT } from './meili.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchSyncService } from './search-sync.service';

const meiliLogger = new Logger('MeiliClient');

@Global()
@Module({
  providers: [
    {
      provide: MEILI_CLIENT,
      useFactory: () => {
        const cfg = config();
        const client = new MeiliSearch({ host: cfg.MEILI_HOST, apiKey: cfg.MEILI_API_KEY });
        meiliLogger.log(`Connected to ${cfg.MEILI_HOST}`);
        return client;
      },
    },
    MeiliService,
    DocumentMapper,
    SearchService,
    SearchSyncService,
  ],
  controllers: [SearchController],
  exports: [SearchSyncService, SearchService],
})
export class SearchModule {}
