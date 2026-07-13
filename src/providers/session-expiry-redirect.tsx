import { useRouter } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { subscribeSessionExpired } from '@/services/api';

import { queryClient } from './query-provider';

export function SessionExpiryRedirect({ children }: PropsWithChildren) {
  const router = useRouter();

  useEffect(
    () =>
      subscribeSessionExpired(() => {
        queryClient.clear();
        router.replace('/login');
      }),
    [router],
  );

  return children;
}
