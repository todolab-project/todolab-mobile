import { apiClient } from '@/services/api';
import type { LocalDateString, TaskResponse } from '@/types';

const TASKS_PATH = '/api/tasks';

export const taskApi = {
  getToday(date: LocalDateString, signal?: AbortSignal) {
    return apiClient.get<TaskResponse[]>(`${TASKS_PATH}/today`, {
      query: { date },
      signal,
    });
  },

  getDone(date: LocalDateString, signal?: AbortSignal) {
    return apiClient.get<TaskResponse[]>(`${TASKS_PATH}/done`, {
      query: { date },
      signal,
    });
  },

  getInbox(signal?: AbortSignal) {
    return apiClient.get<TaskResponse[]>(`${TASKS_PATH}/inbox`, { signal });
  },
};
