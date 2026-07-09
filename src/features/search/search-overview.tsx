import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  EmptyState,
  IconButton,
  InlineNotice,
  ListSkeleton,
  PageHeader,
  Screen,
} from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskSearchItem, TaskSearchQuery, TaskType } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { useTaskSearch } from './use-task-search';

type SearchFilter = 'ALL' | 'PLANNED' | 'DONE' | 'SCHEDULE';
type DateRangeFilter = 'ALL' | '7D' | '30D' | 'MONTH';
type DdayFilter = 'ALL' | 'LINKED' | 'UNLINKED';

const searchFilters: { value: SearchFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PLANNED', label: '예정' },
  { value: 'DONE', label: '완료' },
  { value: 'SCHEDULE', label: '일정' },
];

const dateRangeFilters: { value: DateRangeFilter; label: string }[] = [
  { value: 'ALL', label: '전체 기간' },
  { value: '7D', label: '최근 7일' },
  { value: '30D', label: '최근 30일' },
  { value: 'MONTH', label: '이번 달' },
];

const ddayFilters: { value: DdayFilter; label: string }[] = [
  { value: 'ALL', label: 'D-Day 전체' },
  { value: 'LINKED', label: 'D-Day 연결' },
  { value: 'UNLINKED', label: 'D-Day 없음' },
];

const dateSourceLabels: Record<TaskSearchItem['dateSource'], string> = {
  PLANNED: '예정',
  SCHEDULED: '일정',
  COMPLETED: '완료',
  CREATED: '생성',
};

