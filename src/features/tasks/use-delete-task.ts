import { useMutation, useQueryClient } from '@tanstack/react-query';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskApi.delete(taskId),
    onSuccess: (_result, taskId) => {
      queryClient.removeQueries({ queryKey: taskQueryKeys.detail(taskId) });
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.all });
    },
  });
}
