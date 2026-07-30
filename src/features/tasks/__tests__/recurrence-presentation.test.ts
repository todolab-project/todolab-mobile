import type { TaskResponse } from '@/types';

import { getOccurrenceLabel, getRecurrenceLabel } from '../recurrence-presentation';

type RecurringTask = Pick<
  TaskResponse,
  | 'occurrenceDate'
  | 'originalOccurrenceDate'
  | 'recurrence'
  | 'recurrenceException'
  | 'recurrenceRule'
>;

function makeTask(overrides: RecurringTask): RecurringTask {
  return overrides;
}

describe('getRecurrenceLabel', () => {
  it('반복 규칙이 없으면 표시하지 않는다', () => {
    expect(
      getRecurrenceLabel(
        makeTask({ recurrence: null, recurrenceException: null, recurrenceRule: null }),
      ),
    ).toBe(null);
  });

  it.each([
    ['FREQ=DAILY', '매일'],
    ['FREQ=WEEKLY;BYDAY=TU', '매주 화'],
    ['FREQ=WEEKLY;BYDAY=MO,WE,FR', '매주 월·수·금'],
    ['FREQ=WEEKLY;INTERVAL=2;BYDAY=TU', '2주마다 화'],
    ['FREQ=MONTHLY;INTERVAL=3', '3개월마다'],
    ['FREQ=HOURLY', '반복'],
  ] as const)('%s 규칙을 %s로 요약한다', (rule, expected) => {
    expect(
      getRecurrenceLabel(
        makeTask({ recurrence: null, recurrenceException: null, recurrenceRule: rule }),
      ),
    ).toBe(expected);
  });

  it('nested recurrence 응답의 규칙을 우선 사용한다', () => {
    expect(
      getRecurrenceLabel(
        makeTask({
          recurrence: {
            id: 1,
            frequency: 'WEEKLY',
            interval: 1,
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
            timeZone: 'Asia/Seoul',
            recurrenceStartAt: '2026-07-09T09:00:00',
            recurrenceUntil: null,
            recurrenceCount: null,
          },
          recurrenceException: null,
          recurrenceRule: 'FREQ=DAILY',
        }),
      ),
    ).toBe('매주 목');
  });

  it('occurrence 예외 상태를 반복 label 뒤에 덧붙인다', () => {
    expect(
      getRecurrenceLabel(
        makeTask({
          recurrence: null,
          recurrenceException: 'MODIFIED',
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
        }),
      ),
    ).toBe('매주 화 · 수정됨');
  });

  it('occurrence 날짜가 있으면 이번 발생 날짜를 표시한다', () => {
    expect(
      getOccurrenceLabel(
        makeTask({
          recurrence: null,
          recurrenceException: null,
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
          occurrenceDate: '2026-08-04',
        }),
      ),
    ).toBe('발생 8월 4일');
  });

  it('이동된 occurrence는 원래 날짜와 변경 날짜를 함께 표시한다', () => {
    expect(
      getOccurrenceLabel(
        makeTask({
          recurrence: null,
          recurrenceException: 'MOVED',
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
          occurrenceDate: '2026-08-05',
          originalOccurrenceDate: '2026-08-04',
        }),
      ),
    ).toBe('이동 8월 4일→8월 5일');
  });
});
