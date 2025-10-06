import { Job } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { logger } from '@docunest/utils';
import { prisma } from '../db';
import { ensureVectorClient } from '../vector';

export type EmbedJobData = {
  manualId: string;
};

export type EmbedJobResult = {
  chunks: number;
};

const chunkText = (text: string, size = 400): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

const fakeEmbed = (text: string): number[] => {
  const vector = new Array(8)
    .fill(0)
    .map((_, index) => Math.sin(text.length + index));
  return vector;
};

export const embedProcessor = async (
  job: Job<EmbedJobData, EmbedJobResult>,
): Promise<EmbedJobResult> => {
  const manual = await prisma.manual.findUnique({
    where: { id: job.data.manualId },
    include: { sections: true, product: true },
  });
  if (!manual) {
    logger.warn(
      {
        manualId: job.data.manualId,
      },
      'Manual not found for embedding',
    );
    return { chunks: 0 };
  }

  const vector = ensureVectorClient();
  let totalChunks = 0;

  for (const section of manual.sections) {
    const textContent = Array.isArray(section.content)
      ? section.content
          .filter(
            (node: { type?: string; text?: string }) =>
              node.type === 'paragraph',
          )
          .map((node) => node.text ?? '')
          .join(' ')
      : '';

    const textChunks = chunkText(textContent);
    totalChunks += textChunks.length;

    for (const chunk of textChunks) {
      const chunkId = randomUUID();
      await prisma.embeddingChunk.create({
        data: {
          id: chunkId,
          manualId: manual.id,
          sectionId: section.id,
          locale: manual.locale,
          text: chunk,
        },
      });

      if (vector) {
        await vector.upsert('manual-embeddings', [
          {
            id: chunkId,
            vector: fakeEmbed(chunk),
            payload: {
              tenantId: manual.tenantId,
              productId: manual.productId,
              manualId: manual.id,
              locale: manual.locale,
              sectionId: section.id,
            },
          },
        ]);
      }
    }
  }

  logger.info(
    { manualId: manual.id, chunks: totalChunks },
    'Embed job completed',
  );
  return { chunks: totalChunks };
};
