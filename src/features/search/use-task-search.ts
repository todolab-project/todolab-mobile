import { useInfiniteQuery } from '@tanstack/react-query';

import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { TaskSearchQuery } from '@/types';

type UseTaskSearchOptions = {
  enabled?: boolean;
};

export function useTaskSearch(query: TaskSearchQuery, options: UseTaskSearchOptions = {}) {
  return useInfiniteQuery({
    queryKey: taskQueryKeys.search(query),
    queryFn: ({ pageParam, signal }) =>
      taskApi.search({ ...query, cursor: pageParam ?? undefined }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options.enabled ?? true,
  });
}
