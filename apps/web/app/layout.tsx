import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DocuNest',
  description: 'Manual intelligence platform'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">DocuNest</h1>
            <p className="text-slate-400">Product manuals with AI assistance</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
