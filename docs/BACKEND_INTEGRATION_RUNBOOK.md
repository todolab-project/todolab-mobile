# 백엔드 연동 Runbook

이 문서는 ToDoLab Mobile을 실제 백엔드와 붙이기 전에 프론트엔드 기준으로 확인해야 할 환경, API 계약, smoke test 순서를 정리한다. 백엔드 구현 변경은 `todolab-backend` 저장소에서 진행하고, 이 저장소에서는 클라이언트 요구 사항과 검증 결과만 관리한다.

## 1. 환경 모드

로컬 UI 개발과 실제 연동 테스트는 `EXPO_PUBLIC_API_MODE`로 분리한다.

| 모드   | 설정                        | 목적                                         |
| ------ | --------------------------- | -------------------------------------------- |
| `mock` | `EXPO_PUBLIC_API_MODE=mock` | 백엔드 없이 in-memory dummy data로 화면 확인 |
| `real` | `EXPO_PUBLIC_API_MODE=real` | `EXPO_PUBLIC_API_URL`의 실제 API와 연동      |

```dotenv
EXPO_PUBLIC_API_MODE=real
EXPO_PUBLIC_API_URL=http://localhost:8080
```

플랫폼별 로컬 API 주소는 다음 기준을 따른다.

| 실행 환경             | API URL 예시                     |
| --------------------- | -------------------------------- |
| Web, iOS Simulator    | `http://localhost:8080`          |
| Android Emulator      | `http://10.0.2.2:8080`           |
| 실제 Android/iOS 기기 | `http://<개발 PC의 LAN IP>:8080` |

`EXPO_PUBLIC_*` 값은 앱 번들에 포함되므로 토큰, 비밀번호, 서버 secret, API key를 넣지 않는다.

## 2. 공통 API 응답 계약

real API 응답은 공통 envelope을 사용해야 한다.

```ts
type ApiEnvelope<T> = {
  status: 'success' | 'fail';
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  timestamp: string;
};
```

- 성공 응답은 `status: "success"`와 `data`를 내려준다.
- 실패 응답은 HTTP status와 함께 `status: "fail"`, `error.code`, `error.message`를 내려준다.
- body가 없는 성공 응답은 `204 No Content`만 허용한다.
- envelope이 없거나 JSON parsing이 실패하면 모바일은 invalid response로 처리한다.
- 기본 timeout은 10초다.

## 3. 인증 계약

모바일은 로그인 성공 시 `accessToken`만 로컬 token store에 저장하고, 이후 요청에 `Authorization: Bearer <accessToken>`을 자동 첨부한다.

| Method | Path                    | 용도               |
| ------ | ----------------------- | ------------------ |
| `POST` | `/api/v1/auth/register` | 회원가입           |
| `POST` | `/api/v1/auth/login`    | 로그인, token 저장 |
| `GET`  | `/api/v1/auth/me`       | 현재 사용자 확인   |

`POST /api/v1/auth/login` 응답은 다음 필드를 포함해야 한다.

- `tokenType: "Bearer"`
- `accessToken`
- `expiresAt`
- `user`

401 응답을 받으면 모바일은 access token을 삭제하고 세션 만료 상태로 전환한다. refresh token 흐름은 현재 모바일 계약에 포함되어 있지 않다.

## 4. 현재 모바일이 호출하는 Task API

| Method   | Path                                  | Query / Body 핵심                   | 사용 화면                 |
| -------- | ------------------------------------- | ----------------------------------- | ------------------------- |
| `GET`    | `/api/v1/tasks`                       | `type`, `taskType?`, `date`         | Calendar 범위 조회        |
| `GET`    | `/api/v1/tasks/search`                | 검색어, 상태, 유형, 기간, cursor 등 | Search                    |
| `GET`    | `/api/v1/tasks/{taskId}`              | -                                   | 상세                      |
| `POST`   | `/api/v1/tasks`                       | `TaskUpsertRequest`                 | 빠른 기록, Task 작성      |
| `PUT`    | `/api/v1/tasks/{taskId}`              | `TaskUpsertRequest`                 | Task 수정                 |
| `DELETE` | `/api/v1/tasks/{taskId}`              | -                                   | Task 삭제                 |
| `GET`    | `/api/v1/tasks/today`                 | `date=YYYY-MM-DD`                   | Today                     |
| `GET`    | `/api/v1/tasks/today/recommendations` | `date=YYYY-MM-DD`                   | 정리할 항목 추천          |
| `GET`    | `/api/v1/tasks/done`                  | `date=YYYY-MM-DD`                   | 오늘 완료한 일, Completed |
| `GET`    | `/api/v1/tasks/stale`                 | -                                   | 정리할 항목, 지난 미완료  |
| `GET`    | `/api/v1/tasks/inbox`                 | -                                   | 정리할 항목, 기록함       |
| `PATCH`  | `/api/v1/tasks/{taskId}/done`         | -                                   | 완료 처리                 |
| `PATCH`  | `/api/v1/tasks/{taskId}/today`        | `date=YYYY-MM-DD`                   | 오늘로 이동               |
| `PATCH`  | `/api/v1/tasks/{taskId}/inbox`        | -                                   | 기록함으로 이동           |
| `PATCH`  | `/api/v1/tasks/{taskId}/today-order`  | `date`, `direction=UP\|DOWN`        | Today 순서 변경           |
| `PATCH`  | `/api/v1/tasks/{taskId}/defer-reason` | `reason`                            | 미루는 이유               |
| `DELETE` | `/api/v1/tasks/{taskId}/defer-reason` | -                                   | 미루는 이유 해제          |
| `PATCH`  | `/api/v1/tasks/{taskId}/dday-goal`    | `ddayGoalId`                        | D-Day 연결                |
| `DELETE` | `/api/v1/tasks/{taskId}/dday-goal`    | -                                   | D-Day 연결 해제           |
| `PATCH`  | `/api/v1/tasks/{taskId}/done/cancel`  | `date=YYYY-MM-DD`                   | 완료 다시 열기            |

