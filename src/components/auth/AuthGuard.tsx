'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Adjust this import to how your provider exposes the hook
import { useAuth } from 'react-oidc-context';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const auth = useAuth(); // expects { user, loading }

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.replace('/'); // or '/signin'
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (auth.isLoading || !auth.isAuthenticated) return null; // or a spinner

  return <>{children}</>;
}