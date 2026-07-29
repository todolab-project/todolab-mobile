# 반복 Task·일정 API 요구사항

매주 화요일 09:00 업무 회의처럼 반복되는 Task와 일정을 모바일에서 안전하게 다루기 위한 백엔드 계약이다. 백엔드 구현은 `todolab-backend` 저장소에서 진행한다.

## 핵심 모델

반복 규칙과 실제 occurrence를 분리한다.

- `recurrenceSeriesId`: 반복 묶음의 ID
- `recurrence`: 반복 series 상세 객체
- `recurrence.recurrenceRule`: RFC 5545 RRULE 호환 문자열
- `recurrence.timeZone`: 초기에는 `Asia/Seoul`
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
  "recurrence": {
    "frequency": "WEEKLY",
    "interval": 1,
    "byDays": ["TU"]
  }
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

백엔드 `RECURRENCE_MODEL.md`, `API_V1_FRONTEND.md`, `MOBILE_API_BACKEND_STATUS.md` 기준으로 `POST /api/v1/tasks`의 `recurrence` 생성 계약과 `recurrenceScope` 수정·삭제 계약이 구현 상태로 정리되었다. 모바일은 nested `recurrence` 응답과 `recurrenceScope` query를 받을 수 있게 기반 타입/API를 맞춘 뒤, real smoke로 생성·조회·scope 수정·삭제를 확인하고 UI를 연다.

2026-07-29 local real smoke 결과:

- `POST /api/v1/tasks` 반복 일정 생성과 nested `recurrence` 응답은 통과했다.
- `DELETE /api/v1/tasks/{id}?recurrenceScope=ALL` cleanup은 통과했다.
- `GET /api/v1/tasks/today?date=2026-08-04`에서 HTTP 500, error code `99999`가 발생했다.
- 따라서 반복 생성 UI는 아직 열지 않고, 백엔드 Today/Calendar occurrence 조회 path가 수정된 뒤 `npm run smoke:recurrence:real`을 재실행한다.

## 백엔드 확인 항목

- RRULE parser와 validation 범위
- 월말, 윤년, 공휴일을 건너뛰는 규칙 지원 여부
- `POST /api/v1/tasks`의 `recurrence` 생성 계약이 실제 local/staging API에서 통과하는지
- 모바일 `TaskUpsertRequest.recurrence`가 `frequency`, `interval`, `byDays`, `byMonthDays`, `recurrenceUntil`, `recurrenceCount`를 올바르게 보내는지
- `PUT /api/v1/tasks/{id}?recurrenceScope=...`의 `THIS`, `THIS_AND_FUTURE`, `ALL` 결과가 화면 cache와 맞는지
- `DELETE /api/v1/tasks/{id}?recurrenceScope=...`의 `SKIPPED` marker와 Today/Calendar 재조회 결과가 맞는지
- occurrence 완료·미룸·건너뛰기 저장 방식
- 반복 전체 수정 후 기존 완료 기록 보존 방식
- 서울 시간대와 향후 사용자 time zone migration
- 알림 예약 책임은 [`API_NOTIFICATIONS.md`](./API_NOTIFICATIONS.md)에 따라 반복 occurrence 계산은 백엔드, 가까운 미래 로컬 예약은 모바일로 분리
