import type { TaskResponse } from '@/types';

import { ddayApi } from '../dday-api';
import { createDdayTodayTask } from '../dday-today-task-workflow';

jest.mock('../dday-api', () => ({
  ddayApi: {
    createTask: jest.fn(),
  },
}));

const createTaskMock = ddayApi.createTask as jest.Mock;

const createdTask = {
  id: 42,
  status: 'TODAY',
  plannedDate: '2026-06-29',
  ddayGoalId: 7,
} as TaskResponse;

describe('D-Day 목표의 Today Task 생성 workflow', () => {
  beforeEach(() => {
    createTaskMock.mockReset().mockResolvedValue(createdTask);
  });

  it('백엔드 트랜잭션 API로 목표 기반 Today Task를 생성한다', async () => {
    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).resolves.toEqual(createdTask);

    expect(createTaskMock).toHaveBeenCalledWith(7, {
      title: '출시 체크',
      date: '2026-06-29',
    });
  });

  it('백엔드 생성 실패를 그대로 전달한다', async () => {
    createTaskMock.mockRejectedValue(new Error('생성 실패'));

    await expect(
      createDdayTodayTask({ goalId: 7, title: '출시 체크', date: '2026-06-29' }),
    ).rejects.toThrow('생성 실패');
  });
});
