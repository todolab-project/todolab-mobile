# 반복 Task·일정 API 요구사항

매주 화요일 09:00 업무 회의처럼 반복되는 Task와 일정을 모바일에서 안전하게 다루기 위한 백엔드 계약이다. 백엔드 구현은 `todolab-backend` 저장소에서 진행한다.

## 핵심 모델

반복 규칙과 실제 occurrence를 분리한다.

- `recurrenceSeriesId`: 반복 묶음의 ID
- `recurrenceRule`: RFC 5545 RRULE 호환 문자열
- `recurrenceTimeZone`: 초기에는 `Asia/Seoul`
- `recurrenceStartAt`: 첫 발생 시각
- `durationMinutes` 또는 시작·종료 시각 차이
- `recurrenceUntil` 또는 `recurrenceCount`: 선택적 종료 조건
- `occurrenceDate`: 조회된 개별 발생 날짜
- `originalOccurrenceDate`: 이동·예외 처리 전 날짜
- `recurrenceException`: `SKIPPED`, `MOVED`, `MODIFIED`

예시:

```json
{
  "title": "업무 회의",
  "type": "SCHEDULE",
  "startAt": "2026-07-07T09:00:00",
  "endAt": "2026-07-07T10:00:00",
  "recurrenceRule": "FREQ=WEEKLY;BYDAY=TU",
  "recurrenceTimeZone": "Asia/Seoul"
}
```

## 조회

- Today와 Calendar 범위 조회는 요청 기간 안의 occurrence를 materialize해서 반환한다.
- 무한 반복을 Task row로 미리 생성하지 않는다.
- 각 occurrence는 같은 `recurrenceSeriesId`와 고유한 `occurrenceDate`를 가진다.
- 완료 상태는 occurrence별로 저장한다.
- 여러 날 반복 일정도 [`API_SCHEDULE_RANGE.md`](./API_SCHEDULE_RANGE.md)의 겹침 규칙을 따른다.

## 수정과 삭제 범위

반복 항목을 변경할 때 사용자가 범위를 선택할 수 있어야 한다.

- `THIS`: 이번 occurrence만
- `THIS_AND_FUTURE`: 이번 occurrence와 이후
- `ALL`: 반복 전체

백엔드 v1 문서의 현재 scope 형태:

```text
PUT    /api/v1/tasks/{id}?recurrenceScope=THIS|THIS_AND_FUTURE|ALL
DELETE /api/v1/tasks/{id}?recurrenceScope=THIS|THIS_AND_FUTURE|ALL
```

백엔드 `RECURRENCE_MODEL.md`와 `API_V1_FRONTEND.md`에는 `POST /api/v1/tasks`의 `recurrence` 생성 계약과 `recurrenceScope` 수정·삭제 계약이 추가되어 있다. 다만 백엔드 상태 문서에는 아직 예전 보류 문구가 남아 있어, 모바일은 조회된 occurrence label 표시까지만 유지하고 반복 생성/수정/삭제 UI는 문서 정합성과 real smoke를 재확인한 뒤 연다.

## 백엔드 확인 항목

- RRULE parser와 validation 범위
- 월말, 윤년, 공휴일을 건너뛰는 규칙 지원 여부
- `POST /api/v1/tasks`의 `recurrence` 생성 계약이 실제 local/staging API에서 통과하는지
- 백엔드 상태 문서의 “반복 생성/수정 API 미제공” 문구가 최신 계약과 정리되었는지
- `PUT /api/v1/tasks/{id}?recurrenceScope=...`를 모바일 수정 UI에서 사용해도 되는 시점
- `DELETE /api/v1/tasks/{id}?recurrenceScope=...`를 모바일 삭제 UI에서 사용해도 되는 시점
- occurrence 완료·미룸·건너뛰기 저장 방식
- 반복 전체 수정 후 기존 완료 기록 보존 방식
- 서울 시간대와 향후 사용자 time zone migration
- 알림 예약 책임은 [`API_NOTIFICATIONS.md`](./API_NOTIFICATIONS.md)에 따라 반복 occurrence 계산은 백엔드, 가까운 미래 로컬 예약은 모바일로 분리
