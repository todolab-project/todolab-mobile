import { taskQueryKeys } from '@/features/tasks';
import type { LocalDateString } from '@/types';

export function getCalendarDayQueryKeys(date: LocalDateString) {
  return {
    scheduled: taskQueryKeys.today(date),
    done: taskQueryKeys.done(date),
  };
}
