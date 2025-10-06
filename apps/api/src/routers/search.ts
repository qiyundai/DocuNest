import { z } from 'zod';
import { publicProcedure, router } from './trpc.js';

export const searchRouter = router({
  query: publicProcedure
    .input(
      z.object({
        tenantId: z.string().uuid(),
        q: z.string().min(1),
        productId: z.string().uuid().optional(),
      }),
    )
    .query(async () => {
      return [];
    }),
});
