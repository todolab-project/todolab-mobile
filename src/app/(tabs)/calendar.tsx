import { ComingSoonScreen } from '@/components/navigation';

export default function CalendarScreen() {
  return (
    <ComingSoonScreen
      eyebrow="CALENDAR"
      title="일정을 한눈에"
      description="주간과 월간 흐름을 살펴보고, 날짜별 할 일을 편하게 정리할 수 있게 됩니다."
      icon={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
    />
  );
}
