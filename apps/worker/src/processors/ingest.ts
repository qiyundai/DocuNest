import { Job } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { logger } from '@docunest/utils';
import { prisma } from '../db';

export type IngestJobData = {
  tenantId: string;
  productId: string;
  locale: string;
  url?: string;
  fileKey?: string;
};

export type IngestJobResult = {
  manualId: string;
};

export const ingestProcessor = async (
  job: Job<IngestJobData, IngestJobResult>
): Promise<IngestJobResult> => {
  const manualId = randomUUID();
  const manual = await prisma.manual.create({
    data: {
      id: manualId,
      tenantId: job.data.tenantId,
      productId: job.data.productId,
      manualId,
      version: '1.0.0',
      locale: job.data.locale,
    },
  });

  await prisma.manualSection.create({
    data: {
      manualId: manual.id,
      title: 'Overview',
      order: 0,
      content: [
        {
          type: 'paragraph',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
        },
      ],
    },
  });

  logger.info(
    { jobId: job.id, manualId: manual.id },
    'Ingest job completed',
  );
  return { manualId: manual.id };
};
