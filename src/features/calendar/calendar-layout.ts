import type { DimensionValue } from 'react-native';

export const CALENDAR_COLUMN_COUNT = 7;
export const CALENDAR_DAY_WIDTH = `${100 / CALENDAR_COLUMN_COUNT}%` as DimensionValue;

export function getCalendarColumnBoundaryPercent(index: number) {
  return `${((index + 1) / CALENDAR_COLUMN_COUNT) * 100}%` as DimensionValue;
}

export function getCalendarSegmentLeftPercent(startIndex: number, total = CALENDAR_COLUMN_COUNT) {
  return `${(startIndex / total) * 100}%` as DimensionValue;
}

export function getCalendarSegmentWidthPercent(
  startIndex: number,
  endIndex: number,
  total = CALENDAR_COLUMN_COUNT,
) {
  return `${((endIndex - startIndex + 1) / total) * 100}%` as DimensionValue;
}
