'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user: contextUser, isLoading: contextLoading } = useAuth();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Get user from BetterAuth session OR context
  const sessionUser = (session as any)?.user;
  const user = sessionUser || contextUser;

  // We are still checking if any auth is pending
  const isChecking = isPending || contextLoading;

  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
    }

    if (isChecking) return;
    if (user) return;

    // Add a small delay before redirecting to allow session hydration
    redirectTimer.current = setTimeout(() => {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }, 500);

    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, [user, isChecking, router, pathname]);

  // Show spinner while checking or while waiting to confirm unauthenticated
  if (isChecking || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Verifying authorization session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
