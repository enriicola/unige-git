'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import { fetchUserInfo } from '#js/store/slices/auth';

export default function useRoleGuard({
  allowedRoles = [],
  redirectWhenUnauth = '/login',
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, loading } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current || loading) return;
    fetchedRef.current = true;
    dispatch(fetchUserInfo());
  }, [dispatch, loading]);

  useEffect(() => {
    if (loading) return;
    fetchedRef.current = true;
    if (!isLoggedIn || !user) {
      setIsAuthorized(false);
      if (pathname !== redirectWhenUnauth) router.replace(redirectWhenUnauth);
      return;
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role) &&
      pathname
    ) {
      const fallback =
        user.role === 'student' ? '/student/challenges' : '/challenges';
      if (pathname !== fallback) router.replace(fallback);
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [
    allowedRoles,
    isLoggedIn,
    loading,
    pathname,
    redirectWhenUnauth,
    router,
    user,
  ]);

  return { user, isAuthorized, loading };
}
