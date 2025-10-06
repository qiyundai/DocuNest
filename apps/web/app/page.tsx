import Link from 'next/link';
import { trpc } from '@/lib/trpc';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  if (!tenantId) {
    return (
      <section className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-6 text-amber-100">
        <p className="font-semibold">Tenant configuration missing</p>
        <p className="text-sm text-amber-200/80">
          Set NEXT_PUBLIC_TENANT_ID in your environment to load manuals.
        </p>
      </section>
    );
  }

  const manuals = await trpc.docs.listManuals.query({ tenantId });

  if (manuals.length === 0) {
    return (
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <p className="text-sm text-slate-300">No manuals available yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {manuals.map((manual) => (
        <Link
          key={manual.id}
          href={`/manual/${manual.id}`}
          className="block rounded-lg border border-slate-800 bg-slate-900/60 p-6 transition hover:border-indigo-500 hover:shadow-lg"
        >
          <h2 className="text-xl font-semibold text-white">{manual.product.model}</h2>
          <p className="text-sm text-slate-400">SKU {manual.product.sku}</p>
          <p className="mt-2 text-xs text-slate-500">
            Version {manual.version} · Locale {manual.locale}
          </p>
        </Link>
      ))}
    </section>
  );
}
