import { ConflictException, Injectable } from '@nestjs/common';
import { ProductsPrismaService } from '../../../prisma/products-prisma.service';
import { GearType } from '../common/enums/gear-type.enum';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly db: ProductsPrismaService) {}

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

    return this.db.brand.create({
      data: { name: dto.name, slug: dto.slug },
      select: { id: true, name: true, slug: true, created_at: true },
    });
  }

  findAll(category?: GearType) {
    return this.db.brand.findMany({
      where: {
        deleted_at: null,
        ...this.buildCategoryFilter(category),
      },
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
  }

  private buildCategoryFilter(category?: GearType) {
    switch (category) {
      case GearType.HELMET:
        return { helmet_model: { some: { deleted_at: null } } };
      // case GearType.GLOVES:
      //   return { glove_model: { some: { deleted_at: null } } };
      // case GearType.JACKET:
      //   return { jacket_model: { some: { deleted_at: null } } };
      // case GearType.BOOTS:
      //   return { boot_model: { some: { deleted_at: null } } };
      // case GearType.PANTS:
      //   return { pants_model: { some: { deleted_at: null } } };
      default:
        return {};
    }
  }
}
