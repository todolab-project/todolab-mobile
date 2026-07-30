import type { RecurrenceException, TaskResponse } from '@/types';
import { formatDateLabel } from '@/utils';

type RecurringTask = Pick<
  TaskResponse,
  | 'occurrenceDate'
  | 'originalOccurrenceDate'
  | 'recurrence'
  | 'recurrenceException'
  | 'recurrenceRule'
>;

const frequencyLabels: Record<string, string> = {
  DAILY: '매일',
  WEEKLY: '매주',
  MONTHLY: '매월',
  YEARLY: '매년',
};

const weekdayLabels: Record<string, string> = {
  MO: '월',
  TU: '화',
  WE: '수',
  TH: '목',
  FR: '금',
  SA: '토',
  SU: '일',
};

const exceptionLabels: Record<RecurrenceException, string> = {
  SKIPPED: '건너뜀',
  MOVED: '이동됨',
  MODIFIED: '수정됨',
};

export function getRecurrenceLabel(task: RecurringTask) {
  const recurrenceRule = task.recurrence?.recurrenceRule ?? task.recurrenceRule;

  if (!recurrenceRule) {
    return null;
  }

  const rule = parseRecurrenceRule(recurrenceRule);
  const baseLabel = getBaseRecurrenceLabel(rule);
  const exceptionLabel = task.recurrenceException
    ? exceptionLabels[task.recurrenceException]
    : null;

  return [baseLabel, exceptionLabel].filter(Boolean).join(' · ');
}

export function getOccurrenceLabel(task: RecurringTask) {
  const recurrenceRule = task.recurrence?.recurrenceRule ?? task.recurrenceRule;

  if (!recurrenceRule || !task.occurrenceDate) {
    return null;
  }

  const occurrenceDate = formatShortDateLabel(task.occurrenceDate);

  if (task.originalOccurrenceDate && task.originalOccurrenceDate !== task.occurrenceDate) {
    return `이동 ${formatShortDateLabel(task.originalOccurrenceDate)}→${occurrenceDate}`;
  }

  return `발생 ${occurrenceDate}`;
}

function getBaseRecurrenceLabel(rule: Record<string, string>) {
  const frequency = rule.FREQ;
  const interval = Number(rule.INTERVAL);
  const intervalLabel = Number.isFinite(interval) && interval > 1 ? `${interval}` : '';

  if (frequency === 'WEEKLY') {
    const dayLabel = getWeekdayLabel(rule.BYDAY);

    return [intervalLabel ? `${intervalLabel}주마다` : frequencyLabels.WEEKLY, dayLabel]
      .filter(Boolean)
      .join(' ');
  }

  if (frequency === 'DAILY' && intervalLabel) {
    return `${intervalLabel}일마다`;
  }

  if (frequency === 'MONTHLY' && intervalLabel) {
    return `${intervalLabel}개월마다`;
  }

  if (frequency === 'YEARLY' && intervalLabel) {
    return `${intervalLabel}년마다`;
  }

  return frequency ? (frequencyLabels[frequency] ?? '반복') : '반복';
}

function getWeekdayLabel(value?: string) {
  if (!value) {
    return null;
  }

  return value
    .split(',')
    .map((day) => weekdayLabels[day] ?? day)
    .join('·');
}

function parseRecurrenceRule(value: string) {
  return value.split(';').reduce<Record<string, string>>((rules, part) => {
    const [key, ruleValue] = part.split('=');

    if (key && ruleValue) {
      rules[key] = ruleValue;
    }

    return rules;
  }, {});
}

function formatShortDateLabel(value: NonNullable<RecurringTask['occurrenceDate']>) {
  return formatDateLabel(value, { month: 'long', day: 'numeric' });
}
