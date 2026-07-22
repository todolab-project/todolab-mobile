import { apiClient } from '@/services/api';
import type {
  DdayGoalDeleteResponse,
  DdayGoalRequest,
  DdayGoalResponse,
  DdayGoalTaskRequest,
  TaskResponse,
} from '@/types';

const DDAYS_PATH = '/api/v1/dday-goals';

export const ddayApi = {
  list(signal?: AbortSignal) {
    return apiClient.get<DdayGoalResponse[]>(DDAYS_PATH, { signal });
  },

  create(request: DdayGoalRequest, signal?: AbortSignal) {
    return apiClient.post<DdayGoalResponse>(DDAYS_PATH, request, { signal });
  },

  get(goalId: number, signal?: AbortSignal) {
    return apiClient.get<DdayGoalResponse>(`${DDAYS_PATH}/${goalId}`, { signal });
  },

  delete(goalId: number, signal?: AbortSignal) {
    return apiClient.delete<DdayGoalDeleteResponse>(`${DDAYS_PATH}/${goalId}`, { signal });
  },

  getTasks(goalId: number, signal?: AbortSignal) {
    return apiClient.get<TaskResponse[]>(`${DDAYS_PATH}/${goalId}/tasks`, { signal });
  },

  createTask(goalId: number, request: DdayGoalTaskRequest, signal?: AbortSignal) {
    return apiClient.post<TaskResponse>(`${DDAYS_PATH}/${goalId}/tasks`, request, { signal });
  },
};
