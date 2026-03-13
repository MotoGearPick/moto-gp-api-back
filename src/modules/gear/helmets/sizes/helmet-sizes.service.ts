import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsPrismaService } from '../../../../prisma/products-prisma.service';
import { CreateHelmetSizeDto } from './dto/create-helmet-size.dto';
import { UpdateHelmetSizeDto } from './dto/update-helmet-size.dto';

@Injectable()
export class HelmetSizesService {
  constructor(private readonly db: ProductsPrismaService) {}

  async findAll(modelId: string) {
    await this.assertModelExists(modelId);

    return this.db.helmet_model_size.findMany({
      where: { model_id: modelId },
      include: {
        helmet_inventory: {
          include: { affiliate_store: { select: { name: true, domain: true } } },
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { size_label: 'asc' },
    });
  }

  async create(modelId: string, dto: CreateHelmetSizeDto) {
    await this.assertModelExists(modelId);

    return this.db.helmet_model_size.create({
      data: {
        model_id: modelId,
        size_label: dto.sizeLabel,
      },
    });
  }

  async update(modelId: string, sizeId: string, dto: UpdateHelmetSizeDto) {
    await this.assertModelExists(modelId);

    const size = await this.db.helmet_model_size.findFirst({
      where: { id: sizeId, model_id: modelId },
    });

    if (!size)
      throw new NotFoundException(`Size #${sizeId} not found for model #${modelId}`);

    return this.db.helmet_model_size.update({
      where: { id: sizeId },
      data: { size_label: dto.sizeLabel },
    });
  }

  async remove(modelId: string, sizeId: string) {
    await this.assertModelExists(modelId);

    const size = await this.db.helmet_model_size.findFirst({
      where: { id: sizeId, model_id: modelId },
    });

    if (!size)
      throw new NotFoundException(`Size #${sizeId} not found for model #${modelId}`);

    await this.db.helmet_model_size.delete({ where: { id: sizeId } });
  }

  private async assertModelExists(modelId: string) {
    const model = await this.db.helmet_model.findUnique({
      where: { id: modelId },
    });
    if (!model)
      throw new NotFoundException(`Helmet model #${modelId} not found`);
  }
}
