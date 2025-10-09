import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { extractTokenFromHeader, verifyToken } from '../auth/jwt.js';
import { db } from '../db.js';

export const createContext = async ({ req }: CreateExpressContextOptions) => {
  const authHeader = req.header('authorization');
  const token = extractTokenFromHeader(authHeader);
  
  let user = null;
  let tenantId = null;
  
  if (token) {
    try {
      const payload = verifyToken(token);
      const dbUser = await db.user.findUnique({
        where: { id: payload.userId },
        include: { tenant: true }
      });
      
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          tenantId: dbUser.tenantId,
          tenant: dbUser.tenant
        };
        tenantId = dbUser.tenantId;
      }
    } catch (error) {
      // Invalid token, continue without user
    }
  }
  
  return { 
    user,
    tenantId,
    req 
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user // Now guaranteed to be non-null
    }
  });
});

// Admin procedure that requires specific tenant access
export const tenantProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  
  if (!ctx.tenantId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Tenant access required'
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      tenantId: ctx.tenantId
    }
  });
});
