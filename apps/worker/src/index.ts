import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { getEnv, logger } from '@docunest/utils';
import { embedProcessor } from './processors/embed';
import { ingestProcessor } from './processors/ingest';

const env = getEnv();

const connection = new IORedis(env.REDIS_URL ?? 'redis://localhost:6379');

export const ingestQueue = new Queue('ingest', { connection });
export const embedQueue = new Queue('embed', { connection });

export const startWorker = () => {
  const ingestWorker = new Worker(
    'ingest',
    async (job) => {
      const result = await ingestProcessor(job);
      await embedQueue.add('embed-manual', { manualId: result.manualId });
      return result;
    },
    { connection }
  );

  const embedWorker = new Worker('embed', embedProcessor, { connection });

  const handleError = (error: Error) => {
    logger.error(error, 'Worker error');
  };

  ingestWorker.on('failed', (_job, err) => handleError(err));
  embedWorker.on('failed', (_job, err) => handleError(err));

  const shutdown = async () => {
    await ingestWorker.close();
    await embedWorker.close();
    await ingestQueue.close();
    await embedQueue.close();
    await connection.quit();
  };

  return { ingestWorker, embedWorker, shutdown };
};
