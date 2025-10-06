---
title: "DocuNest Technical Architecture"
version: "0.1"
last_updated: "2025-10-06"
---
# ⚙️ Technical Architecture (v0.1)

## 1. System Overview
DocuNest is a **multi-tenant platform** that ingests product manuals, converts them into structured JSON, and serves them via web/mobile apps and APIs.  
It features contextual AI, service/recall tracking, and engagement tools.

## 2. Core Services
- web/ – Next.js portal (viewer + admin)
- app/ – React Native client
- api/ – Node + tRPC gateway
- worker/ – BullMQ jobs (ingest, embed, email, recall)
- vector/ – pgvector or Qdrant
- db/ – PostgreSQL (source of truth)
- files/ – MinIO / S3 storage
- proxy/ – Caddy / Traefik
- plugins/ – AI, auth, analytics, and theme adapters

## 3. Data Flow
1. Ingest → Parse → Normalize → Store as *Manual Schema v0.1*  
2. Embed → Chunk + vectorize → store in pgvector/Qdrant  
3. Search / AI → Retrieve + generate contextual response with citations  
4. Service & Recall → Link registered products → notify users  
5. Engage → Publish blog/poll/newsletter → deliver to subscribers  
6. Analytics → Collect anonymized metrics per tenant  

## 4. Core Domain Model
Tenant • User • Product • Manual • ManualSection • EmbeddingChunk • Registration • Recall • Article/Poll • Subscription • Ticket

## 5. Manual Schema v0.1
**Example JSON structure**
```json
{
  "manualId": "uuid",
  "product": { "model": "X100", "sku": "123" },
  "version": "1.0.0",
  "locale": "en-US",
  "sections": [
    {
      "id": "safety",
      "title": "Safety",
      "body": [
        { "type": "paragraph", "text": "Handle with care and keep away from heat sources." }
      ]
    }
  ]
}
```

## 6. API Routers (tRPC)

* auth – authentication and tenant login
* docs – manuals, sections, metadata
* search – hybrid and vector search
* ai – RAG query interface
* service – registration, recall endpoints
* engage – articles, polls, newsletters
* admin – ingestion, publishing, analytics

Example: `ai.ask({ q, productId, version?, locale? }) → { stream, citations }`

## 7. Deployment

Default stack: web, api, worker, db, vector, files, queue, proxy.
Optional Kubernetes manifests for scale.
Monitoring: OpenTelemetry, Prometheus, Grafana.
Nightly backups for DB, vector, and file storage.

## 8. Security

* Row-level multi-tenancy (tenantId scope)
* JWT auth with RBAC
* Strict CSP & signed URLs
* Virus scan uploads (ClamAV container)
* No third-party trackers

## 9. Extensibility

Plugin interfaces:

* AIProvider – embeddings & completion logic
* AuthProvider – auth sources
* AnalyticsAdapter – event pipeline
* ThemePack – colors & layout overrides
