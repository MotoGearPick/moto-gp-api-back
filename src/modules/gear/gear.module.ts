import { Module } from '@nestjs/common';
import { BrandsModule } from './brands/brands.module';
import { HelmetsModule } from './helmets/helmets.module';

@Module({
  imports: [
    BrandsModule,
    HelmetsModule,
    // GlovesModule,   (pendiente)
    // JacketsModule,  (pendiente)
    // BootsModule,    (pendiente)
    // PantsModule,    (pendiente)
  ],
})
export class GearModule {}
