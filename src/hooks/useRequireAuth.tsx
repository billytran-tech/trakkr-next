import { useAuth } from 'hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useRequireAuth = (redirectUrl = '/sign-in') => {
  const auth = useAuth();
  const router = useRouter();

  // If auth.user is false that means we're not
  // logged in and should redirect.
  useEffect(() => {
    if (!auth.user) {
      router.push(redirectUrl);
    }
  }, [auth, redirectUrl, router]);

  return auth;
};
