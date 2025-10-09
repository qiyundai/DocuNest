import Link from 'next/link';
import { getTenantId } from '@/lib/constants';
import { serverClient } from '@/lib/trpc/server';

interface Product {
  id: string;
  name: string;
  model: string;
  sku: string;
}

interface Manual {
  id: string;
  version: string;
  locale: string;
  product: Product;
}

export default async function HomePage() {
  const client = serverClient();
  let manuals: Manual[] = [];
  let error: string | null = null;
  
  try {
    manuals = await client.docs.listManuals.query({ tenantId: getTenantId() });
  } catch (err) {
    console.error('Failed to fetch manuals:', err);
    error = err instanceof Error ? err.message : 'Failed to load manuals';
    // Fallback to empty array during build time
  }

  const products = manuals.reduce((acc: Record<string, Product>, manual: Manual) => {
    acc[manual.product.id] = manual.product;
    return acc;
  }, {});

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">DocuNest Manuals</h1>
        <p className="text-slate-300">Browse manuals and open an AI-assisted view.</p>
      </header>
      
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <h3 className="text-red-400 font-medium">Error loading manuals</h3>
          <p className="text-red-300 text-sm mt-1">{error}</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.values(products).map((product: Product) => (
          <article key={product.id} className="rounded-lg border border-slate-800 bg-slate-900 p-4 shadow">
            <h2 className="text-xl font-medium">{product.name}</h2>
            <p className="text-sm text-slate-400">Model {product.model} · SKU {product.sku}</p>
            <ul className="mt-3 space-y-2">
              {manuals
                .filter((manual: Manual) => manual.product.id === product.id)
                .map((manual: Manual) => (
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
