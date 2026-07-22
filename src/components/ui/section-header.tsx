import type { ReactNode } from 'react';
import type { ColorValue } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { radii, spacing } from '@/theme';

import { AppText } from './app-text';

type SectionHeaderProps = {
  title: string;
  description?: string;
  count?: number;
  action?: ReactNode;
  markerColor?: ColorValue;
  markerBorderColor?: ColorValue;
};

export function SectionHeader({
  title,
  description,
  count,
  action,
  markerColor,
  markerBorderColor,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {markerColor ? (
        <View
          style={[
            styles.marker,
            {
              backgroundColor: markerColor,
              borderColor: markerBorderColor ?? markerColor,
            },
          ]}
        >
          <View
            style={[
              styles.markerDot,
              {
                backgroundColor: markerBorderColor ?? markerColor,
              },
            ]}
          />
        </View>
      ) : null}
      <View style={styles.copy}>
        <AppText variant="bodyLarge" weight="bold">
          {title}
        </AppText>
        {description ? (
          <AppText tone="secondary" variant="label">
            {description}
          </AppText>
        ) : null}
      </View>
      <View style={styles.trailing}>
        {count !== undefined ? (
          <AppText tone="secondary" variant="label" weight="semibold">
            {count}개
          </AppText>
        ) : null}
        {action}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  marker: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  markerDot: {
    borderRadius: radii.full,
    height: 7,
    width: 7,
  },
  trailing: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 0,
    gap: spacing[2],
  },
});
