import { useMutation, useQueryClient } from '@tanstack/react-query';

import { taskQueryKeys } from '@/features/tasks';
import type { TaskResponse } from '@/types';

import { ddayQueryKeys } from './dday-query-keys';
import { createDdayTodayTask, type CreateDdayTodayTaskVariables } from './dday-today-task-workflow';

export function useCreateDdayTodayTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateDdayTodayTaskVariables) => createDdayTodayTask(variables),
    onSuccess: (createdTask, { goalId, date }) => {
      queryClient.setQueryData<TaskResponse[]>(ddayQueryKeys.tasks(goalId), (tasks = []) => [
        ...tasks.filter((task) => task.id !== createdTask.id),
        createdTask,
      ]);
      queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.today(date), (tasks = []) => [
        ...tasks.filter((task) => task.id !== createdTask.id),
        createdTask,
      ]);
      queryClient.setQueryData<TaskResponse>(taskQueryKeys.detail(createdTask.id), createdTask);
    },
  });
}
