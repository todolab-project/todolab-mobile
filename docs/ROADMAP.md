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

최근 Web real API 연동 smoke test 결과는 [`SMOKE_TEST_LOG.md`](./SMOKE_TEST_LOG.md)에 기록한다.

연동 통과 항목:

- 회원가입, 로그인, 내 정보 조회
- Task 생성, Today 이동과 조회, 완료, 다시 열기
- D-Day 생성, 상세 조회, 목표 연결 Today Task 생성
- 모바일 로그인 후 Today 실제 데이터 표시
- Today와 Calendar에서 같은 실제 Task 표시
- D-Day 연결 label 표시
- 검색 API 미연결 안내 표시

연동 중 발견해 조치한 항목:

- Web API preflight가 `Authorization` request header 미허용으로 403을 반환했다. 백엔드 CORS 허용 헤더를 보강한 뒤 통과했다.
- Calendar 월간 조회가 `YYYY-MM-DD`를 보내 백엔드가 400을 반환했다. 모바일에서 `MONTH` 조회 시 `YYYY-MM`으로 직렬화하도록 수정하고 회귀 테스트를 추가했다.
- 로컬 MySQL 실제 포트와 백엔드 local 설정이 달라 기동이 실패했다. 로컬 설정과 테스트 DB 계정/권한을 맞춘 뒤 통과했다.

백엔드에서 계속 확인하거나 보완할 항목:

- 개발, 스테이징, 운영 API URL 확정
- API 문서 또는 OpenAPI 명세
- 날짜와 시간의 타임존 기준 및 `DAY`, `WEEK`, `MONTH`별 범위 조회 계약 고정
- 네트워크 재시도와 중복 생성 방지를 위한 idempotency 또는 client request id 정책
- D-Day 삭제 성공 응답을 `data: null` 또는 삭제된 ID 중 하나로 통일
- 통합 검색 구현 전 [`API_SEARCH_FILTER.md`](./API_SEARCH_FILTER.md)의 관련 날짜와 cursor 계약 구현
- 반복 Task·일정 구현 전 [`API_RECURRENCE.md`](./API_RECURRENCE.md)의 series, RRULE, occurrence, exception 계약 확정

백엔드 연동을 다시 진행할 때는 [`BACKEND_INTEGRATION_RUNBOOK.md`](./BACKEND_INTEGRATION_RUNBOOK.md)를 기준으로 mock 검증 → real API 검증 → smoke log 기록 순서로 진행한다. 이 저장소에는 필요한 계약과 모바일 변경만 문서화하고 백엔드 코드는 추가하지 않는다.

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
- 일정, 완료, 미룸, D-Day 표시 및 필터
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

색상 토큰, 타이포그래피, 간격, 컴포넌트와 상호작용의 상세 규칙은 [DESIGN.md](./DESIGN.md)에서 관리한다. 이 절은 제품 로드맵에 영향을 주는 상위 방향만 요약한다.

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
- Calendar는 월간 grid의 칸, 세로/가로 구분선, 일정 bar가 일 단위 구간 안에 정확히 정렬되도록 우선 정리한다.
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
- `EXPO_PUBLIC_API_MODE=mock | real`로 로컬 UI 개발과 실제 백엔드 연동을 분리한다.
- Today, Calendar, Profile 3탭 구조를 기준으로 한다.
- Today는 주간 strip, 일정, 오늘 할 일, 정리할 항목, 접힌 완료 목록을 중심으로 구성한다.
- Calendar는 월간 planner grid와 일정 bar 중심으로 구성한다.
- 인증, Task, D-Day, 검색 mock 흐름은 모바일에서 동작한다.
- real API smoke test는 [`SMOKE_TEST_LOG.md`](./SMOKE_TEST_LOG.md)에 기록하고, 반복 실행 기준은 [`BACKEND_INTEGRATION_RUNBOOK.md`](./BACKEND_INTEGRATION_RUNBOOK.md)를 따른다.

### A. 네이버 모바일 앱 수준의 UI/UX 마감

목표: 기능은 이미 어느 정도 연결되었으므로, 이제 매일 열어도 부담 없는 가볍고 단정한 모바일 앱으로 다듬는다.

