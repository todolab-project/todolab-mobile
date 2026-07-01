import { useWindowDimensions } from 'react-native';

import { spacing } from './tokens';

export type ViewportWidthClass = 'compact' | 'regular' | 'wide' | 'tablet' | 'desktop';

export function getViewportWidthClass(width: number): ViewportWidthClass {
  if (width < 360) return 'compact';
  if (width < 400) return 'regular';
  if (width < 600) return 'wide';
  if (width < 840) return 'tablet';
  return 'desktop';
}

export function useMobileLayout() {
  const { width } = useWindowDimensions();
  const widthClass = getViewportWidthClass(width);

  return {
    isCompact: widthClass === 'compact',
    isDesktop: widthClass === 'desktop',
    isTablet: widthClass === 'tablet',
    screenPadding: widthClass === 'compact' ? spacing[3] : spacing[4],
    width,
    widthClass,
  };
}
