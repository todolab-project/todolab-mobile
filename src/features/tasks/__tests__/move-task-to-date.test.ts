import type { TaskResponse } from '@/types';

import { moveTaskToDate } from '../move-task-to-date';
import { taskApi } from '../task-api';

jest.mock('../task-api', () => ({
  taskApi: {
    get: jest.fn(),
    moveToToday: jest.fn(),
  },
}));

const moveMock = taskApi.moveToToday as jest.Mock;
const getMock = taskApi.get as jest.Mock;
const movedTask = {
  id: 42,
  status: 'TODAY',
  plannedDate: '2026-06-29',
} as TaskResponse;

describe('moveTaskToDate', () => {
  beforeEach(() => {
    moveMock.mockReset();
    getMock.mockReset();
  });

  test('정상 이동 응답을 반환한다', async () => {
    moveMock.mockResolvedValue(movedTask);

    await expect(moveTaskToDate(42, '2026-06-29')).resolves.toBe(movedTask);
    expect(getMock).not.toHaveBeenCalled();
  });

  test('오류 응답 뒤 실제 이동이 적용됐으면 성공으로 복구한다', async () => {
    moveMock.mockRejectedValue(new Error('500'));
    getMock.mockResolvedValue(movedTask);

    await expect(moveTaskToDate(42, '2026-06-29')).resolves.toBe(movedTask);
  });

  test('실제 이동도 적용되지 않았으면 원래 오류를 전달한다', async () => {
    const error = new Error('500');
    moveMock.mockRejectedValue(error);
    getMock.mockResolvedValue({ ...movedTask, status: 'INBOX', plannedDate: null });

    await expect(moveTaskToDate(42, '2026-06-29')).rejects.toBe(error);
  });
});
