import { notFound } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { AskAssistant } from '@/components/ask-assistant';

export const dynamic = 'force-dynamic';

type Params = {
  params: {
    id: string;
  };
};

const renderContent = (content: unknown[]) => {
  return content.map((node, index) => {
    if (typeof node !== 'object' || node === null) {
      return null;
    }
    const typed = node as { type?: string; text?: string; url?: string; alt?: string };
    if (typed.type === 'paragraph') {
      return (
        <p key={index} className="leading-relaxed text-slate-200">
          {typed.text}
        </p>
      );
    }
    if (typed.type === 'image' && typed.url) {
      return (
        <figure key={index} className="mt-4">
          <img src={typed.url} alt={typed.alt ?? ''} className="rounded-lg border border-slate-800" />
        </figure>
      );
    }
    return null;
  });
};

export default async function ManualPage({ params }: Params) {
  const manual = await trpc.docs.getManual.query({ manualId: params.id });
  if (!manual) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <header>
        <h2 className="text-2xl font-semibold text-white">Manual</h2>
        <p className="text-sm text-slate-400">
          {manual.product.model} · {manual.version} · {manual.locale}
        </p>
      </header>
      {manual.sections.map((section) => (
        <section key={section.id} className="space-y-4 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-xl font-semibold text-indigo-300">{section.title}</h3>
          <div className="space-y-4">{renderContent(section.content as unknown[])}</div>
        </section>
      ))}
      <AskAssistant locale={manual.locale} />
    </article>
  );
}
