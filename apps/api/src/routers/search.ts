import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const searchRouter = router({
  query: publicProcedure
    .input(
      z.object({
        q: z.string().min(1),
        productId: z.string().uuid().optional(),
      }),
    )
    .query(async () => {
      return [];
    }),
});