- [ ] `UX_REVIEW_LOG.md`를 만들고 Today, Calendar, 정리할 항목, Profile의 화면별 불편점과 결정 이유를 기록한다.
- [ ] Today 미니 달력의 외부 경계, 내부 세로선, 일정 label과 날짜 cell 정렬을 재점검한다.
- [ ] 일정, 오늘 할 일, 오늘 완료한 일 section 색을 파스텔톤으로 유지하되 배경과 대비를 다시 맞춘다.
- [ ] 빠른 입력 placeholder와 input inset을 더 짧고 자연스럽게 정리한다.
- [ ] Profile shortcut card의 좌우 간격, radius, icon treatment를 Today Task row와 같은 문법으로 맞춘다.
- [ ] 정리할 항목 화면의 버튼 중심 UI를 section/list 중심 UI로 계속 다듬는다.
- [ ] 320px, 375pt, 430dp, font scale 1.5, light/dark에서 Today와 Calendar가 깨지지 않는지 실제 화면으로 확인한다.

완료 기준:

- 첫 viewport에서 사용자가 오늘의 일정 또는 오늘 할 일을 바로 볼 수 있다.
- 같은 역할의 row, card, button이 화면마다 다르게 보이지 않는다.
- 색상은 예쁘지만 의미와 대비를 해치지 않는다.

### B. 백엔드 real API 연동 안정화

목표: mock에서 예쁜 화면이 아니라 실제 데이터로 매일 사용할 수 있는 상태를 만든다.

- [ ] 검색 API의 기간, 키워드, 상태 filter, pagination, timezone 계약을 백엔드와 확정하고 real API로 연결한다.
- [ ] Today와 Calendar의 여러 날 일정 겹침 기준, 원본 일정 ID, 월간 범위 조회 응답을 실제 데이터로 재검증한다.
- [ ] D-Day 삭제 성공 응답 형식을 `data: null` 또는 삭제된 ID 중 하나로 통일한다.
- [ ] 반복 Task·일정의 series, RRULE, occurrence, exception 계약을 확정한다.
- [ ] 401 세션 만료 이후 사용자 동선과 refresh token 도입 여부를 결정한다.
- [ ] network, timeout, 5xx 오류에서 retry와 기존 데이터 유지가 화면별로 자연스러운지 확인한다.

완료 기준:

- `EXPO_PUBLIC_API_MODE=real`에서 Auth, Today, Calendar, D-Day, Search 주요 흐름이 smoke test를 통과한다.
- 모바일에서 발견한 API 이슈는 백엔드 저장소와 문서에 분리해 추적한다.

### C. 반복 Task와 일정

목표: 매주 화요일 09:00 회의처럼 반복되는 실행 항목과 일정을 occurrence별로 계획하고 완료한다.

- [ ] Task 작성 화면에 반복 없음, 매일, 매주, 매월, 사용자 지정 선택을 추가한다.
- [ ] 수정·삭제 시 `이번만 / 이후 모두 / 전체` 범위 선택 UI를 제공한다.
- [ ] Today와 Calendar 범위 조회에 occurrence를 표시한다.
- [ ] occurrence별 완료, 미룸, 건너뛰기와 완료 기록을 연결한다.
- [ ] 반복 일정과 로컬 알림의 예약·취소 책임을 실제 구현 기준으로 검증한다.

완료 기준:

- 반복 원본과 개별 occurrence를 사용자가 혼동하지 않는다.
- 한 occurrence의 완료나 수정이 다른 반복 일정에 의도치 않게 영향을 주지 않는다.

### D. 출시 준비와 품질 마감

목표: 개발용 데모가 아니라 Android, iOS, Web에서 실제 사용 가능한 앱으로 마감한다.

- [ ] `RELEASE_CHECKLIST.md`를 만들고 배포 전 확인 항목을 한 곳에서 관리한다.
- [ ] 앱 아이콘, splash, 상태바, safe area를 최종 점검한다.
- [ ] Android package, iOS bundle identifier, EAS profile을 확정한다.
- [ ] 실제 Android, iOS, Web에서 mock/real smoke test를 반복한다.
- [ ] 접근성 label, 읽기 순서, 명암, keyboard focus, screen reader 동선을 최종 점검한다.
- [ ] 초기 진입, 긴 목록, Calendar 렌더링 성능을 실제 기기 기준으로 점검한다.

완료 기준:

