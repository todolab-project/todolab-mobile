import type { QueryClient } from '@tanstack/react-query';

import type { TaskResponse } from '@/types';

import { taskQueryKeys } from './task-query-keys';

export function updateCachedTask(queryClient: QueryClient, task: TaskResponse) {
  queryClient.setQueryData<TaskResponse>(taskQueryKeys.detail(task.id), task);
  queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.stale(), (tasks = []) =>
    tasks.map((cachedTask) => (cachedTask.id === task.id ? task : cachedTask)),
  );
}

export function cacheCreatedTask(queryClient: QueryClient, task: TaskResponse) {
  queryClient.setQueryData<TaskResponse>(taskQueryKeys.detail(task.id), task);

  if (task.status === 'INBOX') {
    queryClient.setQueryData<TaskResponse[]>(taskQueryKeys.inbox(), (tasks = []) => [
      task,
      ...tasks.filter((cachedTask) => cachedTask.id !== task.id),
    ]);
    return;
  }

  if (task.status === 'TODAY' && task.plannedDate) {
    queryClient.setQueryData<TaskResponse[]>(
      taskQueryKeys.today(task.plannedDate),
      (tasks = []) => [task, ...tasks.filter((cachedTask) => cachedTask.id !== task.id)],
    );
  }
}
