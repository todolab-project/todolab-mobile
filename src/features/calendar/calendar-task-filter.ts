import type { TaskResponse } from '@/types';

export type CalendarTaskFilter = 'schedule' | 'done' | 'deferred' | 'dday';

export const calendarTaskFilterLabels: Record<CalendarTaskFilter, string> = {
  schedule: '일정',
  done: '완료',
  deferred: '미룸',
  dday: 'D-Day',
};

export function matchesCalendarTaskFilter(task: TaskResponse, filter: CalendarTaskFilter) {
  switch (filter) {
    case 'schedule':
      return task.type === 'SCHEDULE';
    case 'done':
      return task.status === 'DONE';
    case 'deferred':
      return task.deferReason !== null || task.carryOverCount > 0 || task.staleCarryOver;
    case 'dday':
      return task.ddayGoalId !== null;
  }
}

export function filterCalendarTasks(tasks: TaskResponse[], activeFilters: CalendarTaskFilter[]) {
  if (activeFilters.length === 0) {
    return tasks;
  }

  return tasks.filter((task) =>
    activeFilters.some((filter) => matchesCalendarTaskFilter(task, filter)),
  );
}

export function countCalendarTaskFilters(tasks: TaskResponse[]) {
  return (Object.keys(calendarTaskFilterLabels) as CalendarTaskFilter[]).reduce(
    (counts, filter) => ({
      ...counts,
      [filter]: tasks.filter((task) => matchesCalendarTaskFilter(task, filter)).length,
    }),
    {} as Record<CalendarTaskFilter, number>,
  );
}
