import { publicProcedure, router } from './trpc.js';

export const authRouter = router({
  ping: publicProcedure.query(() => ({ status: 'ok' })),
});
