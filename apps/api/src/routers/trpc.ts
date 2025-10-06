import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = ({ req }: CreateExpressContextOptions) => {
  const tenantId = req.header('x-tenant-id') ?? null;
  return { tenantId };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
