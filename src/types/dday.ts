import type { LocalDateString, LocalDateTimeString } from './date-time';

export const ddayGoalLimits = {
  title: 50,
} as const;

export type DdayGoalRequest = {
  title: string;
  targetDate: LocalDateString;
};

export type DdayGoalResponse = {
  id: number;
  title: string;
  targetDate: LocalDateString;
  daysLeft: number;
  createdAt: LocalDateTimeString;
};
