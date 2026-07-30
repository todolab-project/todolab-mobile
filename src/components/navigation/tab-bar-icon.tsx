import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Platform, StyleSheet, View } from 'react-native';
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
  const webName = typeof name === 'object' && name ? name.web : undefined;

  return (
    <View style={[styles.container, focused && { backgroundColor: theme.colors.primarySoft }]}>
      {Platform.OS === 'web' ? (
        <WebTabIcon color={color} name={webName} size={size} />
      ) : (
        <SymbolView
          name={name}
          size={size}
          tintColor={color}
          type="hierarchical"
          weight="semibold"
        />
      )}
    </View>
  );
}

type WebTabIconProps = {
  color: ColorValue;
  name?: string;
  size: number;
};

function WebTabIcon({ color, name, size }: WebTabIconProps) {
  if (name === 'person') {
    return (
      <View accessible={false} style={[styles.webPersonIcon, { height: size, width: size }]}>
        <View style={[styles.webPersonHead, { borderColor: color }]} />
        <View style={[styles.webPersonBody, { borderColor: color }]} />
      </View>
    );
  }

  return (
    <View
      accessible={false}
      style={[styles.webCalendarIcon, { borderColor: color, height: size, width: size }]}
    >
      <View style={[styles.webCalendarBar, { backgroundColor: color }]} />
      {name === 'today' ? <View style={[styles.webTodayDot, { backgroundColor: color }]} /> : null}
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
  webCalendarIcon: {
    borderRadius: radii.sm,
    borderWidth: 2,
    overflow: 'hidden',
  },
  webCalendarBar: {
    height: 4,
    width: '100%',
  },
  webPersonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  webPersonHead: {
    borderRadius: radii.full,
    borderWidth: 2,
    height: 8,
    width: 8,
  },
  webPersonBody: {
    borderTopLeftRadius: radii.full,
    borderTopRightRadius: radii.full,
    borderWidth: 2,
    height: 8,
    marginTop: 2,
    width: 16,
  },
  webTodayDot: {
    borderRadius: radii.full,
    height: 5,
    left: '50%',
    marginLeft: -2.5,
    marginTop: 4,
    width: 5,
  },
});
