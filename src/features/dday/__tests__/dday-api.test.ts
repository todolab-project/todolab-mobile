import { apiClient } from '@/services/api';

import { ddayApi } from '../dday-api';

jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;

describe('D-Day API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
  });

  it('D-Day 목표 목록을 조회한다', async () => {
    await ddayApi.list();

    expect(getMock).toHaveBeenCalledWith('/api/ddays', { signal: undefined });
  });
});
