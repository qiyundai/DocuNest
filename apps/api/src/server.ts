import cors from 'cors';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { logger } from '@docunest/utils';
import { appRouter } from './routers';
import { apiConfig } from './config/env';
import { createContext } from './trpc';

export const createServer = () => {
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
      createContext
    })
  );

  return app;
};

if (process.env.NODE_ENV !== 'test') {
  const server = createServer();
  server.listen(apiConfig.port, () => {
    logger.info({ port: apiConfig.port }, 'API server listening');
  });
}
