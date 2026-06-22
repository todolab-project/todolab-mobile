import { ComingSoonScreen } from '@/components/navigation';

export default function DdayScreen() {
  return (
    <ComingSoonScreen
      eyebrow="D-DAY"
      title="목표까지 한 걸음씩"
      description="중요한 목표와 남은 날짜를 확인하고, 오늘 실행할 일을 연결할 수 있게 됩니다."
      icon={{ ios: 'flag.fill', android: 'flag', web: 'flag' }}
    />
  );
}
