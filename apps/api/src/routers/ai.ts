import { z } from 'zod';
import { createNoopAIProvider } from '@docunest/plugins';
import { publicProcedure, router } from '../trpc';

const aiProvider = createNoopAIProvider();

export const aiRouter = router({
  ask: publicProcedure
    .input(
      z.object({
        q: z.string().min(1),
        productId: z.string().uuid().optional(),
        version: z.string().optional(),
        locale: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const response = await aiProvider.ask({
        question: input.q,
        productId: input.productId,
        version: input.version,
        locale: input.locale,
      });
      return response;
    }),
});
