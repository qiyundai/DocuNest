---
title: "Local Development Setup"
---
# 🧰 Local Development Setup

1. Clone the repository
2. Copy `.env.example` → `.env` and fill in keys
3. Run `docker-compose up -d` from `infra/compose`
4. Run `pnpm dev` (web:3000, api:4000)
5. Seed database: `pnpm run db:seed`
6. Open [http://localhost:3000](http://localhost:3000) and test Ask AI.
