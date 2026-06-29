import { MoreDestinationScreen } from '@/features/more';

export default function CompletedScreen() {
  return (
    <MoreDestinationScreen
      title="완료 기록"
      description="완료한 일을 일별·주별로 차분하게 돌아볼 수 있도록 준비하고 있어요."
      icon={{ ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' }}
    />
  );
}
