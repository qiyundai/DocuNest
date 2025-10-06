import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  ping: publicProcedure.query(() => ({ status: 'ok' })),
});
