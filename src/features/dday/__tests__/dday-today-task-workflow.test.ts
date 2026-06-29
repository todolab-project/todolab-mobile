import { moveTaskToDate, taskApi } from '@/features/tasks';
import type { TaskResponse } from '@/types';

import { createDdayTodayTask } from '../dday-today-task-workflow';

jest.mock('@/features/tasks', () => ({
  moveTaskToDate: jest.fn(),
  taskApi: {
    connectDdayGoal: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

const createMock = taskApi.create as jest.Mock;
const connectMock = taskApi.connectDdayGoal as jest.Mock;
const moveMock = moveTaskToDate as jest.Mock;
const deleteMock = taskApi.delete as jest.Mock;

const createdTask = {
  id: 42,
  status: 'INBOX',
  plannedDate: null,
  ddayGoalId: null,
} as TaskResponse;

const movedTask = {
  ...createdTask,
  status: 'TODAY',
  plannedDate: '2026-06-29',
  ddayGoalId: 7,
} as TaskResponse;

describe('D-Day 목표의 Today Task 생성 workflow', () => {
  beforeEach(() => {
    createMock.mockReset().mockResolvedValue(createdTask);
    connectMock.mockReset().mockResolvedValue({ ...createdTask, ddayGoalId: 7 });
    moveMock.mockReset().mockResolvedValue(movedTask);
    deleteMock.mockReset().mockResolvedValue(null);
  });

  it('Task 생성, 목표 연결, Today 이동을 순서대로 수행한다', async () => {
    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).resolves.toEqual(movedTask);

    expect(connectMock).toHaveBeenCalledWith(42, 7);
    expect(moveMock).toHaveBeenCalledWith(42, '2026-06-29');
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('Today 이동이 실제로 실패하면 생성한 Task를 삭제한다', async () => {
    moveMock.mockRejectedValue(new Error('이동 실패'));

    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).rejects.toThrow('이동 실패');

    expect(deleteMock).toHaveBeenCalledWith(42);
  });

  it('중간 단계가 실제로 실패하면 생성한 Task를 삭제한다', async () => {
    connectMock.mockRejectedValue(new Error('연결 실패'));

    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).rejects.toThrow('연결 실패');

    expect(deleteMock).toHaveBeenCalledWith(42);
  });
});
