import type { TaskResponse } from '@/types';

export const RECOMMENDED_TODAY_TASK_COUNT = 5;
export const TODAY_SCHEDULE_PREVIEW_COUNT = 2;

export function splitTodayTasks(tasks: TaskResponse[]) {
  const scheduleIds = new Set<number>();

  return {
    scheduleTasks: tasks.filter((task) => {
      if (task.type !== 'SCHEDULE' || scheduleIds.has(task.id)) {
        return false;
      }

      scheduleIds.add(task.id);
      return true;
    }),
    executionTasks: tasks.filter((task) => task.type !== 'SCHEDULE'),
  };
}

export function getTodaySchedulePreview(tasks: TaskResponse[]) {
  return tasks.slice(0, TODAY_SCHEDULE_PREVIEW_COUNT);
}

export function getTodayLoadGuidance(executionTaskCount: number, scheduleTaskCount: number) {
  const excessCount = executionTaskCount - RECOMMENDED_TODAY_TASK_COUNT;

  if (excessCount <= 0) {
    return null;
  }

  return {
    excessCount,
    title: `오늘 실행할 일이 ${executionTaskCount}개예요`,
    description:
      `권장 개수보다 ${excessCount}개 많아요. 꼭 끝낼 일 ${RECOMMENDED_TODAY_TASK_COUNT}개만 먼저 남겨보세요.` +
      (scheduleTaskCount > 0 ? ` 시간 일정 ${scheduleTaskCount}개는 이 개수에서 제외했어요.` : ''),
  };
}
