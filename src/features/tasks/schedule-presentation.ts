import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel, formatTimeLabel } from '@/utils';

export type SchedulePresentation = {
  primaryLabel: string;
  rangeLabel: string | null;
};

export function getSchedulePresentation(
  task: TaskResponse,
  referenceDate: LocalDateString,
): SchedulePresentation {
  if (!task.startAt) {
    return { primaryLabel: '종일', rangeLabel: null };
  }

  const startDate = task.startAt.slice(0, 10) as LocalDateString;
  const endDate = (task.endAt?.slice(0, 10) ?? startDate) as LocalDateString;
  const isMultiDay = startDate !== endDate;

  if (!isMultiDay) {
    if (task.allDay) {
      return { primaryLabel: '종일', rangeLabel: null };
    }

    const start = formatTimeLabel(task.startAt);
    return {
      primaryLabel: task.endAt ? `${start}–${formatTimeLabel(task.endAt)}` : start,
      rangeLabel: null,
    };
  }

  let status = '기간 일정';

  if (referenceDate === startDate) {
    status = '오늘 시작';
  } else if (referenceDate === endDate) {
    status = '오늘 종료';
  } else if (referenceDate > startDate && referenceDate < endDate) {
    status = '진행 중';
  }

  return {
    primaryLabel: status,
    rangeLabel: `${formatDateLabel(startDate, {
      month: 'long',
      day: 'numeric',
    })}–${formatDateLabel(endDate, {
      month: 'long',
      day: 'numeric',
    })}`,
  };
}
