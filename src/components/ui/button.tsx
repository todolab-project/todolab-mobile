import type { ReactNode } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { radii, sizes, spacing, useAppTheme } from '@/theme';

import { AppText } from './app-text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'medium' | 'large';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leading?: ReactNode;
  style?: ViewStyle;
};

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leading,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const theme = useAppTheme();
  const isDisabled = disabled || loading;
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      textColor: theme.colors.textOnPrimary,
      pressedColor: theme.colors.primaryPressed,
    },
    secondary: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primarySoft,
      textColor: theme.colors.primary,
      pressedColor: theme.colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: theme.colors.textSecondary,
      pressedColor: theme.colors.surfaceMuted,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
      textColor: theme.colors.textOnPrimary,
      pressedColor: theme.colors.dangerPressed,
    },
  };
  const selected = variants[variant];

  return (
    <Pressable
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'large' ? styles.large : styles.medium,
        {
          backgroundColor: pressed ? selected.pressedColor : selected.backgroundColor,
          borderColor: selected.borderColor,
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={selected.textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {leading}
          <AppText
            variant="label"
            weight="bold"
            style={{ color: selected.textColor }}
          >
            {children}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
  },
  medium: {
    minHeight: sizes.touchTarget,
  },
  large: {
    minHeight: 52,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
  },
});
