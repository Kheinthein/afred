import { AuthProvider } from '@shared/providers/AuthProvider';
import { QueryProvider } from '@shared/providers/QueryProvider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Alfred - Assistant d'Écriture IA",
  description: "Application d'écriture avec assistant IA pour écrivains",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
