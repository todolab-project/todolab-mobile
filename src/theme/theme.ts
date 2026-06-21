import { palette } from './tokens';

const sharedColors = {
  primary: palette.blue[600],
  primaryPressed: palette.blue[700],
  primarySoft: palette.blue[50],
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
    background: '#F3F5F7',
    surface: palette.white,
    surfaceMuted: palette.slate[50],
    surfaceElevated: palette.white,
    border: palette.slate[200],
    borderStrong: palette.slate[300],
    text: '#18212F',
    textSecondary: palette.slate[500],
    textMuted: palette.slate[400],
    textOnPrimary: palette.white,
    overlay: 'rgba(2, 6, 23, 0.45)',
    shadow: palette.slate[900],
  },
} as const;

export const darkTheme = {
  isDark: true,
  colors: {
    ...sharedColors,
    primary: palette.blue[500],
    primarySoft: 'rgba(59, 130, 246, 0.16)',
    successSoft: 'rgba(22, 163, 74, 0.16)',
    warningSoft: 'rgba(217, 119, 6, 0.16)',
    dangerSoft: 'rgba(220, 38, 38, 0.16)',
    background: palette.slate[950],
    surface: palette.slate[900],
    surfaceMuted: palette.slate[800],
    surfaceElevated: palette.slate[800],
    border: palette.slate[800],
    borderStrong: palette.slate[700],
    text: palette.slate[50],
    textSecondary: palette.slate[400],
    textMuted: palette.slate[500],
    textOnPrimary: palette.white,
    overlay: 'rgba(0, 0, 0, 0.62)',
    shadow: palette.black,
  },
} as const;

export type AppTheme = typeof lightTheme | typeof darkTheme;
