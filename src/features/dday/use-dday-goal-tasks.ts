import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { ddayApi } from './dday-api';
import { ddayQueryKeys } from './dday-query-keys';

export function useDdayGoalTasks(goalId: number) {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';

  return useQuery({
    queryKey: ddayQueryKeys.tasks(goalId),
    queryFn: ({ signal }) => ddayApi.getTasks(goalId, signal),
    enabled: canFetch,
  });
}
