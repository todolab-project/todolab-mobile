import { toApiLocalDateTime } from '@/utils';

export function getTodayGreeting(now: Date) {
  const hour = Number(toApiLocalDateTime(now).slice(11, 13));

  if (hour >= 5 && hour < 12) {
    return '좋은 아침이에요.';
  }

  if (hour >= 12 && hour < 18) {
    return '좋은 오후예요.';
  }

  return '오늘도 차분히 시작해요.';
}
