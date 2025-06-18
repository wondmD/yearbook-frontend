import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect(requireAuth = true, redirectPath = '/auth/login') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // If authentication is required but no session exists
    if (requireAuth && !session) {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectPath}?callbackUrl=${encodeURIComponent(currentPath)}`;
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.startsWith('/auth/login')) {
        window.location.href = loginUrl;
      }
    }
    
    // If user is authenticated but shouldn't be on this page (like login/signup)
    if (!requireAuth && session) {
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/';
      window.location.href = callbackUrl;
    }
  }, [session, status, requireAuth, redirectPath]);

  return { session, status };
}
