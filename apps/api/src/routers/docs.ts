import { contentNodeSchema, manualSchema, manualSectionSchema } from '@docunest/schema';
import { z } from 'zod';
import { prisma } from '../db.js';
import { tenantProcedure, router } from './trpc.js';

export const docsRouter = router({
  listManuals: tenantProcedure
    .input(
      z.object({
        tenantId: z.string().uuid().optional(), // Optional since we get it from context
      }),
    )
    .query(async ({ input, ctx }) => {
      // Use tenantId from authenticated context, fallback to input for backward compatibility
      const tenantId = ctx.tenantId || input.tenantId;
      
      if (!tenantId) {
        throw new Error('Tenant ID is required');
      }
      
      const manuals = await prisma.manual.findMany({
        where: { tenantId },
        include: {
          product: true,
        },
        orderBy: { updatedAt: 'desc' },
      });

      return manuals.map((manual: any) => ({
        id: manual.id,
        manualId: manual.manualId,
        version: manual.version,
        locale: manual.locale,
        product: {
          id: manual.product.id,
          name: manual.product.name,
          model: manual.product.model,
          sku: manual.product.sku,
        },
        updatedAt: manual.updatedAt,
      }));
    }),
  getManual: tenantProcedure
    .input(
      z.object({
        manualId: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const manual = await prisma.manual.findUnique({
        where: { 
          id: input.manualId,
          tenantId: ctx.tenantId // Ensure user can only access their tenant's manuals
        },
        include: { sections: { orderBy: { order: 'asc' } }, product: true },
      });

      if (!manual) {
        return null;
      }

      const sections = manual.sections.map((section: any) =>
        manualSectionSchema.parse({
          id: section.id,
          title: section.title,
          order: section.order,
          content: contentNodeSchema.array().parse((section.content as unknown[]) ?? []),
        }),
      );

      return manualSchema.parse({
        manualId: manual.manualId,
        tenantId: manual.tenantId,
        product: {
          productId: manual.productId,
          model: manual.product.model,
          sku: manual.product.sku,
        },
        version: manual.version,
        locale: manual.locale,
        sections,
      });
    }),
});
