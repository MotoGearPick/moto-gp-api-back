import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CustomThrottlerGuard } from './guards/throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60_000,   // 1 minuto
          // NO es "por usuario": Caddy descarta el x-forwarded-for entrante y lo
          // reescribe con la IP del peer, así que todo lo que llega por el front de
          // Vercel (renderizado en servidor y los proxies /api/*) comparte un único
          // bucket. El número es alto a propósito para que ese bucket compartido no
          // se agote en un pico — el autocompletado del buscador escala con los
          // usuarios y una caché fría tras un deploy dispara fallos simultáneos.
          // Para volver a un límite por usuario real, ver @SharedThrottle.
          limit: 1_200,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class SecurityModule {}
