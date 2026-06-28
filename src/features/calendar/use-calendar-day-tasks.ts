import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { LocalDateString } from '@/types';

export function useCalendarDayTasks(date: LocalDateString) {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';
  const scheduledQuery = useQuery({
    queryKey: taskQueryKeys.today(date),
    queryFn: ({ signal }) => taskApi.getToday(date, signal),
    enabled: canFetch,
  });
  const doneQuery = useQuery({
    queryKey: taskQueryKeys.done(date),
    queryFn: ({ signal }) => taskApi.getDone(date, signal),
    enabled: canFetch,
  });
  const queries = [scheduledQuery, doneQuery];

  return {
    scheduledTasks: scheduledQuery.data ?? [],
    doneTasks: doneQuery.data ?? [],
    isPending: queries.some((query) => query.isPending),
    isFetching: queries.some((query) => query.isFetching),
    error: queries.find((query) => query.error)?.error ?? null,
    refetch: async () => {
      await Promise.all(queries.map((query) => query.refetch()));
    },
  };
}
