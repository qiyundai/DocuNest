import { createNoopAIProvider } from '@docunest/plugins';
import { z } from 'zod';
import { publicProcedure, router } from './trpc.js';

const aiProvider = createNoopAIProvider();

export const aiRouter = router({
  ask: publicProcedure
    .input(
      z.object({
        tenantId: z.string().uuid(),
        q: z.string().min(1),
        manualId: z.string().uuid().optional(),
        productId: z.string().uuid().optional(),
        version: z.string().optional(),
        locale: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await aiProvider.ask({
        tenantId: input.tenantId,
        manualId: input.manualId,
        productId: input.productId,
        version: input.version,
        locale: input.locale,
        question: input.q,
      });

      return response;
    }),
});
