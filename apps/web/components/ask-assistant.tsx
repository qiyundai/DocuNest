'use client';

import { FormEvent, useState } from 'react';
import { trpc } from '@/lib/trpc';

type Props = {
  productId?: string;
  locale?: string;
};

export function AskAssistant({ productId, locale }: Props) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    setLoading(true);
    setAnswer(null);
    try {
      const response = await trpc.ai.ask.query({
        q: question,
        productId,
        locale
      });
      setAnswer(response.answer);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="question">
            Ask the assistant
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-slate-100 focus:border-indigo-500 focus:outline-none"
            rows={3}
            placeholder="How do I reset the device?"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>
      {answer && (
        <div className="mt-4 rounded-md bg-slate-950 p-4 text-sm text-slate-200">
          <p className="font-semibold text-indigo-300">Assistant</p>
          <p className="mt-2 whitespace-pre-line leading-relaxed">{answer}</p>
        </div>
      )}
    </section>
  );
}
