import { getMonthCalendarDates, getWeekDates, shiftMonth } from '../calendar-date';

describe('getWeekDates', () => {
  it('월요일부터 일요일까지 한 주를 반환한다', () => {
    expect(getWeekDates('2026-06-28')).toEqual([
      '2026-06-22',
      '2026-06-23',
      '2026-06-24',
      '2026-06-25',
      '2026-06-26',
      '2026-06-27',
      '2026-06-28',
    ]);
  });

  it('월과 연도가 바뀌는 주도 계산한다', () => {
    expect(getWeekDates('2026-01-01')).toEqual([
      '2025-12-29',
      '2025-12-30',
      '2025-12-31',
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
      '2026-01-04',
    ]);
  });
});

describe('getMonthCalendarDates', () => {
  it('월요일부터 일요일까지 6주 고정 그리드를 반환한다', () => {
    const dates = getMonthCalendarDates('2026-06-28');

    expect(dates).toHaveLength(42);
    expect(dates[0]).toBe('2026-06-01');
    expect(dates.at(-1)).toBe('2026-07-12');
  });

  it('이전 연도와 다음 달 날짜를 포함한다', () => {
    const dates = getMonthCalendarDates('2026-01-15');

    expect(dates[0]).toBe('2025-12-29');
    expect(dates.at(-1)).toBe('2026-02-08');
  });
});

describe('shiftMonth', () => {
  it('월의 마지막 날짜를 넘으면 대상 월의 마지막 날로 맞춘다', () => {
    expect(shiftMonth('2026-01-31', 1)).toBe('2026-02-28');
  });

  it('연도를 넘어 이전 달과 다음 달로 이동한다', () => {
    expect(shiftMonth('2026-01-15', -1)).toBe('2025-12-15');
    expect(shiftMonth('2026-12-15', 1)).toBe('2027-01-15');
  });
});
