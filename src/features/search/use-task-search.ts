import { useQuery } from '@tanstack/react-query';

import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { TaskSearchQuery } from '@/types';

export function useTaskSearch(query: TaskSearchQuery) {
  return useQuery({
    queryKey: taskQueryKeys.search(query),
    queryFn: ({ signal }) => taskApi.search(query, signal),
  });
}
