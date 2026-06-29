export type CompletedSummary = {
  total: number;
  activeDays: number;
  message: string;
};

export function getCompletedSummary(days: { tasks: readonly unknown[] }[]): CompletedSummary {
  const total = days.reduce((sum, day) => sum + day.tasks.length, 0);
  const activeDays = days.filter((day) => day.tasks.length > 0).length;

  if (total === 0) {
    return {
      total,
      activeDays,
      message: '아직 완료 기록이 없어요. 비어 있는 주도 괜찮아요.',
    };
  }

  return {
    total,
    activeDays,
    message: `이 주에는 ${activeDays}일 동안 ${total}개의 일을 마쳤어요.`,
  };
}
