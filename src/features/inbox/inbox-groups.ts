import type { TaskResponse } from '@/types';

export const uncategorizedInboxLabel = '카테고리 없음';

export type InboxTaskGroup = {
  category: string;
  tasks: TaskResponse[];
};

export function groupInboxTasks(tasks: TaskResponse[]): InboxTaskGroup[] {
  const groups = new Map<string, TaskResponse[]>();

  tasks.forEach((task) => {
    const category = task.category?.trim() || uncategorizedInboxLabel;
    const categoryTasks = groups.get(category) ?? [];
    categoryTasks.push(task);
    groups.set(category, categoryTasks);
  });

  return [...groups.entries()]
    .sort(([left], [right]) => {
      if (left === uncategorizedInboxLabel) return 1;
      if (right === uncategorizedInboxLabel) return -1;
      return left.localeCompare(right, 'ko');
    })
    .map(([category, categoryTasks]) => ({ category, tasks: categoryTasks }));
}
