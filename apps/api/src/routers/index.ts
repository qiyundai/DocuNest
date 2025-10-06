import { router } from '../trpc';
import { adminRouter } from './admin';
import { aiRouter } from './ai';
import { authRouter } from './auth';
import { docsRouter } from './docs';
import { searchRouter } from './search';

export const appRouter = router({
  auth: authRouter,
  docs: docsRouter,
  search: searchRouter,
  ai: aiRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
