import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { initializeAccessToken } from '@/services/api';

export function AuthTokenBootstrap({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    initializeAccessToken()
      .catch(() => {
        // 저장소 접근 실패는 로그인 화면이나 API 오류 흐름에서 다시 안내한다.
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return children;
}
