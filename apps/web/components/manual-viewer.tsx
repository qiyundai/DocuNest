import Image from 'next/image';
import type { Manual } from '@docunest/schema';

interface ManualViewerProps {
  manual: Manual;
}

export const ManualViewer = ({ manual }: ManualViewerProps) => {
  return (
    <article className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6 shadow">
      {manual.sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <section key={section.id} className="space-y-3">
            <header>
              <h2 className="text-2xl font-semibold text-emerald-300">{section.title}</h2>
            </header>
            <div className="space-y-3 text-slate-200">
              {section.content.map((node, index) => {
                if (node.type === 'paragraph') {
                  return (
                    <p key={index} className="leading-relaxed">
                      {node.text}
                    </p>
                  );
                }

                return (
                  <figure key={index} className="space-y-2">
                    <Image
                      alt={node.alt}
                      src={node.url}
                      width={960}
                      height={540}
                      className="h-auto w-full rounded border border-slate-800"
                    />
                    {node.caption && <figcaption className="text-sm text-slate-400">{node.caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          </section>
        ))}
    </article>
  );
};
