import type { LocalDateString, TaskResponse } from '@/types';

import { shiftLocalDate } from './date-time';

export function doesScheduleOverlapDate(task: TaskResponse, date: LocalDateString) {
  if (task.type !== 'SCHEDULE') {
    return false;
  }

  if (!task.startAt) {
    return task.plannedDate === date;
  }

  const nextDate = shiftLocalDate(date, 1);

  if (!nextDate) {
    return false;
  }

  const dayStart = `${date}T00:00:00`;
  const nextDayStart = `${nextDate}T00:00:00`;
  const endAt = task.endAt ?? task.startAt;

  return task.startAt < nextDayStart && endAt >= dayStart;
}
