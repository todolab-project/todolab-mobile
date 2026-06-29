import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { taskApi, taskQueryKeys } from '@/features/tasks';

export function useInboxTasks() {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';

  return useQuery({
    queryKey: taskQueryKeys.inbox(),
    queryFn: ({ signal }) => taskApi.getInbox(signal),
    enabled: canFetch,
  });
}
