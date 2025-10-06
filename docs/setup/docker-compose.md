---
title: "Docker Compose Overview"
---
# 🐳 Docker Compose Overview

| Service | Description      |
| ------- | ---------------- |
| db      | PostgreSQL 16    |
| vector  | Qdrant vector DB |
| files   | MinIO            |
| queue   | Redis 7          |
| api     | Node + tRPC      |
| worker  | BullMQ jobs      |
| web     | Next.js          |
| proxy   | Caddy            |

Volumes: db_data, qdrant_data, minio_data
Ports: web:3000, api:4000, qdrant:6333, minio:9000, proxy:8443

Example:

```bash
cd infra/compose
docker-compose up -d
```
