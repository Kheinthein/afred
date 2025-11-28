'use client';

import { useAuth } from '@shared/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/app/documents');
    }
  }, [isAuthenticated, router]);

  return <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">{children}</div>;
}

