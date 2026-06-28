import { taskQueryKeys } from '@/features/tasks';
import { shiftLocalDate, toApiLocalDate } from '@/utils';

import { getCalendarDayQueryKeys } from '../calendar-day-query';
import { getMonthCalendarDates, getWeekDates } from '../calendar-date';

describe('Today와 Calendar 날짜 일관성', () => {
  it('서울 자정 전후 instant를 서로 다른 로컬 날짜로 계산한다', () => {
    expect(toApiLocalDate(new Date('2026-06-28T14:59:59.999Z'))).toBe('2026-06-28');
    expect(toApiLocalDate(new Date('2026-06-28T15:00:00.000Z'))).toBe('2026-06-29');
  });

  it('Today에서 계산한 날짜를 주간·월간 Calendar가 그대로 포함한다', () => {
    const date = toApiLocalDate(new Date('2026-06-28T15:00:00.000Z'));

    expect(getWeekDates(date)).toContain(date);
    expect(getMonthCalendarDates(date)).toContain(date);
  });

  it('Calendar가 Today와 완료 목록의 동일한 날짜 query key를 재사용한다', () => {
    const date = toApiLocalDate(new Date('2026-06-28T15:00:00.000Z'));
    const tomorrow = shiftLocalDate(date, 1);
    const calendarKeys = getCalendarDayQueryKeys(date);

    expect(calendarKeys.scheduled).toEqual(taskQueryKeys.today(date));
    expect(calendarKeys.done).toEqual(taskQueryKeys.done(date));
    expect(tomorrow).not.toBeNull();
    expect(getCalendarDayQueryKeys(tomorrow!).scheduled).not.toEqual(calendarKeys.scheduled);
  });
});
