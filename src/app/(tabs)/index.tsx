import { KeyboardAvoidingView, Platform, RefreshControl, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui';
import { QuickCapture, TodayOverview, TodayWeekStrip, useTodayOverview } from '@/features/today';
import { spacing, useAppTheme } from '@/theme';
import { toApiLocalDate } from '@/utils';

export default function TodayScreen() {
  const theme = useAppTheme();
  const now = new Date();
  const today = toApiLocalDate(now);
  const overview = useTodayOverview(today);

  return (
    <View style={styles.container}>
      <Screen
        scroll
        contentContainerStyle={styles.screen}
        scrollViewProps={{
          keyboardShouldPersistTaps: 'handled',
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
        <TodayWeekStrip today={today} />
        <TodayOverview date={today} overview={overview} />
      </Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.quickCaptureLayer}
      >
        <QuickCapture />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    gap: spacing[4],
    paddingBottom: 88,
    paddingTop: spacing[4],
  },
  quickCaptureLayer: {
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    pointerEvents: 'box-none',
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
