import { apiClient } from '@/services/api';
import type { DdayGoalRequest, DdayGoalResponse } from '@/types';

const DDAYS_PATH = '/api/ddays';

export const ddayApi = {
  list(signal?: AbortSignal) {
    return apiClient.get<DdayGoalResponse[]>(DDAYS_PATH, { signal });
  },

  create(request: DdayGoalRequest, signal?: AbortSignal) {
    return apiClient.post<DdayGoalResponse>(DDAYS_PATH, request, { signal });
  },
};
