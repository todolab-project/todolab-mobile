import { RefreshControl, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui';
import { QuickCapture, TodayHeader, TodayOverview, useTodayOverview } from '@/features/today';
import { spacing, useAppTheme } from '@/theme';
import { toApiLocalDate } from '@/utils';

export default function TodayScreen() {
  const theme = useAppTheme();
  const now = new Date();
  const today = toApiLocalDate(now);
  const overview = useTodayOverview(today);

  return (
    <Screen
      scroll
      contentContainerStyle={styles.screen}
      scrollViewProps={{
        refreshControl: (
          <RefreshControl
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
            refreshing={!overview.isPending && overview.isRefreshing}
            tintColor={theme.colors.primary}
            onRefresh={() => void overview.refetch()}
          />
        ),
      }}
    >
      <TodayHeader now={now} />
      <QuickCapture />
      <TodayOverview date={today} overview={overview} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[8],
    paddingTop: spacing[6],
  },
});
