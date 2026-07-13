import type { LocalDateString, TaskResponse } from '@/types';

import { ddayApi } from './dday-api';

export type CreateDdayTodayTaskVariables = {
  goalId: number;
  title: string;
  date: LocalDateString;
};

export async function createDdayTodayTask({ goalId, title, date }: CreateDdayTodayTaskVariables) {
  return ddayApi.createTask(goalId, { title, date });
}
