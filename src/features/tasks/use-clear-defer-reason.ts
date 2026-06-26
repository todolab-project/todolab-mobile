import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateCachedTask } from './task-cache';
import { taskApi } from './task-api';

export function useClearDeferReason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskApi.clearDeferReason(taskId),
    onSuccess: (updatedTask) => {
      updateCachedTask(queryClient, updatedTask);
    },
  });
}
