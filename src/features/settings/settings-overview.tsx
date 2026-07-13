import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, IconButton, PageHeader, Screen } from '@/components/ui';
import { env } from '@/config';
import { getAccessToken, subscribeAccessToken } from '@/services/api';
import { radii, spacing, useAppTheme } from '@/theme';

type SettingsRowProps = {
  label: string;
  value: string;
  tone?: 'default' | 'secondary' | 'warning' | 'success';
};

export function SettingsOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const [accessToken, setAccessToken] = useState(() => getAccessToken());
  const apiModeLabel = env.apiMode === 'real' ? 'real' : 'mock';
  const apiModeTone = env.apiMode === 'real' ? 'success' : 'warning';
  const hasAccessToken = Boolean(accessToken);

  useEffect(() => subscribeAccessToken(setAccessToken), []);

  return (
    <Screen contentContainerStyle={styles.screen}>
      <PageHeader
        title="설정"
        leading={
          <IconButton accessibilityLabel="프로필 화면으로 돌아가기" onPress={router.back}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />

      <Card variant="outlined" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.icon, { backgroundColor: theme.colors.highlightBlue }]}>
            <SymbolView
              name={{ ios: 'network', android: 'settings_ethernet', web: 'settings_ethernet' }}
              size={18}
              tintColor={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              API 연결
            </AppText>
            <AppText tone="secondary" variant="caption">
              실사용 전 현재 앱이 연결할 백엔드 대상을 확인합니다.
            </AppText>
          </View>
        </View>

        <View style={styles.rows}>
          <SettingsRow label="모드" tone={apiModeTone} value={apiModeLabel} />
          <SettingsRow label="API URL" value={env.apiUrl ?? '미설정'} />
          <SettingsRow label="Access Token" value={hasAccessToken ? '저장됨' : '없음'} />
        </View>
      </Card>
    </Screen>
  );
}

function SettingsRow({ label, value, tone = 'default' }: SettingsRowProps) {
  return (
    <View style={styles.row}>
      <AppText tone="secondary" variant="caption">
        {label}
      </AppText>
      <AppText align="right" numberOfLines={2} tone={tone} weight="medium" style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[3],
  },
  section: {
    gap: spacing[4],
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sectionCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  rows: {
    gap: spacing[2],
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    minHeight: 36,
  },
  value: {
    flex: 1,
  },
});
