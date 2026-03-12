import { Module } from '@nestjs/common';
import { HelmetsModule } from './helmets/helmets.module';

@Module({
  imports: [
    HelmetsModule,
    // GlovesModule,   (pendiente)
    // JacketsModule,  (pendiente)
    // BootsModule,    (pendiente)
    // PantsModule,    (pendiente)
  ],
})
export class GearModule {}
