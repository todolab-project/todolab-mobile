import type { PropsWithChildren } from 'react';

import { AuthTokenBootstrap } from './auth-token-bootstrap';
import { QueryProvider } from './query-provider';
import { SessionExpiryRedirect } from './session-expiry-redirect';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <AuthTokenBootstrap>
        <SessionExpiryRedirect>{children}</SessionExpiryRedirect>
      </AuthTokenBootstrap>
    </QueryProvider>
  );
}
