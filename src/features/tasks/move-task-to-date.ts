import type { LocalDateString } from '@/types';

import { taskApi } from './task-api';

export async function moveTaskToDate(taskId: number, date: LocalDateString) {
  try {
    return await taskApi.moveToToday(taskId, date);
  } catch (moveError) {
    const persistedTask = await taskApi.get(taskId).catch(() => null);
    const moveWasApplied = persistedTask?.status === 'TODAY' && persistedTask.plannedDate === date;

    if (moveWasApplied) {
      return persistedTask;
    }

    throw moveError;
  }
}
