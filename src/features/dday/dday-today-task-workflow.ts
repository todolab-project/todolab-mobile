import { taskApi } from '@/features/tasks';
import type { LocalDateString, TaskResponse } from '@/types';

export type CreateDdayTodayTaskVariables = {
  goalId: number;
  title: string;
  date: LocalDateString;
};

export async function createDdayTodayTask({ goalId, title, date }: CreateDdayTodayTaskVariables) {
  let createdTask: TaskResponse | null = null;

  try {
    createdTask = await taskApi.create({
      title,
      description: null,
      category: null,
      type: 'TODO',
      allDay: false,
      startAt: null,
      endAt: null,
    });
    await taskApi.connectDdayGoal(createdTask.id, goalId);

    try {
      return await taskApi.moveToToday(createdTask.id, date);
    } catch (moveError) {
      const persistedTask = await taskApi.get(createdTask.id).catch(() => null);
      const moveWasApplied =
        persistedTask?.status === 'TODAY' &&
        persistedTask.plannedDate === date &&
        persistedTask.ddayGoalId === goalId;

      if (moveWasApplied) {
        return persistedTask;
      }

      throw moveError;
    }
  } catch (error) {
    if (createdTask) {
      await taskApi.delete(createdTask.id).catch(() => undefined);
    }

    throw error;
  }
}
