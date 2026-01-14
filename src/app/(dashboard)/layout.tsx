'use client';

import { useAuth } from '@shared/providers/AuthProvider';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const isE2ETest = process.env.NEXT_PUBLIC_E2E === 'true';

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.ReactElement | null {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isE2ETest) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && !isE2ETest) {
    return null;
  }

  const handleLogout = (): void => {
    logout();
    router.replace('/login');
    setMobileMenuOpen(false);
  };

  const handleNavigate = (path: string): void => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Mobile: Logo/User info */}
            <div className="flex-1">
              <p className="text-xs text-gray-500 sm:text-sm">Bienvenue</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-base">
                {user?.email}
              </p>
            </div>

            {/* Desktop: Navigation buttons */}
            <div className="hidden items-center gap-3 md:flex">
              <button
                onClick={() => router.push('/documents')}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Mes documents
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Déconnexion
              </button>
            </div>

            {/* Mobile: Hamburger menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile: Dropdown menu */}
          {mobileMenuOpen && (
            <div className="mt-4 border-t border-gray-200 pt-4 md:hidden">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigate('/documents')}
                  className="rounded-md bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Mes documents
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-md border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Déconnexion
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
