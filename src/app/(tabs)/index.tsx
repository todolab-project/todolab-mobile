import { StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { TodayHeader } from '@/features/today';
import { spacing } from '@/theme';

export default function TodayScreen() {
  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <TodayHeader />

      <View style={styles.section}>
        <AppText variant="bodyLarge" weight="bold">
          오늘의 흐름
        </AppText>
        <Card variant="muted" style={styles.card}>
          <AppText tone="secondary">
            곧 오늘 할 일과 일정을 이곳에서 한눈에 확인할 수 있어요.
          </AppText>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[8],
    paddingTop: spacing[6],
  },
  section: {
    gap: spacing[3],
  },
  card: {
    borderWidth: 0,
  },
});
