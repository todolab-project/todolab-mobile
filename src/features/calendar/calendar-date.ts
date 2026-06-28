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
