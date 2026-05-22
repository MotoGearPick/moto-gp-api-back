import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Index, MeiliSearch } from 'meilisearch';
import { config } from '../../config';
import { HelmetSearchDoc } from './search.types';

export const MEILI_CLIENT = 'MEILI_CLIENT';

@Injectable()
export class MeiliService implements OnModuleInit {
  private readonly logger = new Logger(MeiliService.name);
  private readonly indexName = config().MEILI_INDEX;

  constructor(@Inject(MEILI_CLIENT) private readonly client: MeiliSearch) {}

  get index(): Index<HelmetSearchDoc> {
    return this.client.index<HelmetSearchDoc>(this.indexName);
  }

  async onModuleInit() {
    try {
      await this.ensureIndex();
      await this.applySettings();
      this.logger.log(`Meili index '${this.indexName}' ready`);
    } catch (err) {
      this.logger.error(`Failed to initialize Meili index '${this.indexName}'`, err);
    }
  }

  private async ensureIndex() {
    const indexes = await this.client.getIndexes({ limit: 1000 });
    const exists = indexes.results.some((i) => i.uid === this.indexName);
    if (!exists) {
      const task = await this.client.createIndex(this.indexName, { primaryKey: 'id' });
      await this.client.waitForTask(task.taskUid);
    }
  }

  private async applySettings() {
    await this.index.updateSettings({
      searchableAttributes: [
        'fullName',
        'brandName',
        'modelName',
        'graphicName',
        'colorName',
        'sku',
      ],
      filterableAttributes: [
        'brandId',
        'brandSlug',
        'modelId',
        'shape',
        'purpose',
        'shellMaterial',
        'certification',
        'colorFamilies',
        'finish',
        'closureType',
      ],
      sortableAttributes: ['priceFrom', 'modelName'],
      displayedAttributes: ['*'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: { oneTypo: 4, twoTypos: 8 },
      },
    });
  }
}
