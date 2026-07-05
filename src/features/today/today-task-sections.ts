import type { TaskResponse } from '@/types';

export const TODAY_SCHEDULE_PREVIEW_COUNT = 2;

export function splitTodayTasks(tasks: TaskResponse[]) {
  const scheduleIds = new Set<number>();

  return {
    scheduleTasks: tasks.filter((task) => {
      if (task.type !== 'SCHEDULE' || scheduleIds.has(task.id)) {
        return false;
      }

      scheduleIds.add(task.id);
      return true;
    }),
    executionTasks: tasks.filter((task) => task.type !== 'SCHEDULE'),
  };
}

export function getTodaySchedulePreview(tasks: TaskResponse[]) {
  return tasks.slice(0, TODAY_SCHEDULE_PREVIEW_COUNT);
}
