import { taskApi } from '@/features/tasks';
import type { TaskResponse } from '@/types';

import { createDdayTodayTask } from '../dday-today-task-workflow';

jest.mock('@/features/tasks', () => ({
  taskApi: {
    connectDdayGoal: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    moveToToday: jest.fn(),
  },
}));

const createMock = taskApi.create as jest.Mock;
const connectMock = taskApi.connectDdayGoal as jest.Mock;
const moveMock = taskApi.moveToToday as jest.Mock;
const getMock = taskApi.get as jest.Mock;
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
    getMock.mockReset().mockResolvedValue(movedTask);
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

  it('Today 이동 응답이 실패해도 실제 반영됐으면 성공으로 복구한다', async () => {
    moveMock.mockRejectedValue(new Error('서버 응답 오류'));

    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).resolves.toEqual(movedTask);

    expect(getMock).toHaveBeenCalledWith(42);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('중간 단계가 실제로 실패하면 생성한 Task를 삭제한다', async () => {
    connectMock.mockRejectedValue(new Error('연결 실패'));

    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).rejects.toThrow('연결 실패');

    expect(deleteMock).toHaveBeenCalledWith(42);
  });
});
