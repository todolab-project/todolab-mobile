import { MoreDestinationScreen } from '@/features/more';

export default function SettingsScreen() {
  return (
    <MoreDestinationScreen
      title="설정"
      description="앱 정보와 사용 환경 설정을 이곳에서 관리할 수 있게 됩니다."
      icon={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
    />
  );
}
