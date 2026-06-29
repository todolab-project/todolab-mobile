import { getCompletedSummary } from '../completed-summary';

describe('getCompletedSummary', () => {
  test('완료 수와 기록이 있는 날짜 수를 요약한다', () => {
    const summary = getCompletedSummary([
      { tasks: [{ id: 1 }, { id: 2 }] },
      { tasks: [] },
      { tasks: [{ id: 3 }] },
    ]);

    expect(summary).toEqual({
      total: 3,
      activeDays: 2,
      message: '이 주에는 2일 동안 3개의 일을 마쳤어요.',
    });
  });

  test('완료가 없는 주를 평가하지 않는 문구로 안내한다', () => {
    expect(getCompletedSummary([{ tasks: [] }, { tasks: [] }])).toEqual({
      total: 0,
      activeDays: 0,
      message: '아직 완료 기록이 없어요. 비어 있는 주도 괜찮아요.',
    });
  });
});
