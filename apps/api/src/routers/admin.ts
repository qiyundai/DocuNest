import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { ingestQueue } from '../queues';

const jobs = new Map<
  string,
  {
    status: 'queued' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
  }
>();

export const adminRouter = router({
  ingest: router({
    start: publicProcedure
      .input(
        z.object({
          url: z.string().url().optional(),
          fileKey: z.string().optional(),
          productId: z.string().uuid(),
          locale: z.string().min(2),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const product = await ctx.prisma.product.findUnique({
          where: { id: input.productId },
        });
        if (!product) {
          throw new Error('Product not found');
        }
        const job = await ingestQueue.add('ingest', {
          tenantId: product.tenantId,
          productId: input.productId,
          locale: input.locale,
          url: input.url,
          fileKey: input.fileKey,
        });
        const timestamp = new Date();
        jobs.set(job.id, {
          status: 'queued',
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        setTimeout(() => {
          const current = jobs.get(job.id);
          if (current && current.status === 'queued') {
            jobs.set(job.id, {
              ...current,
              status: 'completed',
              updatedAt: new Date(),
            });
          }
        }, 1500);
        return { jobId: job.id };
      }),
    status: publicProcedure
      .input(z.object({ jobId: z.string().min(1) }))
      .query(async ({ input }) => {
        const job = jobs.get(input.jobId);
        if (!job) {
          return { status: 'not_found' } as const;
        }
        return job;
      }),
  }),
});
