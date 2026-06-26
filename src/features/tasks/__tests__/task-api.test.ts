import { taskApi } from '@/features/tasks/task-api';
import { apiClient } from '@/services/api';

jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

const getMock = apiClient.get as jest.Mock;
const deleteMock = apiClient.delete as jest.Mock;
const patchMock = apiClient.patch as jest.Mock;
const postMock = apiClient.post as jest.Mock;
const putMock = apiClient.put as jest.Mock;

describe('Task API', () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue([]);
    deleteMock.mockReset();
    deleteMock.mockResolvedValue(null);
    patchMock.mockReset();
    patchMock.mockResolvedValue({ id: 1 });
    postMock.mockReset();
    postMock.mockResolvedValue({ id: 1 });
    putMock.mockReset();
    putMock.mockResolvedValue({ id: 1 });
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

  test('Task 상세를 id로 조회한다', async () => {
    await taskApi.get(42);

    expect(getMock).toHaveBeenCalledWith('/api/tasks/42', { signal: undefined });
  });

  test('Task를 수정한다', async () => {
    const request = {
      title: '운동 기록 정리',
      description: '러닝 기록 캡처 업로드',
      category: '건강',
      type: 'TODO' as const,
      allDay: true,
      startAt: null,
      endAt: null,
    };

    await taskApi.update(42, request);

    expect(putMock).toHaveBeenCalledWith('/api/tasks/42', request, { signal: undefined });
  });

  test('Task를 삭제한다', async () => {
    await taskApi.delete(42);

    expect(deleteMock).toHaveBeenCalledWith('/api/tasks/42', { signal: undefined });
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

  test('지난 미완료 항목을 조회한다', async () => {
    await taskApi.getStale();

    expect(getMock).toHaveBeenCalledWith('/api/tasks/stale', { signal: undefined });
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

  test('기록함 Task를 지정한 날짜의 Today로 이동한다', async () => {
    await taskApi.moveToToday(42, '2026-06-25');

    expect(patchMock).toHaveBeenCalledWith('/api/tasks/42/today', undefined, {
      query: { date: '2026-06-25' },
      signal: undefined,
    });
  });

  test('완료 Task를 지정한 날짜의 Today로 다시 연다', async () => {
    await taskApi.reopenToday(42, '2026-06-25');

    expect(patchMock).toHaveBeenCalledWith('/api/tasks/42/done/cancel', undefined, {
      query: { date: '2026-06-25' },
      signal: undefined,
    });
  });
});
