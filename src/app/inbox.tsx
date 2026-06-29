import { MoreDestinationScreen } from '@/features/more';

export default function InboxScreen() {
  return (
    <MoreDestinationScreen
      title="기록함"
      description="다음 단계에서 날짜 없는 기록의 전체 목록과 카테고리 그룹을 연결합니다."
      icon={{ ios: 'tray.full.fill', android: 'inbox', web: 'inbox' }}
    />
  );
}
