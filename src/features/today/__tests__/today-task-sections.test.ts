import type { TaskResponse, TaskType } from '@/types';

import { splitTodayTasks } from '../today-task-sections';

function createTask(id: number, type: TaskType): TaskResponse {
  return {
    id,
    type,
    title: `Task ${id}`,
    description: null,
    startAt: null,
    endAt: null,
    allDay: false,
    unscheduled: false,
    category: null,
    status: 'TODAY',
    plannedDate: '2026-06-28',
    targetDate: null,
    todayOrder: id,
    completedAt: null,
    carryOverCount: 0,
    staleCarryOver: false,
    deferReason: null,
    deferReasonLabel: null,
    ddayGoalId: null,
    ddayGoalTitle: null,
    ddayGoalTargetDate: null,
    ddayDaysLeft: null,
    createdAt: '2026-06-28T09:00:00',
    updatedAt: null,
  };
}

describe('splitTodayTasks', () => {
  it('일정과 실행 항목을 원래 순서를 유지해 분리한다', () => {
    const schedule = createTask(1, 'SCHEDULE');
    const todo = createTask(2, 'TODO');
    const idea = createTask(3, 'IDEA');

    expect(splitTodayTasks([schedule, todo, idea])).toEqual({
      scheduleTasks: [schedule],
      executionTasks: [todo, idea],
    });
  });
});
