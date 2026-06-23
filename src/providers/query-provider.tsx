import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { ApiClientError } from '@/services/api';

const isServerRendering = Platform.OS === 'web' && typeof window === 'undefined';

function shouldRetry(failureCount: number, error: Error) {
  if (failureCount >= 2) {
    return false;
  }

  if (!(error instanceof ApiClientError)) {
    return failureCount < 1;
  }

  if (error.kind === 'network' || error.kind === 'timeout') {
    return true;
  }

  return error.kind === 'http' && (error.status ?? 0) >= 500;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: isServerRendering ? Infinity : 5 * 60_000,
      retry: shouldRetry,
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
