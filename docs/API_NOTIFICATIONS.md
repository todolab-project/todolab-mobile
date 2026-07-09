# 로컬 알림 요구사항과 백엔드 책임

ToDoLab 모바일 알림은 사용자가 오늘 실제로 실행할 일을 놓치지 않게 돕는 보조 기능이다. 반복 규칙 계산, occurrence 생성, 완료 기록의 원본은 백엔드가 가진다. 모바일은 백엔드가 내려준 구체적인 occurrence와 사용자 설정을 기준으로 기기 로컬 알림을 예약한다.

## 책임 분리

### 백엔드 책임

- 반복 Task·일정의 RRULE을 해석하고 조회 기간 안의 occurrence를 materialize한다.
- occurrence별 `taskId`, `recurrenceSeriesId`, `occurrenceDate`, `startAt`, `endAt`, `status`, `recurrenceException`을 안정적으로 반환한다.
- `THIS`, `THIS_AND_FUTURE`, `ALL` 수정·삭제 이후 알림 대상 occurrence가 어떻게 바뀌었는지 모바일이 다시 동기화할 수 있게 한다.
- 서버 push 알림을 도입하기 전까지는 “알림 예약 대상 후보”만 제공하고, 기기별 알림 예약 상태를 영속 원본으로 보지 않는다.

### 모바일 책임

- 사용자가 허용한 알림 설정과 기기 권한을 확인한다.
- Today, Calendar, 반복 occurrence 조회 결과 중 가까운 미래 항목만 로컬 알림으로 예약한다.
- Task 완료, 미룸, 삭제, occurrence 이동·건너뛰기 후 기존 로컬 알림을 취소하거나 다시 예약한다.
- 앱 재설치, 로그아웃, 권한 해제, time zone 변경 시 로컬 알림을 안전하게 초기화한다.

## MVP 알림 범위

초기 범위는 일정 알림과 오늘 실행 Task 리마인더를 분리한다.

| 대상        | 예약 기준                                    | 기본값                    |
| ----------- | -------------------------------------------- | ------------------------- |
| 시간 일정   | `type=SCHEDULE`, `startAt` 존재, 미완료 상태 | 시작 10분 전              |
| 종일 일정   | `type=SCHEDULE`, `allDay=true`, 미완료 상태  | 당일 오전 9시             |
| 오늘 Task   | `type=TODO`, `plannedDate=오늘`, 미완료 상태 | 기본 꺼짐, 사용자 선택 시 |
| D-Day 목표  | 목표일이 있는 항목 또는 연결 Task            | MVP 이후                  |
| 추천/기록함 | 아직 Today로 선별되지 않은 항목              | 예약하지 않음             |

## 반복 일정 알림 규칙

- 무한 반복 규칙 전체를 기기에 한 번에 예약하지 않는다.
- 모바일은 백엔드가 materialize한 occurrence 중 제한된 window만 예약한다.
  - 권장 window: 오늘부터 14일
  - 앱 foreground 진입, 설정 변경, 날짜 이동 후 다시 동기화한다.
- occurrence가 `SKIPPED`이면 알림을 예약하지 않는다.
- occurrence가 `MOVED` 또는 `MODIFIED`이면 `originalOccurrenceDate`가 아니라 변경된 `startAt` 기준으로 예약한다.
- `THIS_AND_FUTURE`나 `ALL` 수정 후에는 같은 `recurrenceSeriesId`의 기존 예약을 취소하고 최신 occurrence로 재예약한다.

## 필요한 모바일 저장 정보

로컬 알림 예약 결과는 서버 원본이 아니라 기기 캐시다.

```ts
type LocalNotificationSchedule = {
  taskId: number;
  recurrenceSeriesId?: number | null;
  occurrenceDate?: string | null;
  notificationId: string;
  scheduledAt: string;
  sourceUpdatedAt?: string | null;
};
```

## 백엔드 확인 항목

- Today와 Calendar 범위 조회가 반복 occurrence의 최종 `startAt`, `endAt`, `status`, `recurrenceException`을 내려주는지
- 완료·미룸·삭제 후 같은 occurrence가 다음 동기화에서 제외되거나 변경된 상태로 내려오는지
- 사용자 time zone 변경 시 과거 occurrence와 미래 occurrence를 어떻게 재계산할지
- 향후 서버 push 알림을 도입할 경우 로컬 알림과 중복 발송을 어떻게 막을지
