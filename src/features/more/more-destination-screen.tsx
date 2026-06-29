import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type MoreDestinationScreenProps = {
  title: string;
  description: string;
  icon: SymbolViewProps['name'];
};

export function MoreDestinationScreen({ title, description, icon }: MoreDestinationScreenProps) {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Button accessibilityLabel="More 화면으로 돌아가기" variant="ghost" onPress={router.back}>
          ← 돌아가기
        </Button>
        <AppText variant="title" weight="heavy">
          {title}
        </AppText>
      </View>
      <Card>
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
    gap: spacing[5],
    paddingTop: spacing[3],
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
});
