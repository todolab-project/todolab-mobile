import { useQueries } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { getWeekDates } from '@/features/calendar/calendar-date';
import { taskApi, taskQueryKeys } from '@/features/tasks';
import type { LocalDateString, TaskResponse } from '@/types';

export type CompletedDay = {
  date: LocalDateString;
  tasks: TaskResponse[];
  isPending: boolean;
  error: Error | null;
};

export function useCompletedWeek(selectedDate: LocalDateString) {
  const canFetch = Platform.OS !== 'web' || typeof window !== 'undefined';
  const dates = getWeekDates(selectedDate);
  const queries = useQueries({
    queries: dates.map((date) => ({
      queryKey: taskQueryKeys.done(date),
      queryFn: ({ signal }: { signal: AbortSignal }) => taskApi.getDone(date, signal),
      enabled: canFetch,
    })),
  });
  const days: CompletedDay[] = dates.map((date, index) => ({
    date,
    tasks: queries[index]?.data ?? [],
    isPending: queries[index]?.isPending ?? false,
    error: queries[index]?.error ?? null,
  }));

  return {
    days,
    isPending: days.some((day) => day.isPending),
    error: days.find((day) => day.error)?.error ?? null,
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
}
