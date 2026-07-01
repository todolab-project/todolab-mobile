import { StyleSheet, View } from 'react-native';

import { radii, spacing, useAppTheme } from '@/theme';

type ListSkeletonProps = {
  accessibilityLabel: string;
  count?: number;
};

const titleWidths = ['78%', '64%', '86%'] as const;
const metadataWidths = ['42%', '54%', '36%'] as const;

export function ListSkeleton({ accessibilityLabel, count = 3 }: ListSkeletonProps) {
  const theme = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
      style={styles.list}
    >
      {Array.from({ length: count }, (_, index) => (
        <View
          key={index}
          style={[
            styles.row,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <View style={[styles.control, { backgroundColor: theme.colors.surfaceMuted }]} />
          <View style={styles.copy}>
            <View
              style={[
                styles.title,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  width: titleWidths[index % titleWidths.length],
                },
              ]}
            />
            <View
              style={[
                styles.metadata,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  width: metadataWidths[index % metadataWidths.length],
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing[2],
  },
  row: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  control: {
    borderRadius: radii.sm,
    height: 20,
    width: 20,
  },
  copy: {
    flex: 1,
    gap: spacing[2],
  },
  title: {
    borderRadius: radii.sm,
    height: 12,
  },
  metadata: {
    borderRadius: radii.sm,
    height: 8,
  },
});
