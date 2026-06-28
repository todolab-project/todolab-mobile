import { validateDdayGoal } from '../dday-validation';

describe('D-Day 목표 유효성 검사', () => {
  it('제목과 목표 날짜를 요구한다', () => {
    expect(validateDdayGoal({ title: ' ', targetDate: '' })).toEqual({
      title: '목표 이름을 입력해 주세요.',
      targetDate: '목표 날짜를 입력해 주세요.',
    });
  });

  it('실제로 존재하는 YYYY-MM-DD 날짜만 허용한다', () => {
    expect(validateDdayGoal({ title: '출시', targetDate: '2026-02-30' })).toEqual({
      targetDate: 'YYYY-MM-DD 형식의 올바른 날짜를 입력해 주세요.',
    });
  });

  it('지난 날짜도 회고용 D-Day로 허용한다', () => {
    expect(validateDdayGoal({ title: '첫 출시', targetDate: '2025-01-01' })).toEqual({});
  });
});
