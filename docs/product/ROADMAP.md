# ToDoLab Mobile Roadmap

## 1. 문서 목적

이 문서는 ToDoLab 백엔드의 제품 방향, 서버 렌더링 화면, API를 기준으로 모바일 앱을 단계적으로 구현하기 위한 기준 문서다.

모바일은 백엔드 화면을 그대로 축소해서 옮기지 않는다. 핵심 개념과 정보 구조는 유지하되, 한 손 조작, 빠른 입력, 짧은 이동 경로, 네이티브 피드백을 우선한다.

각 단계는 사용자에게 의미 있는 하나의 변화가 되도록 작게 나누고, 수정 또는 코드 추가 한 단위를 원칙적으로 하나의 커밋으로 관리한다.

## 2. 제품 방향

ToDoLab은 할 일을 많이 저장하는 앱이 아니라, 사용자가 오늘 실제로 끝낼 일을 고르고 실행하도록 돕는 앱이다.

핵심 흐름은 다음과 같다.

```text
빠르게 기록
→ 오늘 할 일로 선별
→ 실행 가능한 순서로 정리
→ 완료
→ 완료 로그로 성취 확인
→ 미완료 항목 재판단
```

제품 원칙:

- 입력은 어느 주요 화면에서도 빠르게 시작할 수 있어야 한다.
- Today는 앱을 열었을 때 가장 먼저 만나는 중심 화면이다.
- 캘린더 일정과 실행할 TODO는 시각적으로 구분한다.
- 지난 미완료 항목은 자동으로 쌓지 않고 사용자가 다시 판단하게 한다.
- 완료 경험은 분명하되 과도한 게임화는 피한다.
- 중요한 행동은 한 손 엄지 범위 안에 배치하고 터치 영역은 최소 44pt를 유지한다.
- 로딩, 오류, 빈 상태, 오프라인 상태도 정상 흐름의 일부로 설계한다.
- Android, iOS, Web에서 핵심 기능은 같게 유지하고 플랫폼 관습이 다른 부분만 분기한다.

## 3. 참고 제품에서 채택할 패턴

기능을 그대로 복제하지 않고 ToDoLab의 흐름에 맞는 패턴만 채택한다.

| 참고 제품       | 참고할 패턴                                              | ToDoLab 적용 방향                                             |
| --------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| Todoist         | 목록 중심 Today, 빠른 추가, 모바일 추가 버튼             | 큰 상시 입력 카드 대신 하단 추가 버튼과 가벼운 composer 사용  |
| Microsoft To Do | My Day와 추천을 통한 하루 단위 선별                      | 기록함과 추천에서 Today로 직접 추가                           |
| Things          | Today 중심 실행 순서, 일정과 할 일 분리, Inbox와 Logbook | Today에서 일정/실행/완료를 구획하고 기록함과 완료 로그 제공   |
| TickTick        | Today smart list, 추천 진입점, 목록과 캘린더 결합        | 추천은 기본 목록 밖 진입점으로 줄이고 날짜별 Task 탐색에 집중 |
| MyTurn          | 오늘 행동을 한 화면에 모으고 한 단계씩 완료하는 경험     | 게임화 외형은 복제하지 않고 현재 행동과 가벼운 진행감만 참고  |

공식 참고 자료:

