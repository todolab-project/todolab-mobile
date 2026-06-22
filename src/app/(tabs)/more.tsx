import { ComingSoonScreen } from '@/components/navigation';

export default function MoreScreen() {
  return (
    <ComingSoonScreen
      eyebrow="MORE"
      title="기록과 설정"
      description="기록함, 완료 로그와 앱 설정을 이곳에서 차분하게 관리할 수 있게 됩니다."
      icon={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
    />
  );
}
