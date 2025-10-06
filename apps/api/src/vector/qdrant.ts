import { env } from '../config/env';

export type QdrantPoint = {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
};

export class QdrantClient {
  constructor(private readonly baseUrl: string) {}

  async ensureCollection(collection: string, vectorSize: number) {
    const response = await fetch(`${this.baseUrl}/collections/${collection}`);
    if (response.ok) {
      return;
    }

    const body = {
      vectors: {
        size: vectorSize,
        distance: 'Cosine'
      }
    };

    await fetch(`${this.baseUrl}/collections/${collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }

  async upsert(collection: string, points: QdrantPoint[]) {
    await fetch(`${this.baseUrl}/collections/${collection}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
  }
}

export const qdrantClient = env.QDRANT_URL
  ? new QdrantClient(env.QDRANT_URL)
  : null;
