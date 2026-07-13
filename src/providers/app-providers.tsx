import type { PropsWithChildren } from 'react';

import { QueryProvider } from './query-provider';
import { SessionExpiryRedirect } from './session-expiry-redirect';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <SessionExpiryRedirect>{children}</SessionExpiryRedirect>
    </QueryProvider>
  );
}
