import { apiClient } from '@/services/api';

import { ddayApi } from '../dday-api';

jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;
const postMock = apiClient.post as jest.Mock;

describe('D-Day API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
    postMock.mockReset();
    postMock.mockResolvedValue({ id: 1 });
  });

  it('D-Day 목표 목록을 조회한다', async () => {
    await ddayApi.list();

    expect(getMock).toHaveBeenCalledWith('/api/ddays', { signal: undefined });
  });

  it('D-Day 목표를 생성한다', async () => {
    const request = { title: '앱 출시', targetDate: '2026-12-31' as const };

    await ddayApi.create(request);

    expect(postMock).toHaveBeenCalledWith('/api/ddays', request, { signal: undefined });
  });
});
