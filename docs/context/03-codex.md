---
title: "DocuNest Codex Context"
purpose: "Enable Cursor/Codex to understand project structure and development flow"
---
# 🤖 DocuNest — Codex Context

## Project Goal

Build the **open-core** of DocuNest:

* Manual ingestion → schema → search → RAG API
* Add Service/Recall + Engage skeletons
* Multi-tenant, privacy-first, self-hostable

## Stack Overview

TypeScript (strict), Node 20, PNPM workspaces
Next.js + React Native + tRPC + Prisma + pgvector/Qdrant + Redis + MinIO + Caddy

## Repository Layout

apps/{web,app,api,worker}
packages/{schema,ui,plugins,utils}
infra/{compose,k8s}
docs/{context,adr,setup}

## Environment Variables

Example:

```
DATABASE_URL=postgres://postgres:postgres@db:5432/docunest
VECTOR_BACKEND=pgvector
S3_ENDPOINT=http://files:9000
S3_BUCKET=docunest
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## Week-0 Tasks

1. Scaffold monorepo
2. Implement Schema v0.1
3. Setup Prisma models
4. Ingest CLI prototype
5. Chunk + embed pipeline
6. Expose `search.query` + `ai.ask`
7. Build Next.js viewer
8. Compose up demo stack
