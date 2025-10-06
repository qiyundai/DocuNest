---
adr_id: "0001"
title: "Core Architecture Decision"
date: "2025-10-06"
status: "accepted"
---
# ADR 0001 — Core Architecture Choice

## Context

DocuNest requires a scalable, open-source framework for manual ingestion, structured storage, and contextual AI.

## Decision

Adopt a **TypeScript monorepo** with:

* Next.js (web) + React Native (mobile)
* Node + tRPC backend
* PostgreSQL + pgvector
* Redis + BullMQ
* MinIO / S3
* Docker Compose (optional Kubernetes)
* AI providers via plugins (OpenAI/Ollama)

## Consequences

✅ Unified types and runtime
✅ Easy self-hosting via Compose
✅ Scalable for Kubernetes
🧩 Extensible via plugins
