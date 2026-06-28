import { getDdayLabel } from '../dday-label';

describe('D-Day 남은 날짜 표현', () => {
  it('미래, 당일, 지난 목표를 구분한다', () => {
    expect(getDdayLabel(7)).toBe('D-7');
    expect(getDdayLabel(0)).toBe('D-Day');
    expect(getDdayLabel(-3)).toBe('D+3');
  });
});
