import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export default function LegalLayout({
  title,
  updatedAt,
  children,
}: LegalLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updatedAt}</p>
        <div className="prose prose-invert mt-8 max-w-none">{children}</div>
      </div>
    </div>
  );
}
