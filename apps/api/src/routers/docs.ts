import { contentNodeSchema, manualSchema, manualSectionSchema } from '@docunest/schema';
import { z } from 'zod';
import { prisma } from '../db.js';
import { publicProcedure, router } from './trpc.js';

export const docsRouter = router({
  listManuals: publicProcedure
    .input(
      z.object({
        tenantId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const manuals = await prisma.manual.findMany({
        where: { tenantId: input.tenantId },
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
  getManual: publicProcedure
    .input(
      z.object({
        manualId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const manual = await prisma.manual.findUnique({
        where: { id: input.manualId },
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
