import { getTodayGreeting } from '@/features/today/today-copy';

describe('Today 인사말', () => {
  test.each([
    ['2026-06-23T20:00:00.000Z', '좋은 아침이에요.'],
    ['2026-06-23T06:00:00.000Z', '좋은 오후예요.'],
    ['2026-06-23T12:00:00.000Z', '오늘도 차분히 시작해요.'],
  ])('서울 시각에 맞는 문구를 반환한다', (isoString, expected) => {
    expect(getTodayGreeting(new Date(isoString))).toBe(expected);
  });
});
