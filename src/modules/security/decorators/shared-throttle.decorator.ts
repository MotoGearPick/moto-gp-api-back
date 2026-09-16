import { SetMetadata } from '@nestjs/common';

export const SHARED_THROTTLE_KEY = 'shared-throttle';

/**
 * Colapsa el rate limit de la ruta en un único bucket compartido por todos los
 * clientes, en lugar de uno por IP.
 *
 * Necesario cuando el tráfico real llega por un proxy: Caddy descarta el
 * `x-forwarded-for` entrante y lo reescribe con la IP del peer, así que todas
 * las peticiones que pasan por el front de Vercel llegan con la misma IP. Un
 * límite "por IP" ahí es en realidad un límite global disfrazado — este
 * decorador lo hace explícito.
 */
export const SharedThrottle = () => SetMetadata(SHARED_THROTTLE_KEY, true);
