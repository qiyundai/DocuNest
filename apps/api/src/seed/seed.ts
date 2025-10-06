import { manualSchema } from '@docunest/schema';
import { prisma } from '../db.js';

const SEED_TENANT_ID = '00000000-0000-0000-0000-000000000010';
const SEED_PRODUCT_ID = '00000000-0000-0000-0000-000000000011';
const SEED_MANUAL_ID = '00000000-0000-0000-0000-000000000001';
const SEED_SECTION_ID = '00000000-0000-0000-0000-000000000002';

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { id: SEED_TENANT_ID },
    update: { name: 'Acme' },
    create: {
      id: SEED_TENANT_ID,
      name: 'Acme',
    },
  });

  const product = await prisma.product.upsert({
    where: { id: SEED_PRODUCT_ID },
    update: {
      tenantId: tenant.id,
      name: 'Acme X100',
      model: 'X100',
      sku: 'X100-BASE',
    },
    create: {
      id: SEED_PRODUCT_ID,
      tenantId: tenant.id,
      name: 'Acme X100',
      model: 'X100',
      sku: 'X100-BASE',
    },
  });

  const manualData = manualSchema.parse({
    manualId: SEED_MANUAL_ID,
    tenantId: tenant.id,
    product: {
      productId: product.id,
      model: product.model,
      sku: product.sku,
    },
    version: '1.0.0',
    locale: 'en-US',
    sections: [
      {
        id: SEED_SECTION_ID,
        title: 'Safety',
        order: 1,
        content: [
          {
            type: 'paragraph',
            text: 'Always disconnect power before servicing the Acme X100 system.',
          },
          {
            type: 'paragraph',
            text: 'Wear appropriate protective equipment at all times.',
          },
        ],
      },
    ],
  });

  const manual = await prisma.manual.upsert({
    where: {
      tenantId_manualId_version_locale: {
        tenantId: manualData.tenantId,
        manualId: manualData.manualId,
        version: manualData.version,
        locale: manualData.locale,
      },
    },
    update: {
      productId: manualData.product.productId,
      sections: {
        deleteMany: {},
        create: manualData.sections.map((section) => ({
          id: section.id,
          title: section.title,
          order: section.order,
          content: section.content,
        })),
      },
    },
    create: {
      tenantId: manualData.tenantId,
      productId: manualData.product.productId,
      manualId: manualData.manualId,
      version: manualData.version,
      locale: manualData.locale,
      sections: {
        create: manualData.sections.map((section) => ({
          id: section.id,
          title: section.title,
          order: section.order,
          content: section.content,
        })),
      },
    },
    include: {
      product: true,
      sections: true,
    },
  });

  console.log('Seed complete', {
    tenantId: tenant.id,
    productId: product.id,
    manualId: manual.id,
    sectionIds: manual.sections.map((section) => section.id),
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
