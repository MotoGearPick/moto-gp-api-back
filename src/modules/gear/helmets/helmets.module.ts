import { Module } from '@nestjs/common';
import { HelmetModelsService } from './models/helmet-models.service';
import { HelmetModelsController } from './models/helmet-models.controller';
import { HelmetModelsAdminController } from './models/helmet-models.admin.controller';
import { HelmetVariantsController } from './variants/helmet-variants.controller';
import { HelmetVariantsService } from './variants/helmet-variants.service';
import { HelmetVariantsAdminController } from './variants/helmet-variants.admin.controller';
import { HelmetSizesService } from './sizes/helmet-sizes.service';
import { HelmetSizesAdminController } from './sizes/helmet-sizes.admin.controller';
import { HelmetInventoryService } from './inventory/helmet-inventory.service';
import { HelmetInventoryAdminController } from './inventory/helmet-inventory.admin.controller';

@Module({
  controllers: [
    HelmetVariantsController,      // Debe ir antes que HelmetModelsController para que
    HelmetModelsController,        // /gear/helmets/variants no sea capturado por /:id
    HelmetVariantsAdminController,   // Debe ir antes que HelmetModelsAdminController para que
    HelmetModelsAdminController,     // /admin/gear/helmets/variants no sea capturado por /:id
    HelmetSizesAdminController,
    HelmetInventoryAdminController,
  ],
  providers: [
    HelmetModelsService,
    HelmetVariantsService,
    HelmetSizesService,
    HelmetInventoryService,
  ],
})
export class HelmetsModule {}
