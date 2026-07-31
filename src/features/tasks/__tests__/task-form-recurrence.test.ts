import type { TaskResponse } from '@/types';

import {
  buildTaskRecurrenceRequest,
  getInitialRecurrenceValues,
  isValidRecurrenceInterval,
} from '../task-form-recurrence';

describe('buildTaskRecurrenceRequest', () => {
  it('반복 없음은 null payload로 변환한다', () => {
    expect(
      buildTaskRecurrenceRequest(
        { mode: 'NONE', customFrequency: 'WEEKLY', customInterval: '2' },
        '2026-08-04',
      ),
    ).toBeNull();
  });

  it('매주 반복은 일정 날짜의 요일을 BYDAY로 포함한다', () => {
    expect(
      buildTaskRecurrenceRequest(
        { mode: 'WEEKLY', customFrequency: 'WEEKLY', customInterval: '2' },
        '2026-08-04',
      ),
    ).toEqual({
      frequency: 'WEEKLY',
      interval: 1,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      timeZone: 'Asia/Seoul',
      byDays: ['TU'],
      byMonthDays: null,
    });
  });

  it('매월 반복은 일정 날짜의 일을 BYMONTHDAY로 포함한다', () => {
    expect(
      buildTaskRecurrenceRequest(
        { mode: 'MONTHLY', customFrequency: 'WEEKLY', customInterval: '2' },
        '2026-08-14',
      ),
    ).toEqual({
      frequency: 'MONTHLY',
      interval: 1,
      recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=14',
      timeZone: 'Asia/Seoul',
      byDays: null,
      byMonthDays: [14],
    });
  });

  it('직접 설정은 interval을 recurrence rule에 반영한다', () => {
    expect(
      buildTaskRecurrenceRequest(
        { mode: 'CUSTOM', customFrequency: 'WEEKLY', customInterval: '2' },
        '2026-08-04',
      ),
    ).toMatchObject({
      frequency: 'WEEKLY',
      interval: 2,
      recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU',
      byDays: ['TU'],
    });
  });
});

describe('getInitialRecurrenceValues', () => {
  it('반복이 없으면 반복 없음 기본값을 반환한다', () => {
    expect(getInitialRecurrenceValues()).toEqual({
      mode: 'NONE',
      customFrequency: 'WEEKLY',
      customInterval: '2',
    });
  });

  it('interval 1의 주간 반복은 매주 mode로 복원한다', () => {
    const task = {
      recurrence: {
        frequency: 'WEEKLY',
        interval: 1,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      },
    } as TaskResponse;

    expect(getInitialRecurrenceValues(task)).toMatchObject({
      mode: 'WEEKLY',
      customFrequency: 'WEEKLY',
      customInterval: '1',
    });
  });

  it('interval 2 이상의 반복은 직접 설정으로 복원한다', () => {
    const task = {
      recurrence: {
        frequency: 'WEEKLY',
        interval: 2,
        recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TU',
      },
    } as TaskResponse;

    expect(getInitialRecurrenceValues(task)).toMatchObject({
      mode: 'CUSTOM',
      customFrequency: 'WEEKLY',
      customInterval: '2',
    });
  });
});

describe('isValidRecurrenceInterval', () => {
  it('1부터 99 사이의 정수만 허용한다', () => {
    expect(isValidRecurrenceInterval('1')).toBe(true);
    expect(isValidRecurrenceInterval('99')).toBe(true);
    expect(isValidRecurrenceInterval('0')).toBe(false);
    expect(isValidRecurrenceInterval('100')).toBe(false);
    expect(isValidRecurrenceInterval('1.5')).toBe(false);
  });
});
