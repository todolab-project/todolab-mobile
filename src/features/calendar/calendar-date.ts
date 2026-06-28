import type { LocalDateString } from '@/types';
import { isLocalDateString, shiftLocalDate } from '@/utils';

export function getWeekDates(value: LocalDateString): LocalDateString[] {
  if (!isLocalDateString(value)) {
    return [];
  }

  const [year, month, day] = value.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
  const daysSinceMonday = (weekday + 6) % 7;
  const monday = shiftLocalDate(value, -daysSinceMonday);

  if (!monday) {
    return [];
  }

  return Array.from({ length: 7 }, (_, index) => shiftLocalDate(monday, index)).filter(
    (date): date is LocalDateString => date !== null,
  );
}

export function getMonthCalendarDates(value: LocalDateString): LocalDateString[] {
  if (!isLocalDateString(value)) {
    return [];
  }

  const firstDay = `${value.slice(0, 7)}-01` as LocalDateString;
  const firstWeek = getWeekDates(firstDay);
  const gridStart = firstWeek[0];

  if (!gridStart) {
    return [];
  }

  return Array.from({ length: 42 }, (_, index) => shiftLocalDate(gridStart, index)).filter(
    (date): date is LocalDateString => date !== null,
  );
}

export function shiftMonth(value: LocalDateString, amount: number): LocalDateString | null {
  if (!isLocalDateString(value) || !Number.isInteger(amount)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const targetMonthStart = new Date(Date.UTC(year, month - 1 + amount, 1, 12));
  const targetYear = targetMonthStart.getUTCFullYear();
  const targetMonth = targetMonthStart.getUTCMonth();
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 12)).getUTCDate();
  const targetDay = Math.min(day, lastDay);
  const result =
    `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-` +
    String(targetDay).padStart(2, '0');

  return isLocalDateString(result) ? result : null;
}
