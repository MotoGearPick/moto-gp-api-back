ARG NODE_VERSION=24.14.0

FROM node:${NODE_VERSION}-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm" \
      PATH="$PNPM_HOME:$PATH" \
      CI=true

RUN corepack enable && corepack prepare pnpm@10.31.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm install --frozen-lockfile

RUN pnpm prisma:generate

COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN pnpm build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
      pnpm prune --prod

  # ─── runtime ──────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-bookworm-slim AS runtime

ENV NODE_ENV=production \
      PORT=3000

WORKDIR /app

RUN groupadd -r app && useradd -r -g app -d /app app

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/prisma ./prisma
COPY --from=builder --chown=app:app /app/package.json ./package.json

USER app

EXPOSE 3000

CMD ["node", "dist/main.js"]