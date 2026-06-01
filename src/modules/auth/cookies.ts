import { CookieOptions } from 'express';
import { config } from '../../config';

/** Nombre de la cookie httpOnly que transporta el refresh token del admin. */
export const ADMIN_REFRESH_COOKIE = 'admin_refresh_token';

/** La cookie solo se envía en las rutas de auth admin, no en toda la API. */
const COOKIE_PATH = '/admin/auth';

/**
 * Convierte una duración estilo JWT (`15m`, `7d`, `1h`, `30s`) a milisegundos
 * para usarla como `maxAge` de la cookie. Si no se reconoce, default 7 días.
 */
function durationToMs(value: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(value.trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];
  const unitMs: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return amount * unitMs[unit];
}

/** Opciones de la cookie del refresh token (set en login/refresh). */
export function refreshCookieOptions(): CookieOptions {
  const env = config();
  const isLocal = env.APP_ENV === 'local';

  return {
    httpOnly: true,
    // En prod la cookie viaja cross-site (front en otro dominio) → secure + SameSite=None.
    secure: !isLocal,
    sameSite: isLocal ? 'lax' : 'none',
    // Vacío → cookie host-only (atada al host de la API). Solo se setea si se define
    // explícitamente un dominio compartido (p.ej. `.midominio.com`).
    domain: env.COOKIE_DOMAIN || undefined,
    path: COOKIE_PATH,
    maxAge: durationToMs(env.JWT_ADMIN_REFRESH_EXPIRES),
  };
}

/** Opciones para limpiar la cookie (logout). Deben coincidir salvo maxAge. */
export function clearRefreshCookieOptions(): CookieOptions {
  const { maxAge, ...rest } = refreshCookieOptions();
  return rest;
}
