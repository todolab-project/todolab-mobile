import type { TaskResponse } from '@/types';

import { getSchedulePresentation } from '../schedule-presentation';

const schedule: TaskResponse = {
  id: 1,
  type: 'SCHEDULE',
  title: '기간 일정',
  description: null,
  startAt: '2026-07-04T09:00:00',
  endAt: '2026-07-06T18:00:00',
  allDay: false,
  unscheduled: false,
  category: null,
  status: 'TODAY',
  plannedDate: '2026-07-04',
  targetDate: null,
  todayOrder: null,
  completedAt: null,
  carryOverCount: 0,
  staleCarryOver: false,
  deferReason: null,
  deferReasonLabel: null,
  ddayGoalId: null,
  ddayGoalTitle: null,
  ddayGoalTargetDate: null,
  ddayDaysLeft: null,
  createdAt: '2026-07-04T08:00:00',
  updatedAt: null,
};

describe('getSchedulePresentation', () => {
  it.each([
    ['2026-07-04', '오늘 시작'],
    ['2026-07-05', '진행 중'],
    ['2026-07-06', '오늘 종료'],
  ] as const)('%s 기준 여러 날 일정 상태를 표시한다', (date, expected) => {
    expect(getSchedulePresentation(schedule, date)).toEqual({
      primaryLabel: expected,
      rangeLabel: '7월 4일–7월 6일',
    });
  });

  it('하루 일정은 기존 시간 범위를 유지한다', () => {
    expect(
      getSchedulePresentation(
        {
          ...schedule,
          startAt: '2026-07-05T14:00:00',
          endAt: '2026-07-05T14:30:00',
        },
        '2026-07-05',
      ),
    ).toEqual({
      primaryLabel: '14:00–14:30',
      rangeLabel: null,
    });
  });
});
