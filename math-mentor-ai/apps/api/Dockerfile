# syntax=docker/dockerfile:1
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

# Copy monorepo files
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm -C apps/api install --frozen-lockfile || pnpm -C apps/api install

WORKDIR /app/apps/api
RUN pnpm build

EXPOSE 4000
CMD ["node", "dist/main.js"]