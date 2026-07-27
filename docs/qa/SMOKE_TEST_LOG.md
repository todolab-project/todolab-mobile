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

## 다음 smoke test 순서

백엔드가 켜져 있을 때:

1. `npm run validate`
2. `EXPO_PUBLIC_API_MODE=real`과 `EXPO_PUBLIC_API_URL=http://localhost:8080` 설정 확인
3. Auth, Today, Calendar, Search, D-Day, 정리할 항목, 완료 목록을 실제 화면에서 순서대로 확인
4. 실패 시 사용자에게 보이는 문구, 기존 데이터 유지 여부, retry 가능 여부 기록
5. 새로 발견한 API 계약 차이는 모바일 문서에 먼저 적고 백엔드 저장소에서 별도 처리

반복 Task·일정은 백엔드 문서 정합성과 real smoke가 끝날 때까지 실제 저장 UI smoke 범위에 넣지 않는다. 조회 표시와 문서 계약만 확인한다.
