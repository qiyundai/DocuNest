'use client';

import { FormEvent, useState } from 'react';
import { DEFAULT_TENANT_ID } from '@/lib/constants';
import { trpcClient } from '@/lib/trpc/client';

type AiAssistantProps = {
  tenantId?: string;
  manualId: string;
  productId: string;
  version: string;
  locale: string;
};

export const AiAssistant = ({ tenantId, manualId, productId, version, locale }: AiAssistantProps) => {
  const [question, setQuestion] = useState('How do I stay safe while operating this product?');
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedTenantId = tenantId ?? process.env.NEXT_PUBLIC_TENANT_ID ?? DEFAULT_TENANT_ID;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await trpcClient.ai.ask.mutate({
        tenantId: resolvedTenantId,
        manualId,
        q: question,
        productId,
        version,
        locale,
      });
      setAnswer(response.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to contact assistant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow">
      <h2 className="text-xl font-semibold text-emerald-300">Ask DocuNest AI</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          className="w-full rounded border border-slate-700 bg-slate-950 p-3 text-slate-100"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={4}
          placeholder="Ask a question about this manual"
        />
        <button
          type="submit"
          className="w-full rounded bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          disabled={isLoading || question.trim().length === 0}
        >
          {isLoading ? 'Thinking…' : 'Ask'}
        </button>
      </form>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Assistant</h3>
        <p className="whitespace-pre-wrap text-sm text-slate-200">{answer || 'Ask a question to see the response.'}</p>
      </div>
    </aside>
  );
};
