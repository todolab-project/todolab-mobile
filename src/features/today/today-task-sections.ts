import type { TaskResponse } from '@/types';

export function splitTodayTasks(tasks: TaskResponse[]) {
  return {
    scheduleTasks: tasks.filter((task) => task.type === 'SCHEDULE'),
    executionTasks: tasks.filter((task) => task.type !== 'SCHEDULE'),
  };
}
