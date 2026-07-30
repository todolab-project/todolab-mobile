# Smoke Test Log

이 문서는 모바일 앱이 실제 사용 가능한 상태인지 확인한 최신 smoke test 기준선만 남긴다. 오래된 조사 과정과 해결된 원인 분석은 git history와 각 커밋에 맡기고, 재실행에 필요한 사실과 남은 확인 항목만 관리한다.

## 현재 기준선: 2026-07-28 local real API full smoke

환경:

- API 모드: `real`
- API URL: `http://localhost:8080`
- 백엔드: local server `8080` listen 확인
- 실행 방식: Node `fetch` 기반 API smoke
- 보안: access token, 비밀번호, 실제 secret은 출력하지 않음
- 테스트 데이터: `mobile-smoke-{runId}@example.com`, `M{runId}` prefix로 생성 후 cleanup

통과:

- Auth: 회원가입, 로그인, 내 정보 조회
- Task: 기록함 TODO 생성, 단건 조회, 수정, 기록함 조회
- Today: 오늘로 이동, 순서 변경, Today 조회, 추천 조회
- 미룬 이유: `WAITING_OTHER` 저장과 해제
- Done: 완료, 완료 목록 조회, 다시 열기
- Schedule: 당일 일정 생성, Today 조회, Calendar 월간 조회, Search 조회
- 여러 날 일정: 2026-07-28–2026-07-30 Today 포함, 2026-07-27·2026-07-31 Today 미포함, Calendar 월간 조회에서 원본 ID 1회 반환
- Search: 검색어, 상태 filter, 종류 filter, cursor pagination, 빈 결과
- D-Day: 목표 생성, 상세 조회, 목록 조회, 목표 Task 생성, 연결 Task 조회, Task와 목표 연결·해제, 목표 삭제
- Stale: 지난 미완료 조회 응답 배열 계약

발견 및 조치:

- 모바일 `DeferReason` enum이 백엔드 v1 계약과 달라 `NO_TIME` 요청이 HTTP 400을 반환했다.
- 모바일 enum과 label을 백엔드 `TOO_BIG | NOT_NEEDED_NOW | AVOIDING | NO_DEADLINE | WAITING_OTHER | ETC` 기준으로 수정했다.
- 재실행 결과 전체 smoke 묶음이 통과했다.

## 2026-07-28 local real API auth smoke

환경:

- API URL: `http://127.0.0.1:8080`
- 백엔드: local server `8080` listen 확인
- 실행 명령: `EXPO_PUBLIC_API_URL=http://127.0.0.1:8080 npm run smoke:auth:real`
- 보안: access token과 비밀번호는 출력하지 않음

통과:

- 회원가입
- 로그인과 `Bearer` access token 응답 계약
- `Authorization: Bearer <token>` 기반 내 정보 조회
- 비인증 `/api/v1/auth/me` 401 거부
- 잘못된 token 401 거부

메모:

- 샌드박스 내부 기본 권한에서는 로컬 포트 연결이 `EPERM`으로 차단되어 권한 승인 후 실행했다.
- `localhost`보다 `127.0.0.1`을 명시하는 편이 smoke 실행 결과를 재현하기 쉽다.

## 2026-07-28 local real Web UI auth smoke

환경:

- API 모드: `real`
- API URL: `http://127.0.0.1:8080`
- 백엔드: local server `8080` listen 확인
- 실행 명령: `npm run web:real -- --port 8090 --clear`
- 보안: access token과 비밀번호는 출력하지 않음

통과:

- 기존 mock token이 real `/api/v1/auth/me`에서 401 처리되고 로그인 화면으로 이동
- 세션 만료 안내 문구 노출
- 회원가입 화면 진입
- 임시 계정 회원가입 후 로그인 화면 복귀
- 로그인 후 Today로 복귀
- Profile 탭에 실제 가입 이메일 표시
- 브라우저 reload 후 저장된 access token으로 세션 복원
- 로그아웃 후 로그인 필요 상태로 복귀

발견 및 조치:

- `.env.local`의 mock 값이 real 화면 smoke와 섞여 실제 모드 확인이 헷갈릴 수 있었다.
- `EXPO_PUBLIC_API_MODE_OVERRIDE`, `EXPO_PUBLIC_API_URL_OVERRIDE`를 일반 환경 값보다 우선 적용하고 `npm run web:real`을 추가했다.
- Expo Web 실행 중 `src/features/tasks/index.ts`와 D-Day feature 사이 require cycle warning이 반복된다. 기능 실패는 아니지만 다음 refactor 후보로 남긴다.

## 최근 화면 QA 기준선

Mock Web 화면에서 확인한 항목:

- Today: 320px, 375px, 430px, 720px에서 horizontal overflow 없음
- Calendar: 320px, 375px, 430px, 720px에서 horizontal overflow 없음
- Today 첫 viewport에서 주간 일정, 일정 목록, 오늘 할 일이 노출됨
- Calendar 320px에서 3주 grid와 선택 날짜 목록이 같은 화면 흐름 안에 표시됨
- 213px stress viewport에서 Today와 Calendar의 개별 element overflow 없음

아직 실제 기기로 다시 볼 항목:

