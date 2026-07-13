import { apiClient } from '@/services/api';

import { ddayApi } from '../dday-api';

jest.mock('@/services/api', () => ({
  apiClient: {
    delete: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;
const postMock = apiClient.post as jest.Mock;
const deleteMock = apiClient.delete as jest.Mock;

describe('D-Day API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
    postMock.mockReset();
    postMock.mockResolvedValue({ id: 1 });
    deleteMock.mockReset();
    deleteMock.mockResolvedValue(null);
  });

  it('D-Day 목표 목록을 조회한다', async () => {
    await ddayApi.list();

    expect(getMock).toHaveBeenCalledWith('/api/v1/dday-goals', { signal: undefined });
  });

  it('D-Day 목표를 생성한다', async () => {
    const request = { title: '앱 출시', targetDate: '2026-12-31' as const };

    await ddayApi.create(request);

    expect(postMock).toHaveBeenCalledWith('/api/v1/dday-goals', request, { signal: undefined });
  });

  it('D-Day 목표를 단건 조회한다', async () => {
    await ddayApi.get(42);

    expect(getMock).toHaveBeenCalledWith('/api/v1/dday-goals/42', { signal: undefined });
  });

  it('D-Day 목표를 삭제한다', async () => {
    await ddayApi.delete(42);

    expect(deleteMock).toHaveBeenCalledWith('/api/v1/dday-goals/42', { signal: undefined });
  });

  it('D-Day 목표에 연결된 Task 목록을 조회한다', async () => {
    await ddayApi.getTasks(42);

    expect(getMock).toHaveBeenCalledWith('/api/v1/dday-goals/42/tasks', { signal: undefined });
  });

  it('D-Day 목표 기반 Today Task를 생성한다', async () => {
    const request = { title: '출시 체크', date: '2026-06-29' as const };

    await ddayApi.createTask(42, request);

    expect(postMock).toHaveBeenCalledWith('/api/v1/dday-goals/42/tasks', request, {
      signal: undefined,
    });
  });
});