export function SearchOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<SearchFilter>('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeFilter>('ALL');
  const [selectedDdayFilter, setSelectedDdayFilter] = useState<DdayFilter>('ALL');
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  const deferredKeyword = useDeferredValue(keyword.trim());
  const today = toApiLocalDate();
  const dateRangeQuery = useMemo(
    () => getDateRangeQuery(selectedDateRange, today),
    [selectedDateRange, today],
  );
  const ddayQuery = useMemo(() => getDdayQuery(selectedDdayFilter), [selectedDdayFilter]);
  const searchQuery = useMemo<TaskSearchQuery>(() => {
    const baseQuery = {
      q: deferredKeyword || undefined,
      ...dateRangeQuery,
      ...ddayQuery,
      limit: 20,
    };

    if (selectedFilter === 'PLANNED') {
      return {
        ...baseQuery,
        statuses: ['INBOX', 'TODAY'],
      };
    }

    if (selectedFilter === 'DONE') {
      return {
        ...baseQuery,
        statuses: ['DONE'],
      };
    }

    if (selectedFilter === 'SCHEDULE') {
      return {
        ...baseQuery,
        taskTypes: ['SCHEDULE'],
      };
    }

    return baseQuery;
  }, [dateRangeQuery, ddayQuery, deferredKeyword, selectedFilter]);
  const search = useTaskSearch(searchQuery);
  const results = search.data?.items ?? [];
  const hasKeyword = keyword.trim().length > 0;
  const selectedFilterLabel =
    searchFilters.find((filter) => filter.value === selectedFilter)?.label ?? '전체';
  const selectedDateRangeLabel =
    dateRangeFilters.find((filter) => filter.value === selectedDateRange)?.label ?? '전체 기간';
  const selectedDdayFilterLabel =
    ddayFilters.find((filter) => filter.value === selectedDdayFilter)?.label ?? 'D-Day 전체';
  const baseSummary = hasKeyword
    ? `“${keyword.trim()}” · ${selectedFilterLabel}`
    : `${selectedFilterLabel} 기록`;
  const activeExtraFilters = [
    selectedDateRange === 'ALL' ? null : selectedDateRangeLabel,
    selectedDdayFilter === 'ALL' ? null : selectedDdayFilterLabel,
  ].filter((value): value is string => Boolean(value));
  const searchSummary =
    activeExtraFilters.length > 0
      ? `${baseSummary} · ${activeExtraFilters.join(' · ')}`
      : baseSummary;
  const resultDescription = search.isFetching
    ? '검색 결과를 업데이트하고 있어요.'
    : hasKeyword
      ? `${searchSummary}에서 찾은 항목이에요.`
      : `${searchSummary}을 최근 관련 날짜 순으로 보여줘요.`;

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
            {
              backgroundColor: theme.colors.surfaceMuted,
              borderColor: focusedElement === 'input' ? theme.colors.primary : theme.colors.border,
              borderWidth: focusedElement === 'input' ? 2 : StyleSheet.hairlineWidth,
            },
          ]}
        >
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={18}
            tintColor={theme.colors.textMuted}
          />
          <TextInput
            accessibilityLabel="Task, 일정, 완료 기록 검색어"
            accessibilityHint="키워드로 과거 Task, 일정, 완료 기록을 찾습니다."
            autoCapitalize="none"
            onBlur={() => setFocusedElement(null)}
            onChangeText={setKeyword}
            onFocus={() => setFocusedElement('input')}
            placeholder="키워드나 날짜로 찾아보기"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { color: theme.colors.text }]}
            value={keyword}
          />
          {hasKeyword ? (
            <Pressable
              accessibilityLabel="검색어 지우기"
              accessibilityRole="button"
              hitSlop={4}
              onBlur={() => setFocusedElement(null)}
              onFocus={() => setFocusedElement('clear')}
              onPress={() => setKeyword('')}
              style={[
                styles.clearButton,
                {
                  backgroundColor:
                    focusedElement === 'clear' ? theme.colors.primarySoft : 'transparent',
                  borderColor: focusedElement === 'clear' ? theme.colors.primary : 'transparent',
                },
              ]}
            >
              <AppText tone="secondary" variant="label" weight="bold">
                ×
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <View accessibilityLabel="검색 필터" style={styles.filters}>
          {searchFilters.map((filter) => {
            const selected = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                accessibilityLabel={`${filter.label} 검색 필터`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onBlur={() => setFocusedElement(null)}
                onFocus={() => setFocusedElement(filter.value)}
                onPress={() => setSelectedFilter(filter.value)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selected ? theme.colors.highlightBlue : 'transparent',
                    borderColor:
                      focusedElement === filter.value || selected
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderWidth: focusedElement === filter.value ? 2 : StyleSheet.hairlineWidth,
                  },
                ]}
              >
                <AppText tone={selected ? 'primary' : 'secondary'} variant="caption">
                  {filter.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.filterGroup}>
          <AppText tone="secondary" variant="caption" weight="semibold">
            기간
          </AppText>
          <View accessibilityLabel="검색 날짜 범위" style={styles.filters}>
            {dateRangeFilters.map((filter) => {
              const selected = selectedDateRange === filter.value;
              const focusKey = `date-${filter.value}`;

              return (
                <Pressable
                  key={filter.value}
                  accessibilityLabel={`${filter.label} 검색 기간`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onBlur={() => setFocusedElement(null)}
                  onFocus={() => setFocusedElement(focusKey)}
                  onPress={() => setSelectedDateRange(filter.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selected ? theme.colors.highlightAmber : 'transparent',
                      borderColor:
                        focusedElement === focusKey || selected
                          ? theme.colors.warning
                          : theme.colors.border,
                      borderWidth: focusedElement === focusKey ? 2 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <AppText tone={selected ? 'warning' : 'secondary'} variant="caption">
                    {filter.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.filterGroup}>
          <AppText tone="secondary" variant="caption" weight="semibold">
            D-Day
          </AppText>
          <View accessibilityLabel="D-Day 연결 검색 필터" style={styles.filters}>
            {ddayFilters.map((filter) => {
              const selected = selectedDdayFilter === filter.value;
              const focusKey = `dday-${filter.value}`;

              return (
                <Pressable
                  key={filter.value}
                  accessibilityLabel={`${filter.label} 검색 필터`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onBlur={() => setFocusedElement(null)}
                  onFocus={() => setFocusedElement(focusKey)}
                  onPress={() => setSelectedDdayFilter(filter.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selected ? theme.colors.highlightSage : 'transparent',
                      borderColor:
                        focusedElement === focusKey || selected
                          ? theme.colors.success
                          : theme.colors.border,
                      borderWidth: focusedElement === focusKey ? 2 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <AppText tone={selected ? 'success' : 'secondary'} variant="caption">
                    {filter.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.searchMetaRow}>
          <View style={[styles.searchMetaPill, { backgroundColor: theme.colors.highlightSage }]}>
            <AppText tone="success" variant="caption" weight="semibold">
              {searchSummary}
            </AppText>
          </View>
          <AppText tone="secondary" variant="caption">
            mock 검색
          </AppText>
        </View>
      </Card>

      {search.error ? (
        <InlineNotice
          tone="danger"
          message={search.error.message}
          action={
            <Button size="compact" variant="ghost" onPress={() => void search.refetch()}>
              재시도
            </Button>
          }
        />
      ) : null}

      <Card variant="outlined" style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <AppText variant="bodyLarge" weight="bold">
              검색 결과
            </AppText>
            <AppText tone="secondary" variant="caption">
              {results.length}개
            </AppText>
          </View>
          <AppText tone="secondary" variant="caption">
            {resultDescription}
          </AppText>
        </View>

        {search.isLoading ? (
          <ListSkeleton accessibilityLabel="검색 결과를 불러오는 중" count={3} />
        ) : results.length === 0 ? (
          <EmptyState
            title="찾은 항목이 없어요"
            description="검색어를 줄이거나 전체 필터로 다시 확인해 보세요."
          />
        ) : (
          <View style={styles.resultList}>
            {results.map((item) => (
              <SearchResultRow
                key={item.task.id}
                item={item}
                focused={focusedElement === `result-${item.task.id}`}
                onBlur={() => setFocusedElement(null)}
                onFocus={() => setFocusedElement(`result-${item.task.id}`)}
                onPress={() =>
                  router.push({
                    pathname: '/tasks/[taskId]',
                    params: { taskId: String(item.task.id) },
                  })
                }
              />
            ))}
          </View>
        )}
      </Card>

      <Card variant="outlined" style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyLarge" weight="bold">
            다음 연결 예정
          </AppText>
          <AppText tone="secondary" variant="caption">
            백엔드 검색 API 확정 후 더 정교하게 열어요.
          </AppText>
        </View>

        <View style={styles.scopeList}>
          <SearchScopeRow
            icon={{ ios: 'calendar.badge.clock', android: 'date_range', web: 'date_range' }}
            title="직접 기간"
            description="시작일과 종료일을 직접 고르는 검색"
          />
          <SearchScopeRow
            icon={{ ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' }}
            title="상세 필터"
            description="카테고리와 세부 날짜 기준"
          />
          <SearchScopeRow
            icon={{ ios: 'arrow.down.doc', android: 'more_horiz', web: 'more_horiz' }}
            title="페이지 이어보기"
            description="긴 기록을 cursor 기반으로 계속 불러오기"
          />
        </View>
      </Card>
    </Screen>
  );
}

type SearchResultRowProps = {
  item: TaskSearchItem;
  focused: boolean;
  onBlur: () => void;
  onFocus: () => void;
  onPress: () => void;
};

function SearchResultRow({ item, focused, onBlur, onFocus, onPress }: SearchResultRowProps) {
  const theme = useAppTheme();
  const typeLabel = getTaskTypeLabel(item.task.type);

  return (
    <Pressable
      accessibilityLabel={`${item.task.title}, ${dateSourceLabels[item.dateSource]} ${formatDateLabel(
        item.relevantDate,
      )}, 상세 보기`}
      accessibilityRole="button"
      onBlur={onBlur}
      onFocus={onFocus}
      onPress={onPress}
      style={({ pressed }) => [
        styles.resultRow,
        {
          backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
          borderColor: focused ? theme.colors.primary : theme.colors.border,
          borderWidth: focused ? 2 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.resultCopy}>
        <AppText numberOfLines={2} weight="medium">
          {item.task.title}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {dateSourceLabels[item.dateSource]} ·{' '}
          {formatDateLabel(item.relevantDate, { month: 'long', day: 'numeric', weekday: 'short' })}{' '}
          · {typeLabel}
          {item.task.category ? ` · ${item.task.category}` : ''}
        </AppText>
      </View>
      <AppText tone="muted" variant="bodyLarge">
        ›
      </AppText>
    </Pressable>
  );
}

function getTaskTypeLabel(type: TaskType) {
  if (type === 'SCHEDULE') return '일정';
  if (type === 'IDEA') return '아이디어';

  return 'Task';
}

function getDateRangeQuery(
  filter: DateRangeFilter,
  today: LocalDateString,
): Pick<TaskSearchQuery, 'dateField' | 'dateFrom' | 'dateTo'> {
  if (filter === '7D') {
    return {
      dateField: 'RELEVANT',
      dateFrom: shiftLocalDate(today, -6) ?? today,
      dateTo: today,
    };
  }

  if (filter === '30D') {
    return {
      dateField: 'RELEVANT',
      dateFrom: shiftLocalDate(today, -29) ?? today,
      dateTo: today,
    };
  }

  if (filter === 'MONTH') {
    return {
      dateField: 'RELEVANT',
      dateFrom: `${today.slice(0, 7)}-01` as LocalDateString,
      dateTo: today,
    };
  }

  return {};
}

function getDdayQuery(filter: DdayFilter): Pick<TaskSearchQuery, 'hasDday'> {
  if (filter === 'LINKED') {
    return { hasDday: true };
  }

  if (filter === 'UNLINKED') {
    return { hasDday: false };
  }

  return {};
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
  clearButton: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  filterGroup: {
    gap: spacing[2],
  },
  filterChip: {
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  searchMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  searchMetaPill: {
    borderRadius: radii.full,
    flexShrink: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  section: {
    gap: spacing[4],
  },
  sectionHeader: {
    gap: spacing[1],
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultList: {
    gap: spacing[1],
  },
  resultRow: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  resultCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
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
