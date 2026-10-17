# Moto Gear Picker API

REST API for browsing, comparing, and managing motorcycle gear — starting with helmets. Built with NestJS, Prisma, and PostgreSQL.

## Architecture

One PostgreSQL database (`DATABASE_URL`), schema at `prisma/products/schema.prisma`, one Prisma client (`@prisma/products-client`): admins, brands, helmet models, variants, sizes, inventory, scrape reviews.

## Tech Stack

- **Runtime:** Node.js 24
- **Framework:** NestJS 11
- **ORM:** Prisma 7 (with `@prisma/adapter-pg`)
- **Auth:** Passport + JWT (access / refresh tokens)
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger (auto-generated at `/docs`)
- **Package Manager:** pnpm 10
- **Deployment:** Docker on AWS Lightsail (GitHub Actions on push to `master`)

## Modules

| Module | Description |
|---|---|
| `auth` | Admin registration, login, JWT token rotation |
| `gear/brands` | CRUD for motorcycle gear brands |
| `gear/helmets/models` | Helmet models with specs (certifications, shell material, visor, etc.) |
| `gear/helmets/variants` | Color/graphic variants per model |
| `gear/helmets/sizes` | Size availability per model |
| `gear/helmets/inventory` | Store listings, prices, affiliate links |
| `scraper` | Ingestion pipeline — review scraped data before publishing |
| `backup` | Database backup operations |

## Prerequisites

- Node.js 24.x
- pnpm 10.x
- PostgreSQL

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy and configure environment variables
cp .env.example .env
```

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `APP_URL` | Yes | Public URL of the API |
| `JWT_ADMIN_ACCESS_SECRET` | Yes | Secret for admin access tokens |
| `JWT_ADMIN_REFRESH_SECRET` | Yes | Secret for admin refresh tokens |
| `PORT` | No | Server port (default: `3000`) |
| `APP_ENV` | No | Environment name (default: `local`) |
| `CORS_URLS` | No | Allowed CORS origins |
| `JWT_ADMIN_ACCESS_EXPIRES` | No | Access token TTL (default: `15m`) |
| `JWT_ADMIN_REFRESH_EXPIRES` | No | Refresh token TTL (default: `7d`) |

### Database Setup

```bash
# Generate Prisma clients
pnpm prisma:generate

# Push schemas to databases (development)
pnpm prisma:push:app
pnpm prisma:push:products

# Or run migrations (production)
pnpm prisma:migrate:app:prod
pnpm prisma:migrate:products:prod
```

### Run

```bash
# Development (watch mode)
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

The API starts on `http://localhost:3000` with Swagger docs at `http://localhost:3000/docs`.

## Scripts Reference

| Script | Description |
|---|---|
| `pnpm start:dev` | Start in watch mode |
| `pnpm start:debug` | Start in debug + watch mode |
| `pnpm build` | Compile TypeScript |
| `pnpm start:prod` | Run compiled output |
| `pnpm lint` | Lint and auto-fix |
| `pnpm test` | Run tests |
| `pnpm test:cov` | Run tests with coverage |
| `pnpm prisma:generate` | Generate both Prisma clients |
| `pnpm prisma:studio:products` | Open Prisma Studio for products DB |
| `pnpm prisma:studio:app` | Open Prisma Studio for app DB |

## Project Structure

```
src/
├── main.ts                    # Bootstrap, Swagger setup
├── app.module.ts              # Root module
├── common/                    # Shared types, decorators, pagination
├── config/                    # Environment config
├── prisma/                    # Prisma module and services
└── modules/
    ├── auth/                  # Admin auth (JWT, guards, strategies)
    ├── backup/                # Database backups
    ├── gear/
    │   ├── brands/            # Brand CRUD
    │   └── helmets/
    │       ├── models/        # Helmet model CRUD + filtering
    │       ├── variants/      # Color/graphic variants
    │       ├── sizes/         # Size management
    │       ├── inventory/     # Store inventory + affiliate links
    │       └── enums/         # Helmet-specific enums
    ├── logger/                # Custom logger
    └── scraper/               # Scraped data review pipeline
```

## License

Private — all rights reserved.