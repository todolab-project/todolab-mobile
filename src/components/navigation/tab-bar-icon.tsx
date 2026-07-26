import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { radii, spacing, useAppTheme } from '@/theme';

type TabBarIconProps = {
  color: ColorValue;
  focused?: boolean;
  name: SymbolViewProps['name'];
  size: number;
};

export function TabBarIcon({ color, focused = false, name, size }: TabBarIconProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, focused && { backgroundColor: theme.colors.primarySoft }]}>
      <SymbolView name={name} size={size} tintColor={color} type="hierarchical" weight="semibold" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: radii.full,
    justifyContent: 'center',
    minHeight: 28,
    minWidth: 44,
    paddingHorizontal: spacing[2],
  },
});
