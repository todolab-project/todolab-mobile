export const ddayQueryKeys = {
  all: ['ddays'] as const,
  list: () => [...ddayQueryKeys.all, 'list'] as const,
  tasks: (goalId: number) => [...ddayQueryKeys.all, 'tasks', goalId] as const,
};
