import { getEnv, logger } from '@docunest/utils';

const env = getEnv();

export type VectorPoint = {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
};

export class VectorClient {
  constructor(private readonly baseUrl: string) {}

  async upsert(collection: string, points: VectorPoint[]) {
    if (!this.baseUrl) {
      return;
    }
    await fetch(`${this.baseUrl}/collections/${collection}/points`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
  }
}

export const vectorClient = env.QDRANT_URL
  ? new VectorClient(env.QDRANT_URL)
  : null;

export const ensureVectorClient = () => {
  if (!vectorClient) {
    logger.warn('Vector backend is not configured; skipping embeddings');
  }
  return vectorClient;
};
