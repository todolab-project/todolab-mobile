import type { LocalDateString } from '@/types';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  detail: (taskId: number) => [...taskQueryKeys.all, 'detail', taskId] as const,
  today: (date: LocalDateString) => [...taskQueryKeys.all, 'today', date] as const,
  done: (date: LocalDateString) => [...taskQueryKeys.all, 'done', date] as const,
  inbox: () => [...taskQueryKeys.all, 'inbox'] as const,
};
