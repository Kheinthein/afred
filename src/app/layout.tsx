import { AuthProvider } from '@shared/providers/AuthProvider';
import { QueryProvider } from '@shared/providers/QueryProvider';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Alfred - Assistant d'Écriture IA",
  description: "Application d'écriture avec assistant IA pour écrivains",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
