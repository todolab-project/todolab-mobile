import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { shouldRetryQuery } from './query-retry';

const isServerRendering = Platform.OS === 'web' && typeof window === 'undefined';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: isServerRendering ? Infinity : 5 * 60_000,
      retry: shouldRetryQuery,
      retryDelay: (attemptIndex) => Math.min(1_000 * 2 ** attemptIndex, 5_000),
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    focusManager.setFocused(AppState.currentState === 'active');
    const subscription = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active');
    });

    return () => {
      subscription.remove();
      focusManager.setFocused(undefined);
    };
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
