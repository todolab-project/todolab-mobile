import { mockApiClient } from '@/services/api/mock-api-client';
import type { TaskSearchPage } from '@/types';

describe('Mock task search API', () => {
  test('cursor 기반으로 다음 검색 페이지를 반환한다', async () => {
    const firstPage = await mockApiClient.get<TaskSearchPage>('/api/v1/tasks/search', {
      query: { limit: 3 },
    });
    const secondPage = await mockApiClient.get<TaskSearchPage>('/api/v1/tasks/search', {
      query: { cursor: firstPage.nextCursor, limit: 3 },
    });

    expect(firstPage.items).toHaveLength(3);
    expect(firstPage.hasNext).toBe(true);
    expect(firstPage.nextCursor).toBe('3');
    expect(secondPage.items.map((item) => item.task.id)).not.toEqual(
      firstPage.items.map((item) => item.task.id),
    );
  });

  test('날짜 오름차순 정렬을 적용한다', async () => {
    const page = await mockApiClient.get<TaskSearchPage>('/api/v1/tasks/search', {
      query: { limit: 5, sort: 'DATE_ASC' },
    });

    const dates = page.items.map((item) => item.relevantDate);

    expect(dates).toEqual([...dates].sort());
  });

  test('D-Day와 카테고리 필터를 함께 적용한다', async () => {
    const page = await mockApiClient.get<TaskSearchPage>('/api/v1/tasks/search', {
      query: { category: 'D-Day', hasDday: true, limit: 10 },
    });

    expect(page.items).toHaveLength(1);
    expect(page.items[0].task.category).toBe('D-Day');
    expect(page.items[0].task.ddayGoalId).not.toBeNull();
  });
});
