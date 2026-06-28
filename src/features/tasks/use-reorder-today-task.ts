import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { LocalDateString, TaskResponse, TodayOrderDirection } from '@/types';
import { reorderTodayTasks } from '@/features/today/today-task-sections';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

type ReorderTodayVariables = {
  taskId: number;
  direction: TodayOrderDirection;
};

export function useReorderTodayTask(date: LocalDateString) {
  const queryClient = useQueryClient();
  const queryKey = taskQueryKeys.today(date);

  return useMutation({
    mutationFn: ({ taskId, direction }: ReorderTodayVariables) =>
      taskApi.reorderToday(taskId, date, direction),
    onMutate: async ({ taskId, direction }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<TaskResponse[]>(queryKey);

      queryClient.setQueryData<TaskResponse[]>(queryKey, (tasks = []) =>
        reorderTodayTasks(tasks, taskId, direction),
      );

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKey, context.previousTasks);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });
}
