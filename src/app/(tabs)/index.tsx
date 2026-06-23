import { StyleSheet } from 'react-native';

import { Screen } from '@/components/ui';
import { TodayHeader, TodayOverview } from '@/features/today';
import { spacing } from '@/theme';
import { toApiLocalDate } from '@/utils';

export default function TodayScreen() {
  const now = new Date();
  const today = toApiLocalDate(now);

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <TodayHeader now={now} />
      <TodayOverview date={today} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[8],
    paddingTop: spacing[6],
  },
});
