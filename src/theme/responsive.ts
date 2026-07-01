import { useWindowDimensions } from 'react-native';

import { spacing } from './tokens';

export type MobileWidthClass = 'compact' | 'regular' | 'wide';

export function getMobileWidthClass(width: number): MobileWidthClass {
  if (width < 360) return 'compact';
  if (width < 400) return 'regular';
  return 'wide';
}

export function useMobileLayout() {
  const { width } = useWindowDimensions();
  const widthClass = getMobileWidthClass(width);

  return {
    isCompact: widthClass === 'compact',
    screenPadding: widthClass === 'compact' ? spacing[3] : spacing[4],
    width,
    widthClass,
  };
}
