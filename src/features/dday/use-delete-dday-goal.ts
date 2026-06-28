import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { DdayGoalResponse } from '@/types';

import { ddayApi } from './dday-api';
import { ddayQueryKeys } from './dday-query-keys';

export function useDeleteDdayGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: number) => ddayApi.delete(goalId),
    onSuccess: (_result, goalId) => {
      queryClient.setQueryData<DdayGoalResponse[]>(ddayQueryKeys.list(), (goals = []) =>
        goals.filter((goal) => goal.id !== goalId),
      );
    },
  });
}
