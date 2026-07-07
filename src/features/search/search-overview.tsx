import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText, Card, IconButton, InlineNotice, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

const previewFilters = ['전체', '예정', '완료', '일정'];

export function SearchOverview() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader
        title="검색"
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

      <Card variant="sheet" style={styles.searchCard}>
        <View
          style={[
            styles.inputFrame,
            { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border },
          ]}
        >
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor={theme.colors.textMuted}
          />
          <TextInput
            accessibilityLabel="Task, 일정, 완료 기록 검색어"
            accessibilityHint="검색 API가 연결되면 키워드로 과거 기록을 찾을 수 있습니다."
            editable={false}
            placeholder="키워드나 날짜로 찾아보기"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { color: theme.colors.text }]}
          />
        </View>

        <View accessibilityLabel="검색 필터 미리보기" style={styles.filters}>
          {previewFilters.map((filter) => (
            <View
              key={filter}
              style={[
                styles.filterChip,
                {
                  backgroundColor: filter === '전체' ? theme.colors.highlightBlue : 'transparent',
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <AppText tone={filter === '전체' ? 'primary' : 'secondary'} variant="caption">
                {filter}
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <InlineNotice message="검색 API가 연결되면 제목·설명·상태·종류·날짜 범위로 Task와 일정을 찾을 수 있어요." />

      <Card variant="outlined" style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyLarge" weight="bold">
            준비 중인 검색 범위
          </AppText>
          <AppText tone="secondary" variant="caption">
            API 연결 후 순서대로 활성화해요.
          </AppText>
        </View>

        <View style={styles.scopeList}>
          <SearchScopeRow
            icon={{ ios: 'checklist', android: 'checklist', web: 'checklist' }}
            title="Task"
            description="오늘 할 일, 정리할 항목, D-Day 연결 Task"
          />
          <SearchScopeRow
            icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            title="일정"
            description="시간 일정과 여러 날에 걸친 일정"
          />
          <SearchScopeRow
            icon={{ ios: 'checkmark.circle', android: 'task_alt', web: 'task_alt' }}
            title="완료 기록"
            description="언제 끝냈는지와 관련 날짜"
          />
        </View>
      </Card>
    </Screen>
  );
}

type SearchScopeRowProps = {
  icon: ComponentProps<typeof SymbolView>['name'];
  title: string;
  description: string;
};

function SearchScopeRow({ icon, title, description }: SearchScopeRowProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.scopeRow}>
      <View style={[styles.scopeIcon, { backgroundColor: theme.colors.highlightSage }]}>
        <SymbolView name={icon} size={16} tintColor={theme.colors.success} />
      </View>
      <View style={styles.scopeCopy}>
        <AppText weight="medium">{title}</AppText>
        <AppText tone="secondary" variant="caption">
          {description}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[3],
  },
  searchCard: {
    gap: spacing[3],
  },
  inputFrame: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing[2],
    minHeight: 48,
    paddingHorizontal: spacing[3],
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: spacing[2],
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  filterChip: {
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  section: {
    gap: spacing[4],
  },
  sectionHeader: {
    gap: spacing[1],
  },
  scopeList: {
    gap: spacing[2],
  },
  scopeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 52,
  },
  scopeIcon: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  scopeCopy: {
    flex: 1,
    gap: spacing[1],
  },
});
