import {
  isLocalDateString,
  isLocalDateTimeString,
  parseApiLocalDateTime,
  shiftLocalDate,
  toApiLocalDateTime,
} from '@/utils/date-time';

describe('API 날짜·시간 변환', () => {
  test('UTC 시각을 서울 wall-clock 문자열로 변환한다', () => {
    const date = new Date('2026-06-23T06:30:45.000Z');

    expect(toApiLocalDateTime(date)).toBe('2026-06-23T15:30:45');
  });

  test('서울 wall-clock 문자열을 같은 instant로 해석한다', () => {
    const date = parseApiLocalDateTime('2026-06-23T15:30:45.123456');

    expect(date?.toISOString()).toBe('2026-06-23T06:30:45.123Z');
  });

  test('윤년과 잘못된 날짜를 구분한다', () => {
    expect(isLocalDateString('2024-02-29')).toBe(true);
    expect(isLocalDateString('2026-02-29')).toBe(false);
    expect(isLocalDateTimeString('2026-06-23T24:00:00')).toBe(false);
  });

  test('기기 시간대와 무관하게 월말 날짜를 이동한다', () => {
    expect(shiftLocalDate('2026-01-31', 1)).toBe('2026-02-01');
    expect(shiftLocalDate('2026-03-01', -1)).toBe('2026-02-28');
  });
});
