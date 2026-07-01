import { useState, type ReactNode } from 'react';
import type { PressableProps, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import { radii, sizes, useAppTheme } from '@/theme';

type IconButtonProps = Omit<PressableProps, 'accessibilityLabel' | 'children' | 'style'> & {
  accessibilityLabel: string;
  children: ReactNode;
  selected?: boolean;
  style?: ViewStyle;
};

export function IconButton({
  accessibilityLabel,
  children,
  selected = false,
  disabled,
  onBlur,
  onFocus,
  style,
  ...props
}: IconButtonProps) {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      {...props}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, selected }}
      disabled={isDisabled}
      hitSlop={4}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor:
            pressed || selected ? theme.colors.primarySoft : theme.colors.surfaceMuted,
          borderColor: isFocused ? theme.colors.text : 'transparent',
          borderWidth: isFocused ? 2 : 1,
          opacity: isDisabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: sizes.touchTarget,
    justifyContent: 'center',
    width: sizes.touchTarget,
  },
});