- 주요 흐름을 실제 기기에서 막힘 없이 수행할 수 있다.
- 배포 환경별 API 설정과 앱 식별자가 분리되어 있다.
- 비밀 값이 앱 번들이나 저장소에 포함되지 않는다.

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
- 변경 후와 커밋 전에는 `npm run validate`로 typecheck, lint, format, test를 모두 확인한다.
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
- `npm run validate`의 typecheck, lint, format, test가 모두 통과한다.

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

| 산출물                            | 목적                                      | 현재 상태 |
| --------------------------------- | ----------------------------------------- | --------- |
| Roadmap                           | 제품 방향, 작업 우선순위, 완료 기준       | 작성 중   |
| Design system                     | 색상, typography, spacing, component 원칙 | 작성 중   |
| Screen guide                      | 실제 화면 캡쳐와 사용 흐름 설명           | 초안 작성 |
| App store / marketing asset guide | 마켓 이미지, 소개 문구, 캡쳐 구성         | 초안 작성 |
| Backend integration runbook       | real API 환경 설정, endpoint, smoke 순서  | 작성 완료 |
| Smoke test checklist / log        | mock/real 검증 시나리오와 결과            | 작성 중   |
| Accessibility checklist           | screen reader, 명암, touch target 기준    | 작성 완료 |
| Performance checklist             | 긴 목록, Calendar, 초기 로딩 성능 기준    | 작성 완료 |
| Platform quality checklist        | Android/iOS/Web safe area, icon, keyboard | 작성 완료 |
| API contract notes                | 검색, 반복, 일정 범위, 날짜/시간 계약     | 작성 중   |
| Release checklist                 | 배포 전 계정, 빌드, 환경, QA 확인         | 필요      |
| UX review log                     | 화면별 불편점, 결정 이유, 보류 사유       | 필요      |
| Component inventory               | 공통 컴포넌트 사용처와 변형 정리          | 필요      |

우선 작성하면 좋은 문서:

1. `UX_REVIEW_LOG.md`
   - 네이버 모바일 앱처럼 편하게 읽히는지, 화면별 어색함과 수정 결정을 계속 기록한다.
   - Today, Calendar, 정리할 항목, Profile을 캡쳐 기준으로 점검한다.
2. `RELEASE_CHECKLIST.md`
   - 실제 사용 전 필요한 환경, 계정, 빌드, real API, 오류 로깅, 스토어 준비를 한 번에 확인한다.
3. `COMPONENT_INVENTORY.md`
   - Button, Card, Task row, Calendar cell, Bottom tab, Composer가 어디서 어떻게 쓰이는지 정리해 UI 일관성을 유지한다.

## 12. 바로 다음 작업

다음 작업은 실제 화면 품질과 real API 잔여 계약을 우선한다.

1. 네이버 모바일 앱 수준의 가볍고 단정한 사용감을 기준으로 Today, Calendar, 정리할 항목, Profile을 다시 리뷰하고 `UX_REVIEW_LOG.md`에 문제와 결정을 기록한다.
2. Today 미니 달력의 외부 경계, 내부 세로선, 일정/오늘 할 일/완료 section 색 대비, 빠른 입력 placeholder, Profile shortcut card를 정리한다.
3. Calendar 월간 grid의 일 단위 구분선 정렬, 일정 bar overflow, 불필요한 우측 상단 버튼 여부를 확인하고 수정한다.
4. 정리할 항목 화면의 버튼과 section UI를 Today와 같은 planner 문법으로 재정리한다.
5. [`BACKEND_INTEGRATION_RUNBOOK.md`](./BACKEND_INTEGRATION_RUNBOOK.md)에 맞춰 real API smoke test를 반복하고, 검색 API와 반복 occurrence 계약은 백엔드 구현 완료 후 실제 응답으로 확인한다.
6. 반복 Task와 일정의 작성·수정 UI는 [`API_RECURRENCE.md`](./API_RECURRENCE.md)의 백엔드 계약이 확정되기 전까지 실제 저장 기능처럼 노출하지 않는다.
7. Android package, iOS bundle identifier, EAS profile은 출시 명칭과 배포 계정이 확정된 뒤 [`PLATFORM_QUALITY_CHECKLIST.md`](./PLATFORM_QUALITY_CHECKLIST.md)에 따라 구성한다.

그전에도 사용을 막는 접근성, 키보드, 오류 상태와 명백한 정보 중복은 발견 즉시 수정한다.
