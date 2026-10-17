import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StoresRepository } from './stores.repository';
import { S3Service } from '../s3/s3.service';
import { HelmetCacheService } from '../valkey/helmet-cache.service';
import { SearchSyncService } from '../search/search-sync.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { resolveLogoUrl } from './stores.utils';

@Injectable()
export class StoresAdminService {
  constructor(
    private readonly repo: StoresRepository,
    private readonly s3: S3Service,
    private readonly helmetCache: HelmetCacheService,
    private readonly searchSync: SearchSyncService,
  ) {}

  async findAll() {
    const stores = await this.repo.findAllAdmin();
    return stores.map((s) => this.mapStore(s));
  }

  async findOne(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException(`Tienda #${id} no encontrada`);
    return this.mapStore(store);
  }

  async create(dto: CreateStoreDto, logoFile?: Express.Multer.File) {
    const existing = await this.repo.findByDomain(dto.domain);
    if (existing) throw new ConflictException(`Ya existe una tienda con el dominio "${dto.domain}"`);

    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = await this.s3.upload(logoFile, 'stores/logos');
    }

    const store = await this.repo.create({
      name: dto.name,
      domain: dto.domain,
      logo_url: logoUrl,
      affiliate_program: dto.affiliateProgram,
      commission_pct: dto.commissionPct,
    });

    return this.mapStore(store);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.softDelete(id);
    // The store's prices are baked into every cached helmet and search doc it sells.
    await this.helmetCache.reload();
    await this.searchSync.upsertStore(id);
  }

  async restore(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException(`Tienda #${id} no encontrada`);
    const restored = await this.repo.restore(id);
    await this.helmetCache.reload();
    await this.searchSync.upsertStore(id);
    return this.mapStore(restored);
  }

  private mapStore(raw: any) {
    return {
      id: raw.id,
      name: raw.name,
      domain: raw.domain,
      logoUrl: resolveLogoUrl(raw.logo_url),
      affiliateProgram: raw.affiliate_program,
      commissionPct: raw.commission_pct !== null ? Number(raw.commission_pct) : null,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      deletedAt: raw.deleted_at,
    };
  }
}