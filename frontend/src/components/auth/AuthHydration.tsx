'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { hydrate } from '@/store/slices/authSlice';

export default function AuthHydration({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  return <>{children}</>;
}
