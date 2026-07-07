import { MoreDestinationScreen } from '@/features/more';

export default function SearchScreen() {
  return (
    <MoreDestinationScreen
      title="검색"
      emptyTitle="검색은 준비 중이에요"
      description="과거 Task, 일정, 완료 기록을 날짜와 키워드로 찾을 수 있도록 API 연결을 준비하고 있어요."
      icon={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
    />
  );
}
