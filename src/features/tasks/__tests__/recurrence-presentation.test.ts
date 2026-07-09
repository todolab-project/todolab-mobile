import type { TaskResponse } from '@/types';

import { getRecurrenceLabel } from '../recurrence-presentation';

type RecurringTask = Pick<TaskResponse, 'recurrenceException' | 'recurrenceRule'>;

function makeTask(overrides: RecurringTask): RecurringTask {
  return overrides;
}

describe('getRecurrenceLabel', () => {
  it('반복 규칙이 없으면 표시하지 않는다', () => {
    expect(getRecurrenceLabel(makeTask({ recurrenceException: null, recurrenceRule: null }))).toBe(
      null,
    );
  });

  it.each([
    ['FREQ=DAILY', '매일'],
    ['FREQ=WEEKLY;BYDAY=TU', '매주 화'],
    ['FREQ=WEEKLY;BYDAY=MO,WE,FR', '매주 월·수·금'],
    ['FREQ=WEEKLY;INTERVAL=2;BYDAY=TU', '2주마다 화'],
    ['FREQ=MONTHLY;INTERVAL=3', '3개월마다'],
    ['FREQ=HOURLY', '반복'],
  ] as const)('%s 규칙을 %s로 요약한다', (rule, expected) => {
    expect(getRecurrenceLabel(makeTask({ recurrenceException: null, recurrenceRule: rule }))).toBe(
      expected,
    );
  });

  it('occurrence 예외 상태를 반복 label 뒤에 덧붙인다', () => {
    expect(
      getRecurrenceLabel(
        makeTask({ recurrenceException: 'MODIFIED', recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU' }),
      ),
    ).toBe('매주 화 · 수정됨');
  });
});