- 실제 iOS 375pt, Android 430dp 기기 또는 simulator에서 safe area와 하단 tab 겹침 여부
- OS font scale 1.5 또는 browser zoom 150%에서 section 제목, row action, 빠른 입력 composer 유지 여부
- light/dark에서 section 색상, calendar rule, hairline 대비
- 일정 label과 여러 날 일정 bar가 날짜 cell 밖으로 튀지 않는지

## 2026-07-30 mock Web responsive smoke

환경:

- API 모드: `mock`
- 실행 명령: `npm run web:mock -- --localhost --port 8091 --clear`
- 확인 방식: Browser viewport override + DOM overflow check
- Viewport: 320×760, 375×760, 430×760, 720×760

통과:

- Today와 Calendar 모두 `documentElement.scrollWidth === clientWidth`로 페이지 단위 horizontal overflow 없음
- Today 첫 viewport에서 주간 strip, 일정, 오늘 할 일 section 노출
- Calendar 3주 grid가 320px, 375px, 430px, 720px에서 화면 폭을 밀지 않음
- 하단 탭이 viewport 폭 밖으로 밀리지 않음

메모:

- 긴 일정 label, 긴 Task 설명, tab icon glyph 일부는 element 내부 `scrollWidth > clientWidth`로 감지되지만 페이지 전체 overflow는 만들지 않는다. 현재 UI 의도상 말줄임/clip 대상이다.
- OS font scale 1.5, iOS/Android safe area, light/dark 대비는 실제 기기 또는 simulator에서 별도 확인해야 한다.

## 다음 smoke test 순서

백엔드가 켜져 있을 때:

1. `npm run validate`
2. `npm run web:real -- --port 8090 --clear`로 real 모드 화면 실행
3. Auth, Today, Calendar, Search, D-Day, 정리할 항목, 완료 목록을 실제 화면에서 순서대로 확인
4. 실패 시 사용자에게 보이는 문구, 기존 데이터 유지 여부, retry 가능 여부 기록
5. 새로 발견한 API 계약 차이는 모바일 문서에 먼저 적고 백엔드 저장소에서 별도 처리

반복 Task·일정은 백엔드 문서 정합성과 real smoke가 끝날 때까지 실제 저장 UI smoke 범위에 넣지 않는다. 조회 표시와 문서 계약만 확인한다.

## 2026-07-29 local real API recurrence smoke

환경:

- API URL: `http://127.0.0.1:8080`
- 백엔드: local server `8080` listen 확인
- 실행 명령: `EXPO_PUBLIC_API_URL=http://127.0.0.1:8080 npm run smoke:recurrence:real`
- 보안: access token과 비밀번호는 출력하지 않음

통과:

- 회원가입
- 로그인
- `POST /api/v1/tasks` 반복 일정 생성
- 생성 응답의 `recurrenceSeriesId`, `occurrenceDate`, nested `recurrence.frequency`, `recurrence.recurrenceRule`
- 실패 후 `DELETE /api/v1/tasks/{id}?recurrenceScope=ALL` cleanup

실패:

- `GET /api/v1/tasks/today?date=2026-08-04`
- 결과: HTTP 500, error code `99999`
- 의미: 반복 생성 계약은 동작하지만 Today 조회에서 첫 occurrence materialize 또는 반복 포함 조회 path 확인이 필요하다.

모바일 조치:

- nested `recurrence` 응답 타입과 `TaskUpsertRequest.recurrence` 타입을 추가한다.
- `PUT/DELETE /api/v1/tasks/{id}?recurrenceScope=...` 호출 기반을 추가한다.
- 반복 생성 UI는 Today/Calendar occurrence 조회 smoke가 통과할 때까지 열지 않는다.

## 2026-07-30 local real API recurrence smoke 재확인

환경:

- API URL: `http://127.0.0.1:8080`
- 백엔드: local server `8080` listen 확인
- 실행 명령: `EXPO_PUBLIC_API_URL=http://127.0.0.1:8080 npm run smoke:recurrence:real`

결과:

- 회원가입, 로그인, `POST /api/v1/tasks` 반복 일정 생성 통과
- `GET /api/v1/tasks/today?date=2026-08-04` 실패
- HTTP status: `500`
- error code: `99999`
- 실패 후 `DELETE /api/v1/tasks/{id}?recurrenceScope=ALL` cleanup 통과

판정:

- 2026-07-29와 같은 실패가 재현된다.
- 모바일 반복 생성 UI는 백엔드 Today/Calendar occurrence materialize path가 수정될 때까지 열지 않는다.

## 2026-07-30 local real API auth smoke 재확인

환경:

- API URL: `http://localhost:8080`
- 백엔드: local server `8080` listen 확인
- 실행 명령: `npm run smoke:auth:real`
- 보안: access token과 비밀번호는 출력하지 않음

통과:

- 회원가입
- 로그인과 `Bearer` access token 응답 계약
- `Authorization: Bearer <token>` 기반 내 정보 조회
- 비인증 `/api/v1/auth/me` 401 거부
- 잘못된 token 401 거부

추가 검증:

- 같은 작업 단위에서 `npm run validate` 통과