`TaskResponse`는 `src/types/task.ts`를 기준으로 맞춘다. 특히 다음 필드는 Today와 Calendar UI에서 중요하다.

- `type`: `SCHEDULE`, `TODO`, `IDEA`
- `status`: `INBOX`, `TODAY`, `DONE`
- `startAt`, `endAt`, `allDay`, `plannedDate`, `targetDate`, `completedAt`
- `todayOrder`
- `ddayGoalId`, `ddayGoalTitle`, `ddayGoalTargetDate`, `ddayDaysLeft`
- 반복 일정 필드: `recurrenceSeriesId`, `recurrenceRule`, `occurrenceDate`, `recurrenceException`

## 5. 현재 모바일이 호출하는 D-Day API

| Method   | Path                                | 용도                   |
| -------- | ----------------------------------- | ---------------------- |
| `GET`    | `/api/v1/dday-goals`                | D-Day 목표 목록        |
| `POST`   | `/api/v1/dday-goals`                | D-Day 목표 생성        |
| `GET`    | `/api/v1/dday-goals/{goalId}`       | D-Day 목표 상세        |
| `DELETE` | `/api/v1/dday-goals/{goalId}`       | D-Day 목표 삭제        |
| `GET`    | `/api/v1/dday-goals/{goalId}/tasks` | 목표 연결 Task         |
| `POST`   | `/api/v1/dday-goals/{goalId}/tasks` | 목표용 Today Task 생성 |

삭제 성공 응답:

- 모바일은 `data: null`, `data: 42`, `data: { "id": 42 }`를 성공으로 처리할 수 있게 열어 둔다.
- 백엔드는 store/API 문서 기준으로 `data: null` 또는 삭제된 ID 중 하나를 최종 표준으로 정한다.
- 실패 시에는 공통 오류 envelope을 유지하고, 이미 삭제된 목표는 404 또는 멱등 200 중 하나로 정책을 정한다.

## 6. 백엔드에서 우선 확인해야 할 항목

1. 인증
   - 회원가입, 로그인, 내 정보 조회가 envelope으로 응답하는지
   - 로그인 token이 `Authorization: Bearer`로 정상 인증되는지
   - 401 응답에서 모바일이 세션 만료로 전환되는지
2. Today
   - `GET /api/v1/tasks/today?date=...`가 오늘의 `SCHEDULE`을 먼저, 이후 오늘 할 일을 안정적으로 내려주는지
   - 시간이 있는 당일 일정과 여러 날 일정이 모두 포함되는지
   - 완료, 다시 열기, 오늘로 이동 뒤 관련 목록이 일관되게 갱신되는지
3. Calendar
   - `GET /api/v1/tasks?type=MONTH&date=...`가 해당 월 grid에 필요한 일정 범위를 내려주는지
   - 당일 일정도 하루짜리 bar로 표현할 수 있게 `startAt`/`endAt`이 안정적인지
   - 여러 날 일정이 구간 내 날짜별로 중복·누락 없이 표현되는지
4. Search
   - `statuses`, `taskTypes`는 comma-separated query string으로 받는지
   - `cursor`, `limit`, `hasNext`, `nextCursor` pagination이 동작하는지
   - 날짜 filter의 timezone 기준이 `Asia/Seoul`과 어긋나지 않는지
5. D-Day
   - 목표 상세 조회와 목표 Task 생성에서 500이 발생하지 않는지
   - Task와 D-Day 연결/해제가 양쪽 화면에 일관되게 반영되는지
6. 반복 일정
   - `API_RECURRENCE.md`의 series, occurrence, exception 계약 확정 전까지 작성·수정 저장 기능은 제한한다.

## 7. real 모드 smoke test 순서

1. `npm run validate`
2. `.env.local` 설정
   - Web 또는 iOS Simulator: `EXPO_PUBLIC_API_URL=http://localhost:8080`
   - Android Emulator: `EXPO_PUBLIC_API_URL=http://10.0.2.2:8080`
   - 실제 기기: `EXPO_PUBLIC_API_URL=http://<개발 PC LAN IP>:8080`
3. 앱 재기동
4. Auth
   - 회원가입 → 로그인 → 프로필 email 표시 → 로그아웃
   - 만료 token 또는 비로그인 상태에서 401 처리 확인
5. Today
   - 오늘 일정, 오늘 할 일, 오늘 완료한 일 표시
   - 빠른 기록 추가, 완료, 다시 열기
   - 정리할 항목 이동
6. Calendar
   - 월간 grid, 당일 일정 bar, 여러 날 일정 bar
   - 선택 날짜 목록과 Today 목록의 날짜 기준 일치
7. Search
   - 검색어, filter, pagination, 빈 상태
8. D-Day
   - 목표 생성, 목표 상세, 목표 Task 생성, Task 연결/해제
9. 오류 상태
   - network, timeout, 401, 5xx에서 공통 오류 문구와 retry 확인

자세한 화면별 확인 항목은 [`SMOKE_TEST_CHECKLIST.md`](./SMOKE_TEST_CHECKLIST.md)를 따른다.

## 8. 현재 보류 또는 추가 확정이 필요한 계약

- 반복 Task·일정의 series, RRULE, occurrence, exception 저장·수정 계약
- Calendar 월간 범위 조회가 앞뒤 빈칸 날짜까지 포함해야 하는지
- 검색 결과의 relevance 기준과 cursor 정렬 안정성
- D-Day 목표 삭제 시 연결된 Task 처리 방식
- refresh token 또는 silent re-auth 도입 여부
