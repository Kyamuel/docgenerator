# MathMentor AI

AI-powered math tutoring platform with age-aware accounts, parental oversight, and a freemium subscription model.

## Architecture
- Web: Next.js + Tailwind CSS (Vercel deploy)
- API: NestJS (Express) + PostgreSQL (Prisma) + Redis (Render/Heroku deploy)
- Math: FastAPI Python microservice for LaTeX rendering and AI calls
- Auth: Auth0 (parent/child linking handled in API)
- Payments: Stripe + M-Pesa (currency auto-detection, yearly discounts)

## Monorepo
- `apps/web`: Next.js frontend
- `apps/api`: NestJS backend
- `apps/math`: FastAPI microservice
- `packages/db`: Prisma schema and client
- `infra`: Docker Compose for local dev (Postgres + Redis + services)

## Getting started (local)
1. Prereqs: Node 18+, pnpm, Python 3.10+, Docker
2. Configure `.env` from `.env.example`
3. Install deps: `pnpm install`
4. Prisma: `pnpm --filter @mathmentor/db prisma generate && pnpm --filter @mathmentor/db prisma migrate deploy`
5. Start dev: `docker compose -f infra/docker-compose.yml up -d db cache` then `pnpm dev`

## Deploy
- Frontend: Vercel
- API + Math: Render/Heroku or any container platform

See per-app `README.md` for more details.