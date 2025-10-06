import { adminRouter } from './admin.js';
import { aiRouter } from './ai.js';
import { authRouter } from './auth.js';
import { docsRouter } from './docs.js';
import { searchRouter } from './search.js';
import { router } from './trpc.js';

export const appRouter = router({
  auth: authRouter,
  docs: docsRouter,
  search: searchRouter,
  ai: aiRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
