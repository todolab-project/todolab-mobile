import { taskApi } from '@/features/tasks/task-api';
import { apiClient } from '@/services/api';

jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;

describe('Task API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
  });

  test('Today 조회에 서울 기준 날짜를 전달한다', async () => {
    await taskApi.getToday('2026-06-24');

    expect(getMock).toHaveBeenCalledWith('/api/tasks/today', {
      query: { date: '2026-06-24' },
      signal: undefined,
    });
  });

  test('완료 조회에 날짜를 전달한다', async () => {
    await taskApi.getDone('2026-06-24');

    expect(getMock).toHaveBeenCalledWith('/api/tasks/done', {
      query: { date: '2026-06-24' },
      signal: undefined,
    });
  });

  test('기록함을 별도 query 없이 조회한다', async () => {
    await taskApi.getInbox();

    expect(getMock).toHaveBeenCalledWith('/api/tasks/inbox', { signal: undefined });
  });
});
