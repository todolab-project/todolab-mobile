# Smoke Test Log

## 2026-07-22

커밋 기준: `da64884` 이후 로컬 변경 없음

환경:

- API 모드: `mock`
- Expo dev server: `http://localhost:8081`
- 확인 대상: Today, Calendar의 320px, 375pt, 430dp, font scale 1.5, light/dark 화면 QA

실행:

```bash
npx expo start --web --localhost
```

결과:

- sandbox 네트워크 제한 상태에서는 Expo가 버전 확인 이후 dev server URL까지 진행하지 못했다.
- 네트워크 허용 상태로 재실행하자 `http://localhost:8081` dev server는 정상 기동했다.
- 현재 Codex 세션에서 연결 가능한 in-app browser 목록이 비어 있어 실제 viewport별 화면 확인은 완료하지 못했다.

남은 확인:

- 320px, 375px, 430px, 720px 폭에서 Today 주간 strip과 Calendar grid의 horizontal overflow 여부
- font scale 1.5 또는 browser zoom 150%에서 섹션 제목, row action, 빠른 입력 composer label 유지 여부
- light/dark에서 section marker, hairline, calendar rule 대비
- Calendar의 하루 일정 label과 기간 bar가 날짜 cell 밖으로 튀지 않는지

메모:

- 실제 화면 확인 전용 항목이므로 [`ROADMAP.md`](./ROADMAP.md)의 화면 크기별 확인 항목은 완료 처리하지 않았다.
- 브라우저 또는 실제 기기 연결이 가능해지면 같은 dev server 기준으로 재확인한다.

## 2026-07-14

커밋 기준: `199c6b8` 이후 로컬 변경 포함

환경:

- API 모드: `mock`
- Web export: `/private/tmp/todolab-mobile-web-export`

실행:

```bash
npm run validate
npx expo export --platform web --output-dir /private/tmp/todolab-mobile-web-export
```

결과:

- `npm run validate` 통과
- Web static export 통과
- static route 17개 생성 확인

메모:

- `npx expo start --web`는 기존 `node` 프로세스가 8081 포트를 잡고 있어 새 dev server를 띄우지 못했다.
- 8081 포트는 listen 상태였지만 `curl http://localhost:8081`에는 응답하지 않았다.
- 다음 수동 smoke test 전에는 기존 Expo/Node 프로세스를 정리한 뒤 dev server를 다시 시작한다.

### Web mock 수동 smoke test

환경:

- API 모드: `mock`
- 브라우저: Codex 인앱 브라우저
- Expo dev server: `http://localhost:8090`

통과:

- Today 완료 처리와 다시 열기
- 빠른 기록 후 기록함 개수 반영
- Calendar 월간 grid와 선택 날짜 목록 표시
- 통합 검색어 입력과 결과 필터링
- mock 로그인, 프로필 email 표시, 로그아웃
- 320px, 375px, 430px, 720px에서 horizontal overflow 없음

메모:

- 기존 8081 Node 프로세스는 응답하지 않으면서 포트만 점유했고 현재 실행 권한으로 종료할 수 없어 8090을 사용했다.
- Web console에서 Task/D-Day barrel import 순환 경고 2건과 native animation fallback 경고 1건을 확인했다.

### Web real API 연동 smoke test

환경:

- API 모드: `real`
- 모바일 기준 커밋: `7b0dc7f`
- 백엔드 기준 커밋: `a0d58ff`와 CORS 로컬 수정
- API: `http://localhost:8080`
- MySQL: Homebrew MySQL 9.6, `localhost:3307`

통과:

- 회원가입, 로그인, 내 정보 조회
- Task 생성, Today 이동과 조회, 완료, 다시 열기
- D-Day 생성, 상세 조회, 목표 연결 Today Task 생성
- 모바일 로그인 후 Today 실제 데이터 표시
- 모바일 완료 처리와 다시 열기
- Today와 Calendar에서 같은 실제 Task 표시
- D-Day 연결 label 표시
- 검색 API 미연결 안내 표시

이슈와 조치:

- 로컬 MySQL 실제 포트 3307과 `application-local.yml`의 3306이 달라 백엔드 기동이 실패했다. 로컬 설정을 3307로 맞췄다.
- 로컬 MySQL에 테스트 DB 계정과 권한이 없어 설정값에 맞게 생성했다.
- 백엔드 CORS가 `Authorization` request header를 허용하지 않아 Web API preflight가 403이었다. 허용 헤더와 회귀 테스트를 추가한 뒤 preflight와 실제 화면 연동이 통과했다.
- 모바일 Calendar가 `MONTH` 조회에도 `YYYY-MM-DD`를 보내 백엔드가 400을 반환했다. 월간 조회를 `YYYY-MM`으로 직렬화하고 회귀 테스트를 추가했다.
