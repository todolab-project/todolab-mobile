import { QueryClient } from '@tanstack/react-query';

import type { TaskResponse } from '@/types';

import { cacheCreatedTask } from '../task-cache';
import { taskQueryKeys } from '../task-query-keys';

function createTask(overrides: Partial<TaskResponse>): TaskResponse {
  return {
    id: 1,
    type: 'TODO',
    title: '새 Task',
    description: null,
    startAt: null,
    endAt: null,
    allDay: false,
    unscheduled: true,
    category: null,
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
    createdAt: '2026-07-27T09:00:00',
    updatedAt: null,
    ...overrides,
  };
}

describe('cacheCreatedTask', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  it('INBOX Task는 detail과 기록함 cache에 반영한다', () => {
    const task = createTask({ id: 10, status: 'INBOX' });

    cacheCreatedTask(queryClient, task);

    expect(queryClient.getQueryData(taskQueryKeys.detail(task.id))).toEqual(task);
    expect(queryClient.getQueryData(taskQueryKeys.inbox())).toEqual([task]);
  });

  it('TODAY 일정은 기록함이 아니라 해당 날짜 Today cache에 반영한다', () => {
    const task = createTask({
      id: 11,
      type: 'SCHEDULE',
      status: 'TODAY',
      unscheduled: false,
      plannedDate: '2026-07-27',
      targetDate: '2026-07-27',
      startAt: '2026-07-27T14:00:00',
      endAt: '2026-07-27T14:30:00',
    });

    cacheCreatedTask(queryClient, task);

    expect(queryClient.getQueryData(taskQueryKeys.detail(task.id))).toEqual(task);
    expect(queryClient.getQueryData(taskQueryKeys.inbox())).toBeUndefined();
    expect(queryClient.getQueryData(taskQueryKeys.today('2026-07-27'))).toEqual([task]);
  });
});
