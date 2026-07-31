import type {
  LocalDateString,
  RecurrenceFrequency,
  TaskRecurrenceRequest,
  TaskResponse,
} from '@/types';
import { APP_TIME_ZONE, isLocalDateString } from '@/utils';

export type RecurrenceMode = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export type RecurrenceFormValues = {
  mode: RecurrenceMode;
  customFrequency: RecurrenceFrequency;
  customInterval: string;
};

const weekdayCodes = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

export const recurrenceModeOptions: { value: RecurrenceMode; label: string }[] = [
  { value: 'NONE', label: '반복 없음' },
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
  { value: 'CUSTOM', label: '직접 설정' },
];

export const recurrenceFrequencyOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'DAILY', label: '일' },
  { value: 'WEEKLY', label: '주' },
  { value: 'MONTHLY', label: '개월' },
];

export function getInitialRecurrenceValues(task?: TaskResponse): RecurrenceFormValues {
  const recurrence = task?.recurrence;

  if (!recurrence) {
    return {
      mode: 'NONE',
      customFrequency: 'WEEKLY',
      customInterval: '2',
    };
  }

  const frequency = recurrence.frequency;
  const interval = recurrence.interval || 1;
  const simpleMode =
    interval === 1 && (frequency === 'DAILY' || frequency === 'WEEKLY' || frequency === 'MONTHLY')
      ? frequency
      : 'CUSTOM';

  return {
    mode: simpleMode,
    customFrequency:
      frequency === 'DAILY' || frequency === 'WEEKLY' || frequency === 'MONTHLY'
        ? frequency
        : 'WEEKLY',
    customInterval: String(Math.max(interval, 1)),
  };
}

export function buildTaskRecurrenceRequest(
  values: RecurrenceFormValues,
  scheduleDate: LocalDateString,
): TaskRecurrenceRequest | null {
  if (values.mode === 'NONE') {
    return null;
  }

  const frequency = values.mode === 'CUSTOM' ? values.customFrequency : values.mode;
  const interval = values.mode === 'CUSTOM' ? Number(values.customInterval) : 1;

  if (!Number.isInteger(interval) || interval < 1 || interval > 99) {
    return null;
  }

  return {
    frequency,
    interval,
    recurrenceRule: buildRecurrenceRule(frequency, interval, scheduleDate),
    timeZone: APP_TIME_ZONE,
    byDays: frequency === 'WEEKLY' ? [getWeekdayCode(scheduleDate)] : null,
    byMonthDays: frequency === 'MONTHLY' ? [Number(scheduleDate.slice(8, 10))] : null,
  };
}

export function isValidRecurrenceInterval(value: string) {
  const interval = Number(value);

  return Number.isInteger(interval) && interval >= 1 && interval <= 99;
}

function buildRecurrenceRule(
  frequency: RecurrenceFrequency,
  interval: number,
  scheduleDate: LocalDateString,
) {
  const parts = [`FREQ=${frequency}`];

  if (interval > 1) {
    parts.push(`INTERVAL=${interval}`);
  }

  if (frequency === 'WEEKLY') {
    parts.push(`BYDAY=${getWeekdayCode(scheduleDate)}`);
  }

  if (frequency === 'MONTHLY') {
    parts.push(`BYMONTHDAY=${Number(scheduleDate.slice(8, 10))}`);
  }

  return parts.join(';');
}

function getWeekdayCode(value: LocalDateString) {
  if (!isLocalDateString(value)) {
    return 'MO';
  }

  const [year, month, day] = value.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();

  return weekdayCodes[weekday];
}
