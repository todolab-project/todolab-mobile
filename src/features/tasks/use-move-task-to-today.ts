import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { LocalDateString, TaskRecommendationResponse, TaskResponse } from '@/types';

import { taskApi } from './task-api';
import { taskQueryKeys } from './task-query-keys';

export function useMoveTaskToToday(date: LocalDateString) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: number) => taskApi.moveToToday(taskId, date),
    onSuccess: (movedTask) => {
      queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.inbox(), (tasks = []) =>
        tasks.filter((task) => task.id !== movedTask.id),
      );
      queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.stale(), (tasks = []) =>
        tasks.filter((task) => task.id !== movedTask.id),
      );
      queryClient.setQueryData<TaskRecommendationResponse[]>(
        taskQueryKeys.todayRecommendations(date),
        (recommendations = []) =>
          recommendations.filter((recommendation) => recommendation.task.id !== movedTask.id),
      );
      queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.today(date), (tasks = []) => [
        ...tasks.filter((task) => task.id !== movedTask.id),
        movedTask,
      ]);
    },
  });
}
