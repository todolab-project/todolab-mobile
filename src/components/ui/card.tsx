import type { PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { radii, sizes, useAppTheme } from '@/theme';

type CardVariant = 'default' | 'muted' | 'outlined';

type CardProps = PropsWithChildren<
  ViewProps & {
    variant?: CardVariant;
    padded?: boolean;
  }
>;

export function Card({ children, variant = 'default', padded = true, style, ...props }: CardProps) {
  const theme = useAppTheme();
  const variants = {
    default: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    muted: {
      backgroundColor: theme.colors.surfaceMuted,
      borderColor: theme.colors.surfaceMuted,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
    },
  };

  return (
    <View {...props} style={[styles.base, variants[variant], padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  padded: {
    padding: sizes.cardPadding,
  },
});
