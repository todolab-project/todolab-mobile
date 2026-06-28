import type { TaskResponse } from '@/types';

import {
  countCalendarTaskFilters,
  filterCalendarTasks,
  matchesCalendarTaskFilter,
} from '../calendar-task-filter';

const baseTask: TaskResponse = {
  id: 1,
  type: 'TODO',
  title: '기본 Task',
  description: null,
  startAt: null,
  endAt: null,
  allDay: false,
  unscheduled: false,
  category: null,
  status: 'TODAY',
  plannedDate: '2026-06-29',
  targetDate: '2026-06-29',
  todayOrder: 0,
  completedAt: null,
  carryOverCount: 0,
  staleCarryOver: false,
  deferReason: null,
  deferReasonLabel: null,
  ddayGoalId: null,
  ddayGoalTitle: null,
  ddayGoalTargetDate: null,
  ddayDaysLeft: null,
  createdAt: '2026-06-29T09:00:00',
  updatedAt: null,
};

function makeTask(id: number, overrides: Partial<TaskResponse>): TaskResponse {
  return { ...baseTask, id, ...overrides };
}

describe('Calendar Task 필터', () => {
  const tasks = [
    makeTask(1, { type: 'SCHEDULE' }),
    makeTask(2, { status: 'DONE', completedAt: '2026-06-29T10:00:00' }),
    makeTask(3, { deferReason: 'TOO_BIG', deferReasonLabel: '너무 큼' }),
    makeTask(4, { carryOverCount: 2 }),
    makeTask(5, { ddayGoalId: 7, ddayGoalTitle: '출시' }),
    makeTask(6, {}),
  ];

  it('일정, 완료, 미룸, D-Day 상태를 각각 판별한다', () => {
    expect(matchesCalendarTaskFilter(tasks[0], 'schedule')).toBe(true);
    expect(matchesCalendarTaskFilter(tasks[1], 'done')).toBe(true);
    expect(matchesCalendarTaskFilter(tasks[2], 'deferred')).toBe(true);
    expect(matchesCalendarTaskFilter(tasks[3], 'deferred')).toBe(true);
    expect(matchesCalendarTaskFilter(tasks[4], 'dday')).toBe(true);
  });

  it('필터가 없으면 전체를 유지하고 여러 필터는 OR로 적용한다', () => {
    expect(filterCalendarTasks(tasks, [])).toEqual(tasks);
    expect(filterCalendarTasks(tasks, ['schedule', 'dday']).map((task) => task.id)).toEqual([1, 5]);
  });

  it('필터별 항목 수를 계산한다', () => {
    expect(countCalendarTaskFilters(tasks)).toEqual({
      schedule: 1,
      done: 1,
      deferred: 2,
      dday: 1,
    });
  });
});
