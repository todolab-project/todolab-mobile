import { MoreDestinationScreen } from '@/features/more';

export default function SettingsScreen() {
  return (
    <MoreDestinationScreen
      title="설정"
      description="앱 환경과 정보를 관리할 수 있도록 준비하고 있어요."
      icon={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
    />
  );
}
