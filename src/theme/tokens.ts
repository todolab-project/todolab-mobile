export const palette = {
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    600: '#16A34A',
    700: '#15803D',
  },
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    600: '#D97706',
    700: '#B45309',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    600: '#DC2626',
    700: '#B91C1C',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const typography = {
  size: {
    caption: 12,
    label: 14,
    body: 16,
    bodyLarge: 18,
    title: 24,
    display: 34,
  },
  lineHeight: {
    caption: 16,
    label: 20,
    body: 24,
    bodyLarge: 26,
    title: 32,
    display: 44,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 1.6,
  },
} as const;

export const sizes = {
  touchTarget: 44,
  contentMaxWidth: 720,
  bottomTabHeight: 64,
} as const;

export const motion = {
  duration: {
    fast: 150,
    normal: 220,
    slow: 320,
  },
} as const;
