import cors from 'cors';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { logger } from '@docunest/utils';
import { appRouter } from './routers/index.js';
import { createContext } from './routers/trpc.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const port = Number(process.env.PORT ?? 4000);

export const server = app.listen(port, () => {
  logger.info({ port }, 'API server listening');
});

export type AppRouter = typeof appRouter;
