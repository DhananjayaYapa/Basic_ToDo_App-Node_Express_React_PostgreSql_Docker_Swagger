FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY prisma ./prisma

RUN npm ci

COPY src ./src
COPY scripts ./scripts
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN npm run prisma:generate \
    && npm run build \
    && mkdir -p dist/generated \
    && cp -R src/generated/prisma dist/generated/prisma \
    && chmod +x ./docker-entrypoint.sh

EXPOSE 5000

CMD ["./docker-entrypoint.sh"]