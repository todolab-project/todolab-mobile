export function getDdayLabel(daysLeft: number) {
  if (daysLeft === 0) {
    return 'D-Day';
  }

  return daysLeft > 0 ? `D-${daysLeft}` : `D+${Math.abs(daysLeft)}`;
}
