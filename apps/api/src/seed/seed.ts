import { manualSchema } from '@docunest/schema';
import { logger } from '@docunest/utils';
import { prisma } from '../db';

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { name: 'Acme' },
    update: {},
    create: {
      name: 'Acme'
    }
  });

  const product = await prisma.product.upsert({
    where: { sku: 'X100' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Acme X100',
      model: 'X100',
      sku: 'X100'
    }
  });

  const manual = await prisma.manual.upsert({
    where: { manualId: 'acme-x100-manual' },
    update: {
      productId: product.id,
      version: '1.0.0',
      locale: 'en-US'
    },
    create: {
      tenantId: tenant.id,
      productId: product.id,
      manualId: 'acme-x100-manual',
      version: '1.0.0',
      locale: 'en-US'
    }
  });

  const section = await prisma.manualSection.upsert({
    where: { id: manual.id },
    update: {
      title: 'Safety',
      order: 0,
      content: [
        {
          type: 'paragraph',
          text: 'Always disconnect the X100 from power before servicing.'
        }
      ]
    },
    create: {
      id: manual.id,
      manualId: manual.id,
      title: 'Safety',
      order: 0,
      content: [
        {
          type: 'paragraph',
          text: 'Always disconnect the X100 from power before servicing.'
        }
      ]
    }
  });

  manualSchema.parse({
    id: manual.id,
    manualId: manual.manualId,
    tenantId: manual.tenantId,
    product: {
      model: product.model,
      sku: product.sku
    },
    version: manual.version,
    locale: manual.locale,
    sections: [
      {
        id: section.id,
        title: section.title,
        order: section.order,
        content: section.content as unknown[]
      }
    ]
  });

  logger.info({ tenantId: tenant.id, productId: product.id, manualId: manual.id }, 'Seed complete');
}

main()
  .catch((error) => {
    logger.error(error, 'Seed failed');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
