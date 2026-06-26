import { apiClient } from '@/services/api';
import type { LocalDateString, TaskResponse, TaskUpsertRequest } from '@/types';

const TASKS_PATH = '/api/tasks';

export const taskApi = {
  get(taskId: number, signal?: AbortSignal) {
    return apiClient.get<TaskResponse>(`${TASKS_PATH}/${taskId}`, { signal });
  },

  create(request: TaskUpsertRequest, signal?: AbortSignal) {
    return apiClient.post<TaskResponse>(TASKS_PATH, request, { signal });
  },

  update(taskId: number, request: TaskUpsertRequest, signal?: AbortSignal) {
    return apiClient.put<TaskResponse>(`${TASKS_PATH}/${taskId}`, request, { signal });
  },

  delete(taskId: number, signal?: AbortSignal) {
    return apiClient.delete<null>(`${TASKS_PATH}/${taskId}`, { signal });
  },

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

  complete(taskId: number, signal?: AbortSignal) {
    return apiClient.patch<TaskResponse>(`${TASKS_PATH}/${taskId}/done`, undefined, {
      signal,
    });
  },

  moveToToday(taskId: number, date: LocalDateString, signal?: AbortSignal) {
    return apiClient.patch<TaskResponse>(`${TASKS_PATH}/${taskId}/today`, undefined, {
      query: { date },
      signal,
    });
  },

  reopenToday(taskId: number, date: LocalDateString, signal?: AbortSignal) {
    return apiClient.patch<TaskResponse>(`${TASKS_PATH}/${taskId}/done/cancel`, undefined, {
      query: { date },
      signal,
    });
  },
};
