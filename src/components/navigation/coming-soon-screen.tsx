import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, EmptyState, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type ComingSoonScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: SymbolViewProps['name'];
};

export function ComingSoonScreen({
  eyebrow,
  title,
  description,
  icon,
}: ComingSoonScreenProps) {
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppText tone="primary" variant="label" weight="bold">
          {eyebrow}
        </AppText>
        <AppText variant="title" weight="bold">
          {title}
        </AppText>
      </View>

      <Card style={styles.card}>
        <EmptyState
          icon={
            <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
              <SymbolView
                name={icon}
                size={30}
                tintColor={theme.colors.primary}
                type="hierarchical"
              />
            </View>
          }
          title="차근차근 준비하고 있어요"
          description={description}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[6],
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[1],
  },
  card: {
    paddingHorizontal: 0,
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
});
