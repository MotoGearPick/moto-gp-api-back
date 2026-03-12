import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
  datasource: {
    url: process.env.APP_DATABASE_URL,
  },
});
