import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { DeferReason } from '@/types';

import { updateCachedTask } from './task-cache';
import { taskApi } from './task-api';

type SetDeferReasonVariables = {
  taskId: number;
  reason: DeferReason;
};

export function useSetDeferReason() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, reason }: SetDeferReasonVariables) =>
      taskApi.setDeferReason(taskId, reason),
    onSuccess: (updatedTask) => {
      updateCachedTask(queryClient, updatedTask);
    },
  });
}
