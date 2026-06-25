import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

export function useTaskDetail(taskId: number | null) {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';

  return useQuery({
    queryKey: taskId ? taskQueryKeys.detail(taskId) : taskQueryKeys.all,
    queryFn: ({ signal }) => taskApi.get(taskId ?? 0, signal),
    enabled: canFetch && taskId !== null,
  });
}
