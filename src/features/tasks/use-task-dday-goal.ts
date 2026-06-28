import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ddayQueryKeys } from '@/features/dday';
import type { TaskResponse } from '@/types';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

type TaskDdayGoalVariables = {
  taskId: number;
  ddayGoalId: number | null;
};

export function useTaskDdayGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, ddayGoalId }: TaskDdayGoalVariables) =>
      ddayGoalId === null
        ? taskApi.disconnectDdayGoal(taskId)
        : taskApi.connectDdayGoal(taskId, ddayGoalId),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskResponse>(taskQueryKeys.detail(updatedTask.id), updatedTask);
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: ddayQueryKeys.all });
    },
  });
}
