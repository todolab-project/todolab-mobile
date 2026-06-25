import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TaskResponse, TaskUpsertRequest } from '@/types';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

type UpdateTaskVariables = {
  taskId: number;
  request: TaskUpsertRequest;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, request }: UpdateTaskVariables) => taskApi.update(taskId, request),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskResponse>(taskQueryKeys.detail(updatedTask.id), updatedTask);
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
}
