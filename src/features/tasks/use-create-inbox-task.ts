import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { TaskResponse, TaskUpsertRequest } from '@/types';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

export function useCreateInboxTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TaskUpsertRequest) => taskApi.create(request),
    onSuccess: (createdTask) => {
      queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.inbox(), (tasks = []) => [
        createdTask,
        ...tasks.filter((task) => task.id !== createdTask.id),
      ]);
    },
  });
}
