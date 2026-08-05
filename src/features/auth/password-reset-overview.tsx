import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, InlineNotice, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

export function PasswordResetOverview() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={[styles.brandMark, { backgroundColor: theme.colors.primarySoft }]}
          >
            <AppText tone="primary" variant="bodyLarge" weight="heavy">
              T
            </AppText>
          </View>
          <AppText variant="label" weight="bold">
            ToDoLab
          </AppText>
        </View>
        <View style={styles.heroCopy}>
          <AppText accessibilityRole="header" variant="display" weight="heavy">
            비밀번호 재설정은
            {'\n'}곧 연결할게요
          </AppText>
          <AppText tone="secondary" variant="body">
            이메일로 재설정 링크를 보내는 흐름을 준비 중이에요. 지금은 가입한 이메일과 비밀번호로
            다시 로그인해 주세요.
          </AppText>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <InlineNotice
          tone="warning"
          title="백엔드 계약 준비 필요"
          message="요청 API, 토큰 검증 API, 새 비밀번호 저장 API가 준비되면 이 화면에서 바로 연결합니다."
        />
        <View style={styles.contractSummary}>
          <AppText variant="label" weight="bold">
            필요한 흐름
          </AppText>
          <AppText tone="secondary" variant="body">
            1. 이메일 입력
            {'\n'}
            2. 재설정 메일 발송
            {'\n'}
            3. 링크 token 검증
            {'\n'}
            4. 새 비밀번호 저장 후 로그인
          </AppText>
        </View>
        <Button fullWidth onPress={() => router.replace('/login' as Href)} size="large">
          로그인으로 돌아가기
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: spacing[5],
    justifyContent: 'center',
    paddingBottom: spacing[8],
    paddingTop: spacing[8],
  },
  hero: {
    gap: spacing[5],
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  brandMark: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  heroCopy: {
    gap: spacing[2],
  },
  card: {
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing[4],
    padding: spacing[4],
  },
  contractSummary: {
    gap: spacing[2],
  },
});
