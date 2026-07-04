import { useQuery } from '@tanstack/react-query';

import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { LocalDateString, TaskQueryType } from '@/types';

export function useCalendarRangeTasks(type: TaskQueryType, date: LocalDateString) {
  const query = { type, date };

  return useQuery({
    queryKey: taskQueryKeys.list(query),
    queryFn: ({ signal }) => taskApi.list(query, signal),
  });
}
