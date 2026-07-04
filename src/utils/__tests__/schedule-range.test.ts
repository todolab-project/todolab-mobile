import type { TaskResponse } from '@/types';

import { doesScheduleOverlapDate } from '../schedule-range';

function createSchedule(overrides: Partial<TaskResponse> = {}): TaskResponse {
  return {
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
    ...overrides,
  };
}

describe('doesScheduleOverlapDate', () => {
  it.each(['2026-07-04', '2026-07-05', '2026-07-06'] as const)(
    '여러 날 일정이 겹치는 %s에 포함된다',
    (date) => {
      expect(doesScheduleOverlapDate(createSchedule(), date)).toBe(true);
    },
  );

  it('기간 밖 날짜에는 포함되지 않는다', () => {
    expect(doesScheduleOverlapDate(createSchedule(), '2026-07-07')).toBe(false);
  });

  it('종료 시간이 없으면 시작 날짜에만 포함된다', () => {
    const schedule = createSchedule({ endAt: null });

    expect(doesScheduleOverlapDate(schedule, '2026-07-04')).toBe(true);
    expect(doesScheduleOverlapDate(schedule, '2026-07-05')).toBe(false);
  });

  it('자정에 끝나는 일정은 종료 날짜를 점유하지 않는다', () => {
    const schedule = createSchedule({ endAt: '2026-07-06T00:00:00' });

    expect(doesScheduleOverlapDate(schedule, '2026-07-05')).toBe(true);
    expect(doesScheduleOverlapDate(schedule, '2026-07-06')).toBe(false);
  });

  it('종일 여러 날 일정은 종료 자정 전날까지 포함된다', () => {
    const schedule = createSchedule({
      allDay: true,
      startAt: '2026-07-04T00:00:00',
      endAt: '2026-07-07T00:00:00',
    });

    expect(doesScheduleOverlapDate(schedule, '2026-07-06')).toBe(true);
    expect(doesScheduleOverlapDate(schedule, '2026-07-07')).toBe(false);
  });

  it('시간이 없는 일정은 plannedDate를 사용한다', () => {
    const schedule = createSchedule({ startAt: null, endAt: null, allDay: true });

    expect(doesScheduleOverlapDate(schedule, '2026-07-04')).toBe(true);
    expect(doesScheduleOverlapDate(schedule, '2026-07-05')).toBe(false);
  });

  it('Task는 시간 범위가 있어도 일정으로 취급하지 않는다', () => {
    expect(doesScheduleOverlapDate(createSchedule({ type: 'TODO' }), '2026-07-05')).toBe(false);
  });
});
