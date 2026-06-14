import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BrandCacheService } from '../../valkey/brand-cache.service';
import { SearchSyncService } from '../../search/search-sync.service';
import { GearType } from '../common/enums/gear-type.enum';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    private readonly db: PrismaService,
    private readonly brandCache: BrandCacheService,
    private readonly searchSync: SearchSyncService,
  ) {}

  async create(dto: CreateBrandDto) {
    const existing = await this.db.brand.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug }],
      },
    });

    if (existing) {
      const field = existing.name === dto.name ? 'name' : 'slug';
      throw new ConflictException(`Ya existe una marca con ese ${field}`);
    }

    const result = await this.db.brand.create({
      data: { name: dto.name, slug: dto.slug },
      select: { id: true, name: true, slug: true, created_at: true },
    });

    await this.brandCache.reload();
    await this.searchSync.upsertBrand(result.id);
    return result;
  }

  findAll(category?: GearType) {
    return this.brandCache.getBrands(category);
  }
}
