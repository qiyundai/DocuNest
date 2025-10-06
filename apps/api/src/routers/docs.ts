import { z } from 'zod';
import { manualSchema } from '@docunest/schema';
import { publicProcedure, router } from '../trpc';

const normalizeContent = (content: unknown): unknown[] => {
  if (!Array.isArray(content)) {
    return [];
  }
  return content;
};

export const docsRouter = router({
  listManuals: publicProcedure
    .input(z.object({ tenantId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const manuals = await ctx.prisma.manual.findMany({
        where: { tenantId: input.tenantId },
        include: { product: true }
      });
      return manuals.map((manual) => ({
        id: manual.id,
        manualId: manual.manualId,
        product: {
          model: manual.product.model,
          sku: manual.product.sku
        },
        version: manual.version,
        locale: manual.locale
      }));
    }),
  getManual: publicProcedure
    .input(z.object({ manualId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const manual = await ctx.prisma.manual.findUnique({
        where: { id: input.manualId },
        include: { sections: { orderBy: { order: 'asc' } }, product: true }
      });
      if (!manual) {
        return null;
      }
      const result = manualSchema.parse({
        id: manual.id,
        manualId: manual.manualId,
        tenantId: manual.tenantId,
        product: {
          model: manual.product.model,
          sku: manual.product.sku
        },
        version: manual.version,
        locale: manual.locale,
        sections: manual.sections.map((section) => ({
          id: section.id,
          title: section.title,
          order: section.order,
          content: normalizeContent(section.content)
        }))
      });
      return result;
    })
});
