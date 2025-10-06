import { notFound } from 'next/navigation';
import { DEFAULT_TENANT_ID } from '@/lib/constants';
import { serverClient } from '@/lib/trpc/server';
import { ManualViewer } from '@/components/manual-viewer';
import { AiAssistant } from '@/components/ai-assistant';

type ManualPageProps = {
  params: { id: string };
};

export default async function ManualPage({ params }: ManualPageProps) {
  const client = serverClient();
  const manual = await client.docs.getManual.query({ manualId: params.id });

  if (!manual) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <p className="text-sm text-slate-400">Manual ID {manual.manualId}</p>
        <h1 className="text-3xl font-semibold">{manual.product.model} · v{manual.version}</h1>
        <p className="text-slate-300">
          SKU {manual.product.sku} · Locale {manual.locale}
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <ManualViewer manual={manual} />
        <AiAssistant
          tenantId={DEFAULT_TENANT_ID}
          manualId={manual.manualId}
          productId={manual.product.productId}
          version={manual.version}
          locale={manual.locale}
        />
      </div>
    </div>
  );
}
