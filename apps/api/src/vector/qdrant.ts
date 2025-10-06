import { QdrantClient } from '@qdrant/js-client-rest';
import type { VectorParams } from '@qdrant/js-client-rest';
import { env } from '../config/env.js';

const client = new QdrantClient({ url: env.QDRANT_URL });

export const ensureCollection = async (
  collectionName: string,
  vectorParams: VectorParams = { size: 768, distance: 'Cosine' },
): Promise<void> => {
  const collections = await client.getCollections();
  const exists = collections.collections.some((collection) => collection.name === collectionName);
  if (!exists) {
    await client.createCollection(collectionName, {
      vectors: vectorParams,
    });
  }
};

export interface VectorPoint {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

export const upsertVectors = async (
  collectionName: string,
  points: VectorPoint[],
): Promise<void> => {
  await ensureCollection(collectionName);
  await client.upsert(collectionName, {
    wait: true,
    points: points.map((point) => ({
      id: point.id,
      vector: point.vector,
      payload: point.payload,
    })),
  });
};

export const qdrantClient = client;
