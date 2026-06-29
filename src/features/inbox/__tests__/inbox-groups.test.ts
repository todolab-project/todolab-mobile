import type { TaskResponse } from '@/types';

import { groupInboxTasks, uncategorizedInboxLabel } from '../inbox-groups';

function makeTask(id: number, category: string | null): TaskResponse {
  return {
    id,
    type: 'TODO',
    title: `Task ${id}`,
    description: null,
    startAt: null,
    endAt: null,
    allDay: false,
    unscheduled: true,
    category,
    status: 'INBOX',
    plannedDate: null,
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
    createdAt: '2026-06-29T10:00:00',
    updatedAt: null,
  };
}

describe('groupInboxTasks', () => {
  test('같은 카테고리의 기록을 한 그룹으로 모은다', () => {
    const groups = groupInboxTasks([makeTask(1, '업무'), makeTask(2, '개인'), makeTask(3, '업무')]);

    expect(groups.map((group) => [group.category, group.tasks.map((task) => task.id)])).toEqual([
      ['개인', [2]],
      ['업무', [1, 3]],
    ]);
  });

  test('빈 카테고리는 별도 그룹으로 마지막에 둔다', () => {
    const groups = groupInboxTasks([makeTask(1, null), makeTask(2, '  '), makeTask(3, '업무')]);

    expect(groups.map((group) => [group.category, group.tasks.length])).toEqual([
      ['업무', 1],
      [uncategorizedInboxLabel, 2],
    ]);
  });
});
