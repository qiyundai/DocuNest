import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { z } from 'zod';
import { env } from '../config/env.js';
import { publicProcedure, router } from './trpc.js';

const connection = new IORedis(env.REDIS_URL);
const ingestQueue = new Queue('ingest', { connection });

export const adminRouter = router({
  ingest: router({
    start: publicProcedure
      .input(
        z
          .object({
            tenantId: z.string().uuid(),
            url: z.string().url().optional(),
            fileKey: z.string().optional(),
            productId: z.string().uuid(),
            locale: z.string().min(2),
          })
          .refine((data) => Boolean(data.url ?? data.fileKey), {
            message: 'Either url or fileKey must be provided',
            path: ['url'],
          }),
      )
      .mutation(async ({ input }) => {
        const job = await ingestQueue.add('ingest-manual', input, {
          removeOnComplete: true,
          removeOnFail: false,
        });

        return { jobId: job.id };
      }),
    status: publicProcedure
      .input(
        z.object({
          jobId: z.string(),
        }),
      )
      .query(async ({ input }) => {
        const job = await ingestQueue.getJob(input.jobId);
        if (!job) {
          return { jobId: input.jobId, state: 'not_found' as const };
        }

        const state = await job.getState();
        return {
          jobId: job.id,
          state,
          progress: job.progress,
        };
      }),
  }),
});
