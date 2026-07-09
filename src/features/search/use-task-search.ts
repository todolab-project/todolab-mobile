import { useInfiniteQuery } from '@tanstack/react-query';

import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { TaskSearchQuery } from '@/types';

export function useTaskSearch(query: TaskSearchQuery) {
  return useInfiniteQuery({
    queryKey: taskQueryKeys.search(query),
    queryFn: ({ pageParam, signal }) =>
      taskApi.search({ ...query, cursor: pageParam ?? undefined }, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
