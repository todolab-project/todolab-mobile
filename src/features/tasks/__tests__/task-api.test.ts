import { taskApi } from '@/features/tasks/task-api';
import { apiClient } from '@/services/api';

jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;
const patchMock = apiClient.patch as jest.Mock;
const postMock = apiClient.post as jest.Mock;

describe('Task API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
    patchMock.mockReset();
    patchMock.mockResolvedValue({ id: 1 });
    postMock.mockReset();
    postMock.mockResolvedValue({ id: 1 });
  });

  test('제목 중심의 Task를 생성한다', async () => {
    const request = {
      title: '병원 예약',
      type: 'TODO' as const,
      allDay: false,
    };

    await taskApi.create(request);

    expect(postMock).toHaveBeenCalledWith('/api/tasks', request, { signal: undefined });
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

  test('Task 완료 endpoint를 호출한다', async () => {
    await taskApi.complete(42);

    expect(patchMock).toHaveBeenCalledWith('/api/tasks/42/done', undefined, {
      signal: undefined,
    });
  });
});