- [Todoist Quick Add](https://www.todoist.com/help/articles/use-task-quick-add-in-todoist-va4Lhpzz)
- [Todoist Dynamic Add Button](https://www.todoist.com/en/help/articles/use-the-dynamic-add-button-in-todoist-ysybl2M1)
- [Microsoft To Do My Day and Suggestions](https://support.microsoft.com/en-us/todo/my-day-and-suggestions)
- [Things Today, Upcoming, Inbox, Logbook](https://culturedcode.com/things/support/articles/4001304/)
- [TickTick Smart Lists](https://help.ticktick.com/articles/7055782283059396608)
- [TickTick List Calendar View](https://help.ticktick.com/articles/7055782110086299648)
- [MyTurn 공식 소개](https://myturn.kr/)

### Today 목표 구조

Today는 설명보다 실행 목록이 먼저 보이는 화면이어야 한다. 참고 제품에서 채택할 핵심은 다음 세 가지다.

- Todoist처럼 바로 추가하고 바로 완료할 수 있는 목록 중심 구조
- TickTick처럼 추천과 미완료 정리는 별도 진입점으로 낮추는 smart list 구조
- MyTurn처럼 “지금 할 하나”를 고르기 쉬운 낮은 인지 부하

목표 정보 순서:

```text
compact top bar: Today · 날짜 · 보조 메뉴
→ 일정이 있을 때만 일정 요약
→ 오늘 실행 Task
→ 미완료·추천 compact entry
→ 접힌 완료 목록
→ 하단 고정 추가 버튼 또는 필요할 때 펼치는 composer
```

우선순위:

1. 오늘의 시간 제약을 보여 주는 일정
2. 오늘 실행 Task와 완료
3. 하단 빠른 추가
4. 지난 미완료 재판단
5. 추천, 기록함, 완료 기록

첫 화면의 성공 기준은 “앱을 열자마자 오늘 할 일을 보고 바로 완료하거나 추가할 수 있는가”다.

## 4. 백엔드 기준 현재 계약과 연동 상태

모바일은 현재 다음 백엔드 기능과 계약을 기준으로 동작한다.

- 할 일 생성, 단건 조회, 수정, 삭제
- Today, 지난 미완료, 완료, 기록함 조회
- 주간 및 월간 범위 조회
- Today 추천
- Today 이동, 기록함 이동, 완료, 완료 취소, 이월
- 미룬 이유 저장 및 해제
- D-Day 목표 생성, 목록, 삭제, 연결된 할 일 조회
- 할 일과 D-Day 연결 및 해제
- 카테고리별 그룹 조회
- Task·일정·완료 기록 통합 검색

공통 응답 형태:

```ts
type ApiResponse<T> = {
  status: 'success' | 'fail';
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  timestamp: string;
};
```

최신 real API smoke test 결과는 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 최신 기준선만 유지한다.

백엔드 최신 원본 계약은 `todolab-backend`의 다음 문서를 기준으로 대조한다.

- [`API_V1_FRONTEND.md`](../../../backend/docs/api/API_V1_FRONTEND.md): 모바일 v1 API endpoint와 응답 envelope
- [`ENVIRONMENT_INTEGRATION.md`](../../../backend/docs/ops/ENVIRONMENT_INTEGRATION.md): local, staging, production API URL과 CORS origin
- [`AUTH_CONTRACT.md`](../../../backend/docs/api/AUTH_CONTRACT.md): JWT access token, 401/403, refresh token 미도입 정책
- [`API_ERROR_CODES.md`](../../../backend/docs/api/API_ERROR_CODES.md): 오류 코드, retry 가능 여부, 안전한 사용자 문구
- [`RECURRENCE_MODEL.md`](../../../backend/docs/api/RECURRENCE_MODEL.md): 반복 series/occurrence 저장 모델과 현재 API 상태
- [`NOTIFICATION_CONTRACT.md`](../../../backend/docs/api/NOTIFICATION_CONTRACT.md): 로컬 알림과 향후 server push 책임 분리
- [`TIMEZONE_CONTRACT.md`](../../../backend/docs/api/TIMEZONE_CONTRACT.md): `Asia/Seoul` 기준과 사용자 timezone 도입 조건
- [`DATA_MODEL_GLOSSARY.md`](../../../backend/docs/api/DATA_MODEL_GLOSSARY.md): Task 상태, 날짜 필드, owner scope 의미
- [`MOBILE_INTEGRATION_RUNBOOK.md`](../../../backend/docs/mobile/MOBILE_INTEGRATION_RUNBOOK.md): 백엔드 기준 real-mode smoke test 절차
- [`MOBILE_API_BACKEND_STATUS.md`](../../../backend/docs/mobile/MOBILE_API_BACKEND_STATUS.md): 모바일 요구 항목의 백엔드 구현/확인 상태

현재 통과 기준:

- Auth, Task, Today, Done, Schedule, Search, D-Day, Stale 주요 API smoke test 통과
- Today와 Calendar의 여러 날 일정 포함 범위, Calendar 원본 ID 1회 반환 확인
- Search의 검색어, 상태 filter, 종류 filter, cursor pagination, 빈 결과 확인
- D-Day 목표 생성, 조회, 연결, 해제, 삭제 응답 확인
- 401 세션 만료, network/timeout/5xx retry, Calendar/Search 조회 전환 중 기존 데이터 유지 기준 반영
- 서비스 기준 시간대 `Asia/Seoul` 계약 확인

백엔드에서 계속 확인하거나 보완할 항목:

- staging, production API URL 확정
- 네트워크 재시도와 중복 생성 방지를 위한 idempotency 또는 client request id 정책
- 반복 Task·일정은 백엔드 문서상 생성 계약이 추가된 상태로 보이나, 백엔드 상태 문서 정합성과 real smoke가 끝날 때까지 모바일 저장 UI 노출은 보류
- 로컬 알림은 백엔드 [`NOTIFICATION_CONTRACT.md`](../../../backend/docs/api/NOTIFICATION_CONTRACT.md)에 따라 가까운 미래 occurrence만 모바일에서 best-effort로 예약
- real API 화면 smoke에서 검색 cursor 정렬, 기간 filter, timezone 경계는 계속 회귀 확인

백엔드 연동을 다시 진행할 때는 [`BACKEND_INTEGRATION_RUNBOOK.md`](../integration/BACKEND_INTEGRATION_RUNBOOK.md)를 기준으로 mock 검증 → real API 검증 → smoke log 기록 순서로 진행한다. 이 저장소에는 필요한 계약과 모바일 변경만 문서화하고 백엔드 코드는 추가하지 않는다.

## 5. 모바일 정보 구조

하단 탭은 모바일의 실제 사용 빈도를 기준으로 `오늘`, `달력`, `프로필` 세 개로 구성한다. 날짜 없는 기록은 Today의 `정리할 항목`에서 처리한다.

### Today

- 오늘 날짜와 짧은 인사
- 빠른 추가
- 지난 미완료 정리
- 오늘의 추천
- 캘린더 일정
- 오늘 실행할 일
- 완료한 일

정보가 많아질 수 있으므로 모든 섹션을 한꺼번에 강조하지 않는다. 지난 미완료와 추천은 요약 카드에서 펼치고, 오늘 실행할 일을 가장 강하게 보여준다.

### Calendar

- 주간/월간 전환
- 오늘로 돌아가기
- 선택 날짜의 일정과 할 일
- 일정, 완료, 미룸, D-Day 표시
- 빠른 날짜 변경

작은 화면에서는 월간 칸 안에 제목을 억지로 넣지 않고 상태 점과 개수만 보여준 뒤 선택 날짜의 목록을 아래에 표시한다.

### D-Day

- 목표 목록과 남은 날짜
- 목표 추가 및 삭제
- 연결된 Today 할 일
- 목표에서 바로 오늘 할 일 만들기

### Profile

- 로그인 상태와 사용자 정보
- 검색과 과거 기록 확인
- 완료 로그
- D-Day와 설정
- 앱 정보와 개발/진단 정보

### 전역 흐름

- 하단 추가 버튼: 어느 탭에서든 새 항목 작성
- Task 상세: 전체 화면 또는 바텀시트
- 날짜/시간 선택: 네이티브 선택기 우선
- 성공 피드백: 가벼운 햅틱과 토스트
- 파괴적 행동: 삭제 확인과 실행 취소 가능 여부 검토

## 6. UI/UX 방향

백엔드의 기능 구조는 유지하되 모바일은 네이버 모바일 앱처럼 사용자가 매일 열어도 피로하지 않은 가볍고 단정한 화면을 지향한다. 특정 서비스를 그대로 복제하지 않고, 한국 사용자가 익숙하게 느끼는 정보 밀도, 검색/탐색 진입점, 카드 간 간격, 읽기 쉬운 한글 위계를 ToDoLab의 실행 흐름에 맞게 적용한다.

색상 토큰, 타이포그래피, 간격, 컴포넌트와 상호작용의 상세 규칙은 [DESIGN.md](../design/DESIGN.md)에서 관리한다. 이 절은 제품 로드맵에 영향을 주는 상위 방향만 요약한다.

### 시각 체계

- 배경: 따뜻한 off-white 또는 아주 옅은 회색을 기본으로 하고, surface는 흰색 또는 미세한 tint만 사용한다.
- 주색: 네이버식 초록을 그대로 쓰기보다 ToDoLab의 일정/실행 맥락에 맞는 차분한 blue-green 계열을 검토한다.
- 보조색: 일정, 오늘 할 일, 완료, D-Day를 파스텔톤으로 구분하되 배경과 충분한 대비를 유지한다.
- 카드: 약한 테두리 또는 그림자 중 하나만 사용해 시각적 소음을 줄이고, 카드 내부 모서리의 흰색 끼임이 보이지 않게 배경과 radius를 정리한다.
- 모서리: 카드 14~18, 입력/버튼 12~16 수준의 일관된 radius
- 타이포그래피: 제목, 본문, 보조 정보의 3단계 위계를 명확히 유지하되 한글 본문은 과하게 크지 않게 한다.
- 상단 제목: Today, Calendar, Profile 모두 같은 방식으로 페이지 정체성을 보여 주거나 모두 제거한다. Today만 제목이 없는 상태를 만들지 않는다.
- 다크 모드: 초기 토큰부터 고려하고 핵심 기능 완료 후 정식 지원

### 네이버 모바일 앱에서 참고할 UX 감각

- 홈에서 너무 많은 설명을 밀어 넣기보다 사용자가 바로 행동할 수 있는 핵심 entry를 먼저 보여 준다.
- 검색, 프로필, 설정처럼 익숙한 전역 행동은 위치와 역할을 예측 가능하게 유지한다.
- 카드와 list item은 충분히 분리하되 과한 그림자, 진한 테두리, 큰 장식 색을 피한다.
- 한 화면의 글자 크기와 굵기를 많이 섞지 않고, 제목/본문/메타 정보의 리듬을 안정적으로 유지한다.
- 한국어 label은 짧고 직관적으로 쓴다. 예: `생각난 할 일 기록`처럼 긴 placeholder는 `할 일 입력`, `빠른 기록` 등으로 줄인다.

ToDoLab 적용 방향:

- Today는 미니 달력, 일정, 오늘 할 일, 완료 목록의 위계를 분명히 하되 첫 viewport에서 실제 할 일을 바로 볼 수 있게 한다.
- Calendar는 3주 planner grid의 칸, 세로/가로 구분선, 일정 bar가 일 단위 구간 안에 정확히 정렬되도록 우선 정리한다.
- Profile은 설정/기록/검색 진입점이 서비스 홈의 shortcut처럼 보이게 card spacing과 icon treatment를 통일한다.
- 정리할 항목 화면은 버튼 나열보다 `지난 미완료`, `추천`, `기록함`을 각각 명확한 list/card section으로 정리한다.

### 조작 원칙

- 주요 CTA는 화면 하단에 가깝게 배치한다.
- 완료 체크는 카드 전체 탐색과 충돌하지 않게 분리한다.
- 카드의 보조 액션은 스와이프보다 명시적 메뉴를 기본으로 하고, 스와이프는 보조 수단으로 검토한다.
- Today 정렬은 긴 누르기 드래그를 우선하고 VoiceOver·TalkBack custom action과 Web keyboard 동선을 제공하되, 위/아래 버튼을 카드에 노출하지 않는다.
- 키보드가 열린 상태에서도 저장 버튼과 입력 내용이 가려지지 않게 한다.
- 긴 제목, 큰 글꼴, VoiceOver/TalkBack을 기본 검증 항목에 포함한다.

### 화면 상태

모든 데이터 화면은 다음 상태를 구현해야 완료로 본다.

- 초기 로딩 skeleton
- 당겨서 새로고침
- 빈 상태와 다음 행동 CTA
- 인라인 오류와 재시도
- 변경 중 중복 입력 방지
- 성공 피드백
- 연결 끊김 또는 타임아웃 안내

## 7. 구현 로드맵

완료된 세부 구현 체크리스트는 git history와 개별 문서에 남긴다. 이 섹션은 앞으로 관리해야 할 작업과 완료 기준만 유지한다.

### 현재 기준선

- Expo, React Native, TypeScript 기반 앱 구조와 공통 API client가 구성되어 있다.
- `EXPO_PUBLIC_API_MODE=mock | real`로 로컬 UI 개발과 실제 백엔드 연동을 분리하고, 임시 real smoke는 `EXPO_PUBLIC_API_MODE_OVERRIDE` / `EXPO_PUBLIC_API_URL_OVERRIDE`로 `.env.local`보다 우선 적용한다.
- Today, Calendar, Profile 3탭 구조를 기준으로 한다.
- Today는 주간 strip, 일정, 오늘 할 일, 정리할 항목, 접힌 완료 목록을 중심으로 구성한다.
- Calendar는 선택일 기준 3주 planner grid와 일정 bar 중심으로 구성한다.
- 인증, Task, 일정, D-Day, 검색 mock/real 주요 흐름은 모바일 계약 기준으로 동작한다.
- real API smoke test는 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록하고, 반복 실행 기준은 [`BACKEND_INTEGRATION_RUNBOOK.md`](../integration/BACKEND_INTEGRATION_RUNBOOK.md)를 따른다.

### A. 네이버 모바일 앱 수준의 UI/UX 마감

목표: 기능은 이미 어느 정도 연결되었으므로, 이제 매일 열어도 부담 없는 가볍고 단정한 모바일 앱으로 다듬는다.

- [x] [`UX_REVIEW_LOG.md`](../design/UX_REVIEW_LOG.md)를 만들고 현재 화면별 결정과 다음 검토 항목을 기록한다.
- [x] Today 미니 달력은 외부 card를 제거하고 grid 자체의 얇은 경계, 내부 세로선, 조용한 일정 label로 정리한다.
- [x] 일정, 오늘 할 일, 오늘 완료한 일 section 색을 파스텔톤으로 유지하되 배경과 대비를 다시 맞춘다.
- [x] 빠른 입력 placeholder와 input inset을 더 짧고 자연스럽게 정리한다.
- [x] Profile shortcut card의 좌우 간격, radius, icon treatment를 Today Task row와 같은 문법으로 맞춘다.
- [x] 정리할 항목 화면의 버튼 중심 UI를 section/list 중심 UI로 계속 다듬는다.
- [x] 탭 루트의 중복 page title을 제거하고 첫 콘텐츠 노출을 앞당긴다.
- [x] light theme을 흰 배경과 쿨그레이 border 중심으로 조정한다.
- [x] Section marker 원형 badge를 제거하고 제목·count·카드 간격 중심으로 정리한다.
- [x] Calendar grid를 선택일 기준 이전 1주, 현재 주, 다음 1주의 3주 범위로 정리한다.
- [x] Calendar header를 큰 월 제목과 양옆 작은 chevron으로 정리하고, 선택 날짜 목록의 중복 날짜 제목을 제거한다.
- [x] Today 미니 달력 높이와 날짜 cell 밀도를 줄인다.
- [x] Calendar와 Today의 일정 label 시각적 무게를 낮추고, Calendar 하단 filter chip은 기본 노출하지 않게 정리한다.
- [x] Calendar 좌우 이동을 선택 날짜 기준 1주 이동으로 바꾸고, 월 제목에서 같은 폭의 월 선택 panel을 열 수 있게 한다.
- [x] 하단 탭 active 상태가 선명한 blue로 보이게 조정한다.
- [x] Calendar 월 선택 panel의 버튼 높이와 간격을 줄여 달력과 목록을 덜 밀게 한다.
- [x] Calendar 좁은 날짜 cell의 하루 일정 label은 제목 대신 시간 중심으로 축약한다.
- [x] Search 화면은 기본 필터와 상세 필터를 분리해 첫 화면 밀도를 낮춘다.
- [x] Completed 화면은 완료 Task를 compact card로 맞추고 중복 `다시 열기` 버튼을 줄인다.
- [x] D-Day 목표 메뉴는 작은 화면에서 읽기 쉬운 세로 액션으로 정리한다.
- [x] Calendar 3주 grid는 compact 폭과 짧은 화면에서 주 높이와 label lane을 줄인다.
- [x] mock Web 320px, 375px, 430px, 720px에서 Today와 Calendar horizontal overflow와 첫 viewport 노출을 실제 화면으로 확인했다.
- [x] Today 미니 달력의 일정 label을 더 가볍고 덜 잘리는 marker/pill 형태로 정리한다.
- [x] 빠른 기록 composer를 하단 tab과 분리된 bottom sheet형 입력 surface로 정리한다.
- [x] Calendar grid의 테두리와 내부 rule 대비를 낮추고 선택 날짜 중심으로 시선을 정리한다.
- [x] 정리할 항목 section별 성격 차이를 낮은 강조의 tint, icon, copy로 보강한다.
- [x] 하단 tab과 shortcut icon의 Web glyph 중복 노출 흔적을 점검하고 필요하면 정리한다.
- [x] Product Design audit 기준 Calendar 일정 bar의 최소 크기, 텍스트 생략, column overflow, touch target을 다시 마감한다.
- [ ] Today section별 카드·border 무게를 낮추고 일정/오늘 할 일/정리할 항목/완료의 역할 차이를 더 명확히 만든다.
- [ ] Quick Capture 열린 상태의 기본 파란 focus border를 앱 primary soft border와 bottom sheet형 composer visual로 교체한다.
- [ ] 하단 tab active icon·label의 선택 상태와 실제 스크린샷을 갱신해 Today/Calendar/Profile의 현재 위치가 분명히 보이는지 확인한다.
- [ ] Profile 상단 로그인 card와 shortcut row를 “나의 플래너 공간”처럼 보이도록 여백, 동기화 상태 copy, icon 리듬을 다듬는다.
- [ ] iOS/Android font scale 1.5, safe area, light/dark에서 Today와 Calendar가 깨지지 않는지 실제 기기 또는 simulator로 확인한다.

완료 기준:

- 첫 viewport에서 사용자가 오늘의 일정 또는 오늘 할 일을 바로 볼 수 있다.
- 같은 역할의 row, card, button이 화면마다 다르게 보이지 않는다.
- 색상은 예쁘지만 의미와 대비를 해치지 않는다.

### B. 백엔드 real API 연동 안정화

목표: mock에서 예쁜 화면이 아니라 실제 데이터로 매일 사용할 수 있는 상태를 만든다.

- [x] 검색 API의 키워드, 상태 filter, 종류 filter, 빈 상태, cursor pagination을 real API로 smoke test하고 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록했다. 기간 filter와 timezone은 실제 화면 회귀에서 계속 확인한다.
- [x] Today와 Calendar의 여러 날 일정 겹침 기준, 원본 일정 ID, 월간 범위 조회 응답을 실제 데이터로 재검증했다. 2026-07-28 real API smoke에서 2026-07-28–2026-07-30 기간 일정이 해당 날짜 Today에만 포함되고 Calendar 월간 조회에는 원본 ID 1회로 반환됨을 확인했다.
- [x] D-Day 삭제 성공 응답 형식은 백엔드 v1 기준 `data: null`로 확정했고, 모바일 타입도 `null` 기준으로 맞췄다.
- [x] 반복 Task·일정은 백엔드 저장 모델과 occurrence 조회 계약을 정리했고, 백엔드 문서 정합성과 real smoke가 끝날 때까지 실제 저장 UI를 열지 않는 기준을 확정했다.
- [x] 401 응답 시 access token을 삭제하고 로그인 화면으로 이동해 세션 만료 안내를 표시한다. refresh token 흐름은 현재 백엔드 계약상 미도입으로 유지한다.
- [x] network, timeout, 5xx 오류는 Query retry 정책으로 최대 2회 재시도하고, Calendar/Search 조회 전환은 기존 데이터를 유지한다. real API 화면 smoke는 위 항목에서 별도 확인한다.
- [x] `.env.local` mock 기본값과 real smoke 실행값이 섞이지 않도록 `EXPO_PUBLIC_API_MODE_OVERRIDE` / `EXPO_PUBLIC_API_URL_OVERRIDE`와 `npm run web:real`을 추가한다.
- [x] 반복 일정 real smoke를 2026-07-30 재실행했고, 생성 응답까지 통과하나 Today occurrence 조회에서 HTTP 500/code `99999`가 반복 재현됨을 확인했다.
- [ ] 백엔드에서 반복 occurrence Today/Calendar materialize 500을 수정하면 `npm run smoke:recurrence:real`을 재실행한다.

완료 기준:

- `EXPO_PUBLIC_API_MODE=real`에서 Auth, Today, Calendar, D-Day, Search 주요 흐름이 smoke test를 통과한다.
- 모바일에서 발견한 API 이슈는 백엔드 저장소와 문서에 분리해 추적한다.

### C. 반복 Task와 일정

목표: 매주 화요일 09:00 회의처럼 반복되는 실행 항목과 일정을 occurrence별로 계획하고 완료한다.

- [x] 백엔드 반복 생성 계약, 상태 문서, real smoke 결과를 2026-07-30 재확인했다. 생성/cleanup은 통과, Today occurrence 조회는 백엔드 500으로 보류한다.
- [x] 모바일 타입/API는 nested `recurrence` 응답, `TaskUpsertRequest.recurrence`, `recurrenceScope` 수정·삭제 query를 받을 수 있게 맞춘다.
- [ ] 백엔드 반복 occurrence 조회 smoke가 통과하면 Task 작성 화면에 반복 없음, 매일, 매주, 매월, 사용자 지정 선택을 추가한다.
- [x] Task 작성 화면에서 일정 날짜와 시작·종료 시간을 입력할 수 있게 해 Calendar real smoke data를 앱 흐름으로 만들 수 있게 한다.
- [x] 수정·삭제 시 `이번만 / 이후 모두 / 전체` 범위 선택 UI를 제공한다.
- [x] Today와 Calendar 범위 조회에 occurrence를 표시한다.
- [ ] occurrence별 완료, 미룸, 건너뛰기와 완료 기록을 연결한다.
- [x] 모바일 API client는 `GET /api/v1/tasks/notification-candidates` 응답 타입과 조회 method를 제공한다.
- [ ] 반복 일정과 로컬 알림의 예약·취소 책임을 실제 구현 기준으로 검증한다.

완료 기준:

- 반복 원본과 개별 occurrence를 사용자가 혼동하지 않는다.
- 한 occurrence의 완료나 수정이 다른 반복 일정에 의도치 않게 영향을 주지 않는다.

### D. 출시 준비와 품질 마감

목표: 개발용 데모가 아니라 Android, iOS, Web에서 실제 사용 가능한 앱으로 마감한다.

- [x] [`RELEASE_CHECKLIST.md`](../qa/RELEASE_CHECKLIST.md)를 만들고 배포 전 확인 항목을 한 곳에서 관리한다.
- [x] 앱 아이콘, splash, 상태바, safe area의 현재 설정과 남은 실기기 확인 항목을 문서화한다.
- [x] 화면 가이드와 마켓 이미지 구성 문서는 최신 화면 구조 기준으로 정리했고, mock Web 390×844 기준 실제 PNG 캡쳐를 `docs/screenshots/`에 생성했다.
- [ ] Android package, iOS bundle identifier, EAS profile은 출시 계정과 식별자 결정 후 설정한다. 확정 전 입력 위치와 결정 기준은 [`PLATFORM_QUALITY_CHECKLIST.md`](../qa/PLATFORM_QUALITY_CHECKLIST.md)에 문서화했다.
- [x] Web mock responsive smoke와 real auth API smoke를 반복 실행하고 결과를 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록했다.
- [ ] Android/iOS에서 mock/real 화면 smoke test를 반복한다. 반복 occurrence smoke는 백엔드 500으로 보류 중이다.
- [x] Web mock에서 Today와 Calendar의 focusable label, 읽기 순서, keyboard focus smoke를 점검하고 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록했다.
- [ ] iOS VoiceOver와 Android TalkBack에서 일정 bar, checkbox, tab, 빠른 기록 동선을 [`ACCESSIBILITY_CHECKLIST.md`](../qa/ACCESSIBILITY_CHECKLIST.md)의 최소 smoke 순서와 기록 양식으로 최종 점검한다.
- [x] Web mock에서 Today와 Calendar의 초기 진입, DOM 크기, horizontal overflow 기준 렌더링 smoke를 점검하고 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록했다.
- [ ] Android/iOS 실기기에서 초기 진입, 긴 목록, Calendar 렌더링 성능을 실제 API 지연과 큰 글꼴 기준으로 점검한다.

완료 기준:

- 주요 흐름을 실제 기기에서 막힘 없이 수행할 수 있다.
- 배포 환경별 API 설정과 앱 식별자가 분리되어 있다.
- 비밀 값이 앱 번들이나 저장소에 포함되지 않는다.

### 현재 미완료 항목의 보류 조건

모바일 저장소에서 바로 끝낼 수 있는 Web mock/real 검증과 문서 정리는 완료했다. 남은 체크박스는 아래 조건이 충족되면 커밋 단위로 이어서 진행한다.

| 보류 조건                                           | 연결 항목                                                                                  | 다음 행동                                                                                                                                                                                                               |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 백엔드 반복 occurrence Today/Calendar 조회 500 수정 | 반복 UI, occurrence 표시, occurrence별 완료·미룸·건너뛰기, 로컬 알림 연동 검증             | `npm run smoke:recurrence:real` 통과 후 반복 작성/수정 UI를 연다.                                                                                                                                                       |
| Android/iOS simulator 또는 실기기 실행 가능         | font scale, safe area, light/dark, mock/real 화면 smoke, VoiceOver/TalkBack, 네이티브 성능 | [`ACCESSIBILITY_CHECKLIST.md`](../qa/ACCESSIBILITY_CHECKLIST.md), [`PERFORMANCE_CHECKLIST.md`](../qa/PERFORMANCE_CHECKLIST.md), [`PLATFORM_QUALITY_CHECKLIST.md`](../qa/PLATFORM_QUALITY_CHECKLIST.md)에 맞춰 기록한다. |
| 출시 계정과 앱 식별자 결정                          | Android package, iOS bundle identifier, EAS profile                                        | 결정값을 받은 뒤 `app.json`/EAS 설정을 확정한다.                                                                                                                                                                        |

## 8. 커밋 운영 기준

브랜치 이름:

- 기본 작업은 `main`에서 진행한다.
- 규모가 크거나 실험적이거나 병렬 작업이 필요한 경우에만 브랜치를 만든다.
- 기능: `feat/<topic>`
- 버그: `fix/<topic>`
- 설정·문서: `chore/<topic>`

커밋 원칙:

- 하나의 커밋은 하나의 사용자 변화 또는 하나의 기반 변경만 담는다.
- 구현과 그 변경을 설명하는 ROADMAP·DESIGN 갱신은 같은 완결 단위에 포함할 수 있다.
- 리팩터링과 기능 추가를 가능하면 분리한다.
- 백엔드 변경은 모바일 커밋에 섞지 않는다.
- API 변경이 필요하면 모바일 요구 계약을 먼저 문서화하고 백엔드 저장소에서 별도 브랜치와 커밋으로 처리한다.
- 커밋 메시지는 `feat:`, `fix:`, `chore:` 같은 prefix 없이 변경 결과를 나타내는 짧은 한국어 명사형으로 작성한다.
- 변경 후와 커밋 전에는 `npm run validate`로 typecheck, lint, format, docs link, test를 모두 확인한다.
- 플랫폼별 코드 변경은 사용자 전달 내용에 영향을 받는 Android, iOS, Web 범위를 명시한다.
- 코드와 문서 변경 및 검증까지만 먼저 진행하고, 사용자가 명시적으로 승인한 경우에만 커밋과 푸시를 실행한다.
- 실제 비밀 값과 `.env.local` 같은 로컬 환경 파일은 커밋하지 않는다.
- 여러 로컬 커밋을 한 번에 푸시할 수 있지만 푸시 역시 사용자 승인을 받은 경우에만 진행한다.

권장 커밋 크기 예시:

```text
모바일 디자인 토큰 정리
하단 탭 navigation 구성
Task API 타입과 client 추가
Today 작업 목록 표시
빠른 할 일 추가
키보드와 저장 버튼 겹침 수정
```

## 9. 화면별 공통 완료 조건

- 로딩, 빈 상태, 오류, 재시도 상태가 있다.
- 터치 영역이 최소 44pt다.
- 하단 탭과 키보드가 마지막 콘텐츠나 CTA를 가리지 않는다.
- 긴 한글 제목, 320px Web, 375pt iPhone, 430dp Android 폭에서 레이아웃이 깨지지 않는다.
- VoiceOver/TalkBack이 버튼 목적과 Task 상태를 이해할 수 있다.
- 색상만으로 완료, 위험, 선택 상태를 전달하지 않는다.
- API 성공 뒤 관련 화면의 데이터가 일관되게 갱신된다.
- 날짜와 시간은 Android, iOS, Web에서 같은 의미로 표시된다.
- `npm run validate`의 typecheck, lint, format, docs link, test가 모두 통과한다.

## 10. 현재 제품 결정

- 첫 진입 화면은 Today로 한다.
- 하단 탭은 `오늘`, `달력`, `프로필` 세 개로 유지하고, 기록함은 Today의 `정리할 항목` 또는 Profile의 기록/검색 흐름에서 다룬다.
- 인증 UI는 1차 구현과 real API smoke test를 완료했고, 배포 전에는 refresh token 또는 세션 만료 정책을 다시 확인한다.
- API URL과 mock/real 모드는 환경변수로 교체할 수 있게 유지한다.
- 로컬 UI 개발은 `EXPO_PUBLIC_API_MODE=mock`으로 더미 데이터를 사용하고, 백엔드 연동 테스트는 `EXPO_PUBLIC_API_MODE=real`과 `EXPO_PUBLIC_API_URL`로 실제 서버를 사용한다.
- 자연어 빠른 입력, 검색, 하위 작업, 주간 리포트는 핵심 모바일 흐름 이후에 진행한다.
- 네이티브 알림은 MVP 데이터 흐름이 안정된 뒤 추가한다.

## 11. 프론트 개발 산출물

모바일 프론트는 기능 구현만으로 완료하지 않고, 설계 의도와 검증 결과가 남아야 한다. 작성하면 좋은 산출물은 다음과 같다.

| 산출물                            | 목적                                      | 관리 기준             |
| --------------------------------- | ----------------------------------------- | --------------------- |
| Roadmap                           | 제품 방향, 작업 우선순위, 완료 기준       | 앞으로 할 일 중심     |
| Design system                     | 색상, typography, spacing, component 원칙 | 현재 토큰 중심        |
| Screen guide                      | 실제 화면 캡쳐와 사용 흐름 설명           | 캡쳐 갱신 시 수정     |
| App store / marketing asset guide | 마켓 이미지, 소개 문구, 캡쳐 구성         | 출시 준비 시 갱신     |
| Backend integration runbook       | real API 환경 설정, endpoint, smoke 순서  | 계약 변경 시 수정     |
| Smoke test checklist / log        | mock/real 검증 시나리오와 최신 결과       | 최신 기준선만 유지    |
| Accessibility checklist           | screen reader, 명암, touch target 기준    | 배포 전 재점검        |
| Performance checklist             | 긴 목록, Calendar, 초기 로딩 성능 기준    | 실기기 QA 때 갱신     |
| Platform quality checklist        | Android/iOS/Web safe area, icon, keyboard | 식별자 확정 시 수정   |
| API contract notes                | 검색, 반복, 일정 범위, 날짜/시간 계약     | 백엔드 변경 시 수정   |
| Release checklist                 | 배포 전 계정, 빌드, 환경, QA 확인         | 출시 전 사용          |
| UX review log                     | 화면별 결정, 다음 UX 검토 항목            | 최신 판단만 유지      |
| Component inventory               | 공통 컴포넌트 사용처와 변형 정리          | 컴포넌트 변경 시 수정 |

이미 지나간 작업 내역은 각 문서에서 길게 보관하지 않는다. 이후 새 패턴이 생기면 `DESIGN.md`, `UX_REVIEW_LOG.md`, `COMPONENT_INVENTORY.md` 중 적절한 문서에 현재 기준으로 반영한다.

## 12. 바로 다음 작업

다음 작업은 실제 화면 품질과 기기별 QA를 우선한다. 2026-07-28 기준 local real API full smoke test는 통과했으므로, 이후 real API 검증은 화면 QA와 배포 전 회귀 테스트로 반복한다.

1. 320px, 430dp, font scale 1.5, light/dark에서 Today와 Calendar가 깨지지 않는지 실제 화면으로 확인한다.
2. Calendar 여러 날 일정 bar overflow와 320px 폭에서의 월 선택 panel 밀도를 더 자연스럽게 조정한다.
3. [`BACKEND_INTEGRATION_RUNBOOK.md`](../integration/BACKEND_INTEGRATION_RUNBOOK.md)에 맞춰 Android, iOS, Web에서 mock/real 화면 smoke test를 반복한다.
4. 마켓·소개용 편집 이미지는 실제 화면 캡쳐를 기반으로 `docs/marketing/`에 분리해 만든다.
5. 반복 Task와 일정의 작성·수정 UI는 백엔드 문서 정합성과 real smoke가 끝날 때까지 실제 저장 기능처럼 노출하지 않는다.
6. Android package, iOS bundle identifier, EAS profile은 출시 명칭과 배포 계정이 확정된 뒤 [`PLATFORM_QUALITY_CHECKLIST.md`](../qa/PLATFORM_QUALITY_CHECKLIST.md)에 따라 구성한다.

그전에도 사용을 막는 접근성, 키보드, 오류 상태와 명백한 정보 중복은 발견 즉시 수정한다.
