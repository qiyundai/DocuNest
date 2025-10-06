import { z } from 'zod';

export const contentNodeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('paragraph'),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('image'),
    url: z.string().url(),
    alt: z.string().min(1),
    caption: z.string().optional(),
  }),
]);

export const manualSectionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  order: z.number().int().nonnegative(),
  content: z.array(contentNodeSchema),
});

export const manualSchema = z.object({
  manualId: z.string().uuid(),
  tenantId: z.string().uuid(),
  product: z.object({
    productId: z.string().uuid(),
    model: z.string().min(1),
    sku: z.string().min(1),
  }),
  version: z.string().min(1),
  locale: z.string().min(2),
  sections: z.array(manualSectionSchema),
});

export type ContentNode = z.infer<typeof contentNodeSchema>;
export type ManualSection = z.infer<typeof manualSectionSchema>;
export type Manual = z.infer<typeof manualSchema>;
