import type { TaskResponse } from '@/types';

import { buildCalendarPeriodSegments, layoutCalendarPeriodSegments } from '../calendar-period-bars';

const schedule: TaskResponse = {
  id: 1,
  type: 'SCHEDULE',
  title: '기간 일정',
  description: null,
  startAt: '2026-07-03T09:00:00',
  endAt: '2026-07-08T18:00:00',
  allDay: false,
  unscheduled: false,
  category: null,
  status: 'TODAY',
  plannedDate: '2026-07-03',
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
  createdAt: '2026-07-03T08:00:00',
  updatedAt: null,
};

describe('buildCalendarPeriodSegments', () => {
  it('주 경계에서 이어지는 기간과 continuation을 계산한다', () => {
    const dates = [
      '2026-07-06',
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-11',
      '2026-07-12',
    ] as const;

    expect(buildCalendarPeriodSegments([schedule], [...dates])).toEqual([
      {
        task: schedule,
        startIndex: 0,
        endIndex: 2,
        continuesBefore: true,
        continuesAfter: false,
      },
    ]);
  });

  it('표시 범위와 겹치지 않는 일정은 bar를 만들지 않는다', () => {
    expect(
      buildCalendarPeriodSegments(
        [schedule],
        [
          '2026-07-13',
          '2026-07-14',
          '2026-07-15',
          '2026-07-16',
          '2026-07-17',
          '2026-07-18',
          '2026-07-19',
        ],
      ),
    ).toEqual([]);
  });
});

describe('layoutCalendarPeriodSegments', () => {
  const dates = [
    '2026-07-06',
    '2026-07-07',
    '2026-07-08',
    '2026-07-09',
    '2026-07-10',
    '2026-07-11',
    '2026-07-12',
  ] as const;

  it('겹치지 않는 기간은 같은 lane을 재사용한다', () => {
    const later = {
      ...schedule,
      id: 2,
      startAt: '2026-07-10T09:00:00',
      endAt: '2026-07-11T18:00:00',
    } satisfies TaskResponse;
    const layout = layoutCalendarPeriodSegments([schedule, later], [...dates]);

    expect(layout.segments.map(({ task, lane }) => [task.id, lane])).toEqual([
      [1, 0],
      [2, 0],
    ]);
    expect(layout.overflowCount).toBe(0);
  });

  it('두 lane을 넘는 겹침은 +N 대상으로 축약한다', () => {
    const overlapping = [1, 2, 3].map(
      (id) =>
        ({
          ...schedule,
          id,
          startAt: '2026-07-06T09:00:00',
          endAt: '2026-07-08T18:00:00',
        }) satisfies TaskResponse,
    );
    const layout = layoutCalendarPeriodSegments(overlapping, [...dates]);

    expect(layout.segments.map(({ lane }) => lane)).toEqual([0, 1]);
    expect(layout.overflowCount).toBe(1);
  });
});
