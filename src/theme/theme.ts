import { palette } from './tokens';

const sharedColors = {
  primary: palette.powder[600],
  primaryPressed: palette.powder[700],
  primarySoft: palette.powder[100],
  success: palette.green[600],
  successSoft: palette.green[50],
  warning: palette.amber[600],
  warningSoft: palette.amber[50],
  danger: palette.red[600],
  dangerPressed: palette.red[700],
  dangerSoft: palette.red[50],
} as const;

export const lightTheme = {
  isDark: false,
  colors: {
    ...sharedColors,
    background: palette.paper[100],
    surface: palette.paper[50],
    surfaceMuted: palette.paper[200],
    surfaceElevated: palette.paper[50],
    border: palette.paper[300],
    borderStrong: palette.paper[400],
    rule: palette.paper[300],
    text: palette.ink[900],
    textSecondary: palette.ink[600],
    textMuted: palette.ink[500],
    textOnPrimary: palette.white,
    highlightSage: palette.highlighter.sage,
    highlightAmber: palette.highlighter.amber,
    highlightBlue: palette.highlighter.blue,
    overlay: 'rgba(2, 6, 23, 0.45)',
    shadow: palette.slate[900],
  },
} as const;

export const darkTheme = {
  isDark: true,
  colors: {
    ...sharedColors,
    primary: palette.powder[500],
    primaryPressed: '#B5C8D5',
    danger: palette.red[700],
    primarySoft: '#303A3D',
    successSoft: 'rgba(22, 163, 74, 0.16)',
    warningSoft: 'rgba(217, 119, 6, 0.16)',
    dangerSoft: 'rgba(220, 38, 38, 0.16)',
    background: '#171816',
    surface: '#22231F',
    surfaceMuted: '#2C2E29',
    surfaceElevated: '#30322D',
    border: '#3D4038',
    borderStrong: '#55594E',
    rule: '#3D4038',
    text: '#F2EFE7',
    textSecondary: '#BBB6AA',
    textMuted: '#9A958A',
    textOnPrimary: '#171816',
    highlightSage: '#394337',
    highlightAmber: '#4A4027',
    highlightBlue: '#303A3D',
    overlay: 'rgba(0, 0, 0, 0.62)',
    shadow: palette.black,
  },
} as const;

export type AppTheme = typeof lightTheme | typeof darkTheme;
