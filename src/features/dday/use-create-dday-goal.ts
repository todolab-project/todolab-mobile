import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { DdayGoalRequest, DdayGoalResponse } from '@/types';

import { ddayApi } from './dday-api';
import { ddayQueryKeys } from './dday-query-keys';

export function useCreateDdayGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DdayGoalRequest) => ddayApi.create(request),
    onSuccess: (createdGoal) => {
      queryClient.setQueryData<DdayGoalResponse[]>(ddayQueryKeys.list(), (goals = []) => [
        ...goals.filter((goal) => goal.id !== createdGoal.id),
        createdGoal,
      ]);
    },
  });
}
