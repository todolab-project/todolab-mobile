import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { ddayApi } from './dday-api';
import { ddayQueryKeys } from './dday-query-keys';

export function useDdayGoals() {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';

  return useQuery({
    queryKey: ddayQueryKeys.list(),
    queryFn: ({ signal }) => ddayApi.list(signal),
    enabled: canFetch,
  });
}
