import { config } from './index';

export const VALKEY_URL = () => config().REDIS_URL;
