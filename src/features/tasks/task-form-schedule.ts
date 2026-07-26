import type { LocalDateTimeString } from '@/types';
import { isLocalDateString, shiftLocalDate } from '@/utils';

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export type ScheduleFormInput = {
  allDay: boolean;
  date: string;
  endTime: string;
  startTime: string;
};

export type ScheduleFormResult =
  | {
      ok: true;
      allDay: boolean;
      endAt: LocalDateTimeString | null;
      startAt: LocalDateTimeString;
    }
  | {
      ok: false;
      message: string;
    };

export function normalizeScheduleFormInput(input: ScheduleFormInput): ScheduleFormResult {
  const date = input.date.trim();

  if (!isLocalDateString(date)) {
    return { ok: false, message: '일정 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.' };
  }

  if (input.allDay) {
    const nextDate = shiftLocalDate(date, 1);

    if (!nextDate) {
      return { ok: false, message: '일정 날짜를 다시 확인해 주세요.' };
    }

    return {
      ok: true,
      allDay: true,
      startAt: `${date}T00:00:00`,
      endAt: `${nextDate}T00:00:00`,
    };
  }

  const startTime = input.startTime.trim();
  const endTime = input.endTime.trim();

  if (!timePattern.test(startTime)) {
    return { ok: false, message: '시작 시간을 HH:mm 형식으로 입력해 주세요.' };
  }

  if (endTime && !timePattern.test(endTime)) {
    return { ok: false, message: '종료 시간을 HH:mm 형식으로 입력해 주세요.' };
  }

  if (endTime && endTime <= startTime) {
    return { ok: false, message: '종료 시간은 시작 시간 이후여야 합니다.' };
  }

  return {
    ok: true,
    allDay: false,
    startAt: `${date}T${startTime}:00`,
    endAt: endTime ? `${date}T${endTime}:00` : null,
  };
}
