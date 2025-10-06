import Link from 'next/link';
import { DEFAULT_TENANT_ID } from '@/lib/constants';
import { serverClient } from '@/lib/trpc/server';

export default async function HomePage() {
  const client = serverClient();
  const manuals = await client.docs.listManuals.query({ tenantId: DEFAULT_TENANT_ID });

  const products = manuals.reduce<Record<string, typeof manuals[number]['product']>>((acc, manual) => {
    acc[manual.product.id] = manual.product;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">DocuNest Manuals</h1>
        <p className="text-slate-300">Browse manuals and open an AI-assisted view.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(products).map((product) => (
          <article key={product.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow">
            <h2 className="text-xl font-medium">{product.name}</h2>
            <p className="text-sm text-slate-400">Model {product.model} · SKU {product.sku}</p>
            <ul className="mt-3 space-y-2">
              {manuals
                .filter((manual) => manual.product.id === product.id)
                .map((manual) => (
                  <li key={manual.id}>
                    <Link
                      className="text-emerald-400 hover:text-emerald-300"
                      href={`/manual/${manual.id}`}
                    >
                      v{manual.version} · {manual.locale}
                    </Link>
                  </li>
                ))}
            </ul>
          </article>
        ))}
        {Object.values(products).length === 0 && (
          <p className="text-slate-400">No manuals ingested yet.</p>
        )}
      </div>
    </section>
  );
}
