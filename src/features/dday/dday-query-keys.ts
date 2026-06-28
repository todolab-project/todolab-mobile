export const ddayQueryKeys = {
  all: ['ddays'] as const,
  list: () => [...ddayQueryKeys.all, 'list'] as const,
};
