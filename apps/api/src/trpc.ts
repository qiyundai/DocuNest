import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { prisma } from './db';

export const createContext = (_opts?: CreateExpressContextOptions) => ({
  prisma
});

type Context = ReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;
