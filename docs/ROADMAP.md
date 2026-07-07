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

### Today UI/UX 비교 정리

2026-06-28 기준 공식 제품 자료와 모바일 화면 설명에서 다음 공통점을 채택한다.

#### Todoist에서 참고할 점

- Today의 주인공은 설명 카드가 아니라 바로 완료할 수 있는 Task 목록이다.
- 모바일 추가 버튼을 화면 하단에 두고, 목록의 원하는 위치로 끌어 Task나 section을 추가할 수 있게 한다.
- 빠른 입력은 항상 큰 폼을 차지하기보다 사용자가 시작할 때 확장되는 행동으로 제공한다.

ToDoLab 적용:

- 현재 상단의 `TODAY` pill, 큰 인사, 설명, 날짜 카드가 차지하는 영역을 하나의 compact header로 합친다.
- 빠른 기록 카드는 기본 상태에서 한 줄 composer 또는 하단 추가 버튼으로 축소한다.
- 추가 버튼은 Today뿐 아니라 주요 탭에서 같은 위치와 동작을 유지한다.

#### TickTick에서 참고할 점

- Today를 smart list로 취급해 기본 화면은 오늘 Task를 빠르게 훑고 완료하는 데 집중한다.
- 미완료 Task를 검토하는 Suggested Tasks는 Today 우측 상단의 별도 진입점으로 제공한다.
- 캘린더가 필요한 사용자는 list calendar나 timeline으로 전환하며 기본 Task 목록에 모든 계획 도구를 동시에 펼치지 않는다.

ToDoLab 적용:

- 지난 미완료와 추천은 기본 화면에서 전체 내용을 펼치지 않고 개수 badge가 있는 진입점으로 제공한다.
- 일정은 오늘 실행 Task와 구분하되 일정이 없을 때 빈 section을 크게 차지하지 않게 한다.
- 5개 지표를 나열하는 요약 카드는 제거하거나 한 줄 요약으로 축소한다.

#### MyTurn에서 참고할 점

- 반복 루틴과 오늘 할 일을 한 화면에서 다루되, “오늘 한 턴”처럼 지금 할 행동을 작게 시작하도록 유도한다.
- 완료 과정과 진행감을 시각적으로 보여주지만 진입 시 사용자가 판단해야 할 메뉴 수는 적다.
- 코인, 꾸미기, 레이스 같은 강한 게임화는 MyTurn의 제품 성격에 맞는 선택이다.

ToDoLab 적용:

- “지금 하나”를 쉽게 고를 수 있도록 첫 실행 Task와 완료 행동을 가장 강하게 보여준다.
- 진행감은 `완료 수 / 오늘 계획 수` 정도의 조용한 표현으로 제한한다.
- 코인, 캐릭터, 레이스, 연속 달성처럼 ToDoLab의 차분한 성격과 맞지 않는 게임화는 도입하지 않는다.

### Today 현재 문제와 목표 구조

현재 문제:

- `TODAY` pill, 34px 인사말, 보조 문구, 큰 날짜 카드가 같은 날짜 맥락을 반복한다.
- 상단 다음에 빠른 기록 카드와 `자세히 작성하기` 버튼이 이어져 첫 Task가 초기 화면 아래로 밀린다.
- `오늘의 흐름` 제목, 새로고침, 5분할 요약 카드가 실행 목록 전에 한 층 더 생긴다.
- 지난 미완료, 추천, 일정, 실행, 기록함, 완료가 한 화면에서 모두 존재해 무엇부터 봐야 하는지 흐려진다.

목표 구조:

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

## 4. 백엔드 기준 현재 제공 기능

2026-06-22 기준 백엔드는 다음 기능을 제공한다.

- 할 일 생성, 단건 조회, 수정, 삭제
- Today, 지난 미완료, 완료, 기록함 조회
- 주간 및 월간 범위 조회
- Today 추천
- Today 이동, 기록함 이동, 완료, 완료 취소, 이월
- Today 순서 위/아래 이동
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

모바일 연동 전에 확인하거나 백엔드에서 보완할 항목:

- 개발, 스테이징, 운영 API URL
- Web 클라이언트를 위한 CORS 허용 정책
- 사용자 인증 방식과 토큰 계약
- 사용자별 Task 및 D-Day 데이터 분리
- API 문서 또는 OpenAPI 명세
- 날짜와 시간의 타임존 기준
- 네트워크 재시도와 중복 생성 방지를 위한 요청 정책
- `GET /api/tasks` 범위 조회가 `SCHEDULE`만 반환하는지와 `DAY`, `WEEK`, `MONTH`별 계약
- D-Day 삭제 성공 응답을 `data: null` 또는 삭제된 ID 중 하나로 통일
- 존재하는 목표의 `GET /api/ddays/{id}`가 HTTP 500을 반환하는 문제 확인
- `POST /api/ddays/{id}/tasks`가 유효한 Task 요청에도 HTTP 500을 반환하는 문제 확인
- D-Day 연결 Task의 Today 이동은 반영되지만 응답이 HTTP 500으로 끝나는 문제 확인
- 통합 검색 구현 전 [`API_SEARCH_FILTER.md`](./API_SEARCH_FILTER.md)의 관련 날짜와 cursor 계약 구현

현재 백엔드는 인증과 사용자 구분이 없으므로, 실제 다중 사용자 서비스 배포 전에 백엔드 저장소에서 별도 설계와 구현이 필요하다. 이 저장소에는 필요한 계약만 문서화하고 백엔드 코드는 추가하지 않는다.

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

### More

- 기록함
- 완료 로그
- 검색과 필터(백엔드 지원 후)
- 설정과 앱 정보

### 전역 흐름

- 하단 추가 버튼: 어느 탭에서든 새 항목 작성
- Task 상세: 전체 화면 또는 바텀시트
- 날짜/시간 선택: 네이티브 선택기 우선
- 성공 피드백: 가벼운 햅틱과 토스트
- 파괴적 행동: 삭제 확인과 실행 취소 가능 여부 검토

## 6. UI/UX 방향

백엔드의 파란색 중심 디자인 언어는 유지하되 모바일에서는 더 부드럽고 공간감 있게 다듬는다.

색상 토큰, 타이포그래피, 간격, 컴포넌트와 상호작용의 상세 규칙은 [DESIGN.md](./DESIGN.md)에서 관리한다. 이 절은 제품 로드맵에 영향을 주는 상위 방향만 요약한다.

### 시각 체계

- 배경: 차가운 회색 계열의 앱 배경과 흰색 surface
- 주색: 백엔드와 같은 blue 계열
- 의미색: 성공 green, 주의 amber, 위험 red
- 카드: 약한 테두리 또는 그림자 중 하나만 사용해 시각적 소음을 줄임
- 모서리: 카드 14~18, 입력/버튼 12~16 수준의 일관된 radius
- 타이포그래피: 제목, 본문, 보조 정보의 3단계 위계를 명확히 유지
- 다크 모드: 초기 토큰부터 고려하고 핵심 기능 완료 후 정식 지원

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

단계 번호는 구현 순서를 뜻한다. 각 체크 항목은 가능한 한 독립 커밋으로 완결한다.

### Phase 0. 프로젝트 기반과 계약

목표: 화면을 계속 추가해도 구조가 무너지지 않고 API 연결을 안전하게 교체할 수 있는 기반을 만든다.

- [x] 디자인 토큰과 공통 Theme 구성
- [x] 공통 버튼, 텍스트, 카드, 화면 컨테이너 구성
- [x] Expo Router 탭 구조와 기본 화면 구성
- [x] 환경변수 정책과 `EXPO_PUBLIC_API_URL` 예제 문서화
- [x] 공통 API client, 응답 해제, timeout, 오류 타입 구성
- [x] 백엔드 Task/D-Day 요청·응답 TypeScript 타입 정의
- [x] 날짜/시간 변환 유틸리티와 타임존 규칙 정의
- [x] 서버 상태 라이브러리 선정 및 Provider 구성
- [x] 테스트, lint, format 명령과 CI 보강

완료 기준:

- Android, iOS, Web에서 탭 이동과 공통 테마가 정상 동작한다.
- mock 또는 개발 서버를 바꿔도 화면 코드가 API URL을 직접 알지 않는다.
- 타입 검사, lint, 최소 테스트가 CI에서 실행된다.

### Phase 1. Today 세로 슬라이스

목표: 실제 사용 가능한 최소 흐름인 기록 → Today → 완료를 끝까지 연결한다.

- [x] Today 화면 헤더와 날짜 요약
- [x] Today/완료/기록함 조회 hook과 상태 처리
- [x] Task 카드와 완료 체크
- [x] 제목만 입력하는 빠른 추가
- [x] 기록함 항목을 Today로 이동
- [x] 완료 항목 표시와 완료 취소
- [x] Task 상세 조회
- [x] Task 생성/수정 폼
- [x] Task 삭제 확인
- [x] 당겨서 새로고침, 오류, 빈 상태, 토스트

완료 기준:

- 사용자가 제목만으로 기록하고 Today로 옮겨 완료할 수 있다.
- 실패해도 기존 목록이 사라지지 않고 다시 시도할 수 있다.
- 작은 화면과 큰 글꼴에서도 주요 액션이 가려지지 않는다.

### Phase 2. Today 실행 계획 고도화

목표: 백엔드 Today 화면의 차별화된 실행 관리 기능을 모바일에 맞게 제공한다.

- [x] 지난 미완료 요약과 정리 화면
- [x] 오늘/내일/날짜 재설정/기록함/완료/삭제 액션
- [x] 이월 횟수와 미룬 이유 선택
- [x] Today 추천 목록과 Today 추가
- [x] 캘린더 일정과 실행 TODO 섹션 분리
- [x] Today 순서 변경과 낙관적 UI
- [x] Today 과부하 안내 UI 초안

완료 기준:

- 지난 미완료가 Today 목록을 압도하지 않으면서 반드시 재판단할 수 있다.
- Today 작업 순서를 빠르게 조정할 수 있다.
- 추천과 일정은 핵심 실행 목록의 집중을 방해하지 않는다.

### Phase 3. Calendar

목표: 날짜 맥락과 향후 실행 분포를 편하게 탐색한다.

- [x] 주간 캘린더와 날짜 이동
- [x] 선택 날짜의 예정/완료 목록
- [x] 월간 캘린더
- [x] 선택 날짜 목록의 일정, 완료, 미룸, D-Day 범례와 필터
- [ ] 주간/월간 날짜 셀의 일정, 완료, 미룸, D-Day 상태 점과 개수 — 백엔드 범위 조회 계약 대기
- [x] 선택 Task 날짜 빠른 변경
- [x] Today와 Calendar의 날짜 일관성 회귀 테스트

완료 기준:

- 날짜 선택과 Today 이동 사이에 날짜가 다르게 보이지 않는다.
- 320px Web과 소형 모바일에서도 캘린더가 가로로 넘치지 않는다.

### Phase 4. D-Day

목표: 목표와 오늘 실행을 연결한다.

- [x] D-Day 목록과 남은 날짜 표현
- [x] 목표 생성과 유효성 검사
- [x] 목표 삭제 확인
- [x] 연결된 할 일 펼침 목록
- [x] 목표에서 Today 할 일 생성
- [x] Task 상세에서 목표 연결과 해제

완료 기준:

- 목표를 만들고 그 목표에 연결된 오늘 행동을 한 흐름에서 추가할 수 있다.
- 위험한 삭제는 실수로 실행되지 않는다.

### Phase 5. More, 기록함, 완료 로그

목표: Today 밖의 항목을 찾고 정리하며 성취를 확인한다.

- [x] More 허브 화면
- [x] 기록함 전체 목록과 카테고리 그룹
- [x] 기록함 항목의 Today/내일 이동
- [x] 일별·주별 완료 로그
- [x] 조용한 완료 요약
- [x] 검색·필터 화면의 API 요구사항 문서화

완료 기준:

- 날짜 없는 기록을 잃지 않고 주기적으로 정리할 수 있다.
- 완료 기록을 날짜별로 확인할 수 있다.

### Phase 6. 전반적인 UI/UX 개편과 Today 집중 구조 정리

목표: 큰 카드와 과도한 설명을 반복하는 현재 화면을 조밀하고 정돈된 생산성 목록 구조로 개편한다. 단말 폭과 글꼴 배율이 달라도 같은 정보 우선순위를 유지하고, 첫 화면에서 핵심 데이터와 행동을 바로 찾게 한다.

- [x] 320px Web, 375pt iPhone, 430dp Android에서 현재 화면의 first viewport 기준선 기록
- [x] `TODAY` pill, 큰 인사, 날짜 카드를 compact top bar로 통합
- [x] 날짜는 한 번만 표시하고 인사·설명은 빈 상태나 시간대별 보조 문구로 제한
- [x] 빠른 기록 카드를 한 줄 composer 또는 하단 고정 추가 버튼으로 축소
- [x] Today 실행 Task를 header 바로 다음의 최우선 content로 이동
- [x] `오늘의 흐름` 중복 제목과 5분할 요약 카드 제거 또는 한 줄 진행 요약으로 축소
- [x] 지난 미완료와 추천을 badge가 있는 compact entry 또는 sheet 진입점으로 변경
- [x] 일정이 없으면 일정 section을 숨기고, 있으면 시간순 compact list로 표시
- [x] 완료 section은 기본 접힘 상태로 두고 완료 수와 펼치기 행동만 표시
- [x] typography, spacing, radius, button, card token을 compact UI 기준으로 조정
- [x] 공통 `PageHeader`, `SectionHeader`, `IconButton`, compact action 패턴 구성
- [x] 영문 eyebrow와 반복 설명을 제거하고 페이지 제목 + 선택적 한 줄 설명으로 통일
- [x] Task card를 52–60px 기반 `CompactTaskRow`와 divider 목록으로 재설계
- [x] 완료 control의 보이는 크기는 20–24px, 독립 hit area는 44×44pt로 분리
- [x] Task의 큰 accent bar와 반복 badge를 제거하고 metadata를 한 줄 우선순위로 정리
- [x] Today의 위/아래 버튼을 제거하고 mobile long press, Web drag handle 재정렬 적용
- [x] 접근성·키보드 대체 행동으로 overflow menu의 위/아래 이동 유지
- [x] target index 또는 ordered IDs 기반 재정렬 API 요구 계약 문서화
- [x] scroll 중에도 빠른 추가에 접근할 수 있는 FAB 또는 sticky composer 검증
- [x] divider Task row를 60–72px 개별 compact card와 8px gap으로 조정
- [x] 완료 control을 20×20px radius 5–6px rounded square로 변경하고 44×44pt hit area 유지
- [x] 일정을 56–68px 시간 중심 개별 `ScheduleCard`로 변경하고 drag 제외
- [x] 시간이 있는 일정에도 20×20px 완료 control을 추가하고 시간 고정 열과 행동 영역 분리
- [x] compact typography를 title 20px, body large 16px, body 14px로 최종 조정
- [x] Today 진행 요약 card 제거
- [x] Today 과부하 meter 제거하고 필요한 경우 한 줄 안내로 축소
- [x] 지난 미완료·추천·기록함을 `정리할 항목` 단일 navigation row로 통합
- [x] Today에서 기록함 Task 전체 목록 제거하고 Inbox 화면과 FAB로 역할 분리
- [x] 새로고침 text button을 제거하고 pull-to-refresh만 유지
- [x] 완료 목록은 count와 펼치기만 있는 한 줄 접힘 유지
- [x] Today header, section 간격, 일정, 보조 목록을 compact 정보 계층으로 마감
- [x] Calendar 주/월 segmented control, icon navigation, 날짜 선택, compact Task·Schedule card 적용
- [x] D-Day 숫자 중심 목표 card, overflow action, 접힌 연결 Task, 생성 sheet 검토
- [x] More의 104px destination card를 52–60px navigation row로 변경
- [x] Inbox category와 compact card를 정리하고 Today/내일 text button을 swipe·overflow action으로 변경
- [x] Completed 통계보다 완료 card를 우선하고 주 navigation·날짜 선택·요약 밀도 정리
- [x] Task 작성 form의 제목·유형 우선순위와 설명·카테고리 점진적 펼치기 적용
- [x] Task 상세의 날짜·시간 quick action 우선순위와 정보·D-Day·삭제 영역 compact 정리
- [x] 빈 상태·오류·로딩을 큰 card보다 compact inline state 중심으로 통일
- [x] 긴 목록과 초기 진입 화면에 skeleton row가 실제로 필요한 구간을 선별해 적용
- [x] 320–359 compact, 360–399 regular, 400–599 wide mobile 반응형 규칙 적용
- [x] 600–839 tablet과 840px 이상 Web에서 readable width와 확장 layout 검증
- [x] light/dark와 iOS Dynamic Type, Android font scale 1.0/1.3/1.5 점검
- [x] 키보드, VoiceOver/TalkBack, focus-visible, browser zoom 200%, reduced motion 점검
- [x] portrait/landscape, safe area, 키보드, 하단 탭과 고정 CTA 겹침 공통 layout 대응
- [x] Android, iOS, Web production bundle smoke test
- [ ] Android, iOS, Web 실제 기기·브라우저 비교 smoke test — 실기기와 인앱 브라우저 연결 대기
- [x] 확정된 규칙을 `DESIGN.md`와 theme/component token에 최종 동기화

#### Phase 6 후속. 시각 완성도와 목록 일관성

목표: compact 구조는 유지하면서 일정·완료·캘린더의 정렬과 색상 사용을 다듬어 더 직관적이고 완성도 있는 화면으로 만든다.

1. More 세로 navigation 복원
   - [x] 840px 이상 Web에서도 More 목적지를 가로 tile로 전환하지 않고 세로 row 유지
   - [x] `icon → title/optional description → chevron` 정렬과 52–60px 높이 통일
   - [x] row 사이 divider와 pressed/focus surface를 유지하고 한 화면에서 주요 목적지를 모두 확인
2. 일정 card 정렬
   - [x] `ScheduleCard`의 고정 시간 열을 제거하고 제목 아래 첫 metadata로 `시작–종료 시간` 이동
   - [x] 구조를 `rounded-square 완료 control → 제목/metadata → 상세 affordance`로 통일
   - [x] 종일 일정은 시간 자리에 `종일`, 시간이 있는 일정은 `14:00–14:30` 형식으로 표시
   - [x] 320px와 font scale 1.5에서 시간 때문에 제목 영역이 비정상적으로 좁아지지 않는지 검증
3. 완료 목록 compact 통일
   - [x] Today의 완료 Task에서 상시 `다시 열기` 하단 행 제거
   - [x] 완료 check 재선택 또는 overflow action으로 다시 열기 제공
   - [x] Today와 완료 기록의 완료 card 높이·padding·제목 시작선을 미완료 `TaskCard`와 통일
   - [x] 완료 metadata를 `완료 HH:mm · category · D-Day` 한 줄 우선순위로 정리
4. semantic accent 보강
   - [x] 일정 시간은 primary, 완료 check는 success, D-Day·오늘 마감은 warning으로 의미 기반 색상 분리
   - [x] section count, selected filter, feedback에 soft surface를 제한적으로 적용
   - [x] card 전체 색칠과 임의 category 무지개색은 사용하지 않고 light/dark 대비 테스트 유지
   - [x] neutral surface가 연속될 때 icon background, 2–3px accent, metadata 중 한 방식만 선택해 리듬 추가
5. Calendar visual refresh
   - [x] 월 제목·이전·다음 navigation을 한 줄 compact header로 재구성
   - [x] 선택 날짜는 primary-soft fill, 오늘은 outline 또는 dot로 역할 분리
   - [x] 날짜 cell의 불필요한 border와 중첩 card 느낌을 줄이고 grid 여백 정리
   - [x] 선택 날짜와 아래 Task 목록의 gap을 줄여 소속 관계 강화
   - [ ] 일정·완료·미룸·D-Day 상태 dot은 cell당 최대 3개, 초과 시 count로 축약 — 백엔드 범위 조회 계약 대기
   - [x] 주간/월간 전환 시 정보 위치가 크게 점프하지 않고 320px에서 가로 overflow가 없는지 검증
6. 제품 매력과 interaction polish
   - [x] section별 icon·accent 사용 위치를 한 곳으로 제한하고 동일 의미에 동일 색상 적용
   - [x] pressed·selected·focused 상태를 surface와 outline로 명확히 구분
   - [x] 완료 feedback은 150–220ms check 변화와 짧은 success message 중심으로 통일
   - [x] 빈 상태와 설명 문구를 다시 검토해 반복 문구·큰 illustration·불필요한 card 제거
   - [x] 주요 탭에서 추가 행동의 위치와 모양을 일관되게 유지
7. 마감 검증
   - [ ] Today, Calendar, Completed를 320px·375pt·430dp와 light/dark에서 비교 — 실제 화면 연결 대기
   - [ ] 제목 두 줄, 긴 시간 범위, category 없음, 완료 항목 10개 이상 상태 점검 — 실제 화면 연결 대기
   - [x] 완료·다시 열기·일정 상세의 touch target과 VoiceOver/TalkBack label 재검증

#### Phase 6 후속 2. 일정 중심 Today와 기간 캘린더

목표: 사용자가 Today를 열자마자 오늘의 시간 제약과 실행할 일을 순서대로 이해하고, 여러 날에 걸친 일정을 Calendar에서 하나의 연속된 기간으로 인식하게 한다.

1. Today 상단과 추가 동선
   - [x] Today header의 중복 `+`를 제거하고 하단 FAB를 유일한 빠른 기록 진입점으로 유지
   - [x] Today 정보 순서를 `header → 오늘과 겹치는 일정 → 오늘 할 일 → 정리할 항목 → 접힌 완료`로 변경
   - [x] 일정이 없을 때 빈 영역 없이 오늘 할 일이 header 바로 아래로 올라오는지 검증
   - [x] 일정은 최대 2개만 미리 보여 주고 초과 일정은 Calendar 전체 보기로 연결해 첫 Task 공간 확보
2. 실행 Task 재정렬
   - [x] Task card의 `⋯`와 펼쳐지는 위/아래 버튼 행 제거
   - [x] 모바일 long press drag와 Web drag handle만 기본 화면에 표시
   - [x] VoiceOver·TalkBack accessibility custom action과 Web keyboard 재정렬 대체 동선 제공
3. 정리할 항목 재설계
   - [x] Today 안에서 지난 미완료·추천·기록함 카드를 직접 펼치는 구조 제거
   - [x] bottom sheet 또는 전용 정리 화면에서 `지난 미완료 / 추천 / 기록함`을 명확한 section으로 분리
   - [x] 각 항목의 기본 행동을 `오늘로 이동 / 오늘에 추가 / 기록함 열기`로 구체화하고 빈 상태·오류 복구 설계
   - [x] 전용 정리 화면의 뒤로 가기, 읽기 순서, keyboard scroll과 safe area 검증
4. 여러 날 일정의 Today 표현
   - [x] `startAt < 내일 시작 && endAt > 오늘 시작`인 겹침 기준과 mock 회귀 테스트를 [`API_SCHEDULE_RANGE.md`](./API_SCHEDULE_RANGE.md)에 문서화
   - [ ] 백엔드 Today·Calendar 범위 조회가 같은 겹침 기준과 원본 일정 ID를 반환하는지 확인 — 백엔드 구현 확인 대기
   - [x] 여러 날 일정을 한 카드로 표시하고 `진행 중`, `오늘 시작`, `오늘 종료` 상태와 전체 날짜 범위 제공
   - [x] 종일·시간 지정·종료일 없음·자정 exclusive 종료·서울 timezone과 DST 비적용 경계 사례 정의
   - [x] 같은 일정이 날짜별 Task처럼 중복 표시되거나 Today 실행 순서 drag에 포함되지 않도록 분리
5. Calendar 기간 bar
   - [x] 주간·월간 grid에 여러 날 일정의 시작일부터 종료일까지 이어지는 한 줄 bar 추가
   - [x] 주 경계 continuation, 월 바깥 날짜 clipping, 겹침 lane, 최대 노출 수와 `+N` 축약 규칙 적용
   - [x] bar 선택 시 일정 상세를 열고 선택 날짜 목록에도 동일 일정이 한 번만 나타나도록 연결
   - [x] 기간 bar를 여러 날 일정에만 제한하고 제목 한 줄 생략·semantic theme 색상·확장 touch target 적용
   - [ ] 320px, font scale 1.5, light/dark 실제 화면 비교 검증 — 인앱 브라우저 연결 대기
6. 유사 사용성 점검
   - [x] 동일 목적의 추가 버튼, overflow, chevron이 한 화면에서 중복되지 않는지 전 화면 점검
   - [x] 눌렀을 때 펼침·이동·완료 중 무엇이 일어나는지 label과 affordance만으로 예측 가능한지 점검
   - [x] 일정 metadata와 접근성 label에 `일정` 역할을 명시해 실행 Task와 구분
   - [ ] 첫 viewport에서 일정과 최소 한 개의 오늘 Task를 확인할 수 있고 정리 UI가 핵심 목록을 밀어내지 않는지 검증

#### Phase 6 후속 3. Quiet Paper Planner 전면 개편

목표: 데모 dashboard처럼 보이는 반복 카드 UI를 걷어내고, 매일 펼쳐 쓰는 차분한 paper planner라는 하나의 시각 언어로 Today와 Calendar를 다시 구성한다.

1. theme foundation
   - [x] warm paper background, sheet surface, ink text, notebook rule, muted highlighter token 적용
   - [x] primary blue 의존도를 낮추고 sage·amber·powder blue를 의미 기반 accent로 제한
   - [x] light/dark 대비 테스트와 기존 semantic success·warning·danger 재조정
2. component language
   - [x] 기본 목록을 반복 card보다 flat row와 얇은 rule 중심으로 변경
   - [x] radius, pill, border 사용 위치를 입력·선택·떠 있는 surface로 제한
   - [x] PageHeader, section label, date column, checkbox, metadata의 planner 문법 통일
3. Today weekly planner
   - [x] Today 상단에 높이 100–140px의 compact 7일 strip 추가
   - [x] 상단은 월·요일·날짜·상태 점만 유지하고 우측 `언젠가`·통계·filter action은 추가하지 않음
   - [x] 오늘 날짜, 하루 일정 점, 여러 날 일정 bar를 한 주 안에서 표시
   - [x] 주간 strip 아래 정보 순서를 `선택 날짜 일정 → 오늘 Task → 정리 → 완료`로 유지
   - [x] 주간 정보가 첫 실행 Task를 viewport 밖으로 밀어내지 않도록 preview 수 제한
4. Calendar monthly planner
   - [x] Calendar의 주/월 toggle을 제거하고 월간 planner 전용 화면으로 단순화
   - [x] 6주 grid에 하루 일정 label과 여러 날 일정 연속 bar 배치
   - [x] 선택 날짜는 ink outline, 오늘은 highlighter dot, 기간 일정은 muted bar로 구분
   - [x] 일정이 많은 날짜는 최대 2개 lane과 `+N`으로 축약하고 아래 상세 목록 연결
5. navigation 재구성
   - [x] 하단 탭을 `오늘 / 달력 / 프로필`로 단순화
   - [x] `D-Day` 독립 탭을 제거하고 프로필 목표 관리로 이동
   - [x] `더보기`를 프로필로 대체하고 완료 기록·설정 navigation 구성
   - [x] 루틴·통계·피드는 별도 탭으로 만들지 않고 실제 제품 기능이 생길 때만 재검토
   - [x] 빠른 추가는 Today FAB로 유지하고 tab bar에 action button을 넣지 않음
6. 화면 확장
   - [x] D-Day, Completed, Task form/detail을 같은 paper surface와 rule list로 변경
   - [x] D-Day 목표 목록과 연결 Task를 공통 planner section·compact outlined row로 변경
   - [x] Completed의 주 선택·완료 목록·요약을 compact planner row로 변경
   - [x] Task 작성 form을 flat paper sheet·quiet input·ghost 취소 action으로 변경
   - [x] Task 상세의 hero·정보·날짜·목표·삭제 영역을 outlined planner section으로 변경
   - [x] empty/loading/error/feedback가 테마를 깨는 큰 demo card처럼 보이지 않도록 재정리
   - [x] Today의 전체·부분·mutation 오류와 성공 피드백을 공통 compact `InlineNotice`로 변경
   - [x] 정리할 항목의 조회·이동 오류와 성공 피드백을 `InlineNotice`로 변경
   - [x] 목표 목록과 연결 Task의 loading·error 상태를 compact row·`InlineNotice`로 변경
   - [x] 완료 기록의 조회·재열기 오류와 retry를 `InlineNotice`로 변경
   - [x] Task 상세의 잘못된 주소·조회·D-Day 연결 오류와 retry를 `InlineNotice`로 변경
   - [x] Calendar 선택 날짜의 조회·완료 오류와 retry를 `InlineNotice`로 변경
   - [x] Task 날짜 빠른 변경의 성공·오류 피드백을 `InlineNotice`로 변경
   - [x] Task 작성·수정 폼의 서버 제출 오류를 필드 검증과 분리해 `InlineNotice`로 변경
   - [x] D-Day 목표 생성 폼의 서버 제출 오류를 필드 검증과 분리해 `InlineNotice`로 변경
   - [x] D-Day Today Task 폼의 서버 오류를 입력 검증과 분리해 `InlineNotice`로 변경
   - [x] 빠른 기록의 입력 검증·서버 오류·저장 성공 피드백을 역할별로 분리
   - [ ] 320px·375pt·430dp, font scale 1.5, light/dark 실제 비교
7. 달력 밀도와 navigation 후속
   - [x] 월간 6주 row 높이를 고정하고 주 사이에 얇은 paper rule을 표시
   - [x] 일 단위 열 경계에 저대비 hairline을 추가해 날짜 칸 구분
   - [x] 시간이 있는 하루 일정도 시작 시간과 제목을 월간 grid에 표시
   - [x] Today 주간 strip에도 하루 시간 일정 label을 표시해 점만으로 숨기지 않음
   - [x] 기록함을 하단 탭에서 제거하고 `오늘 / 달력 / 프로필` 3탭으로 단순화
   - [x] 숨겨진 Inbox route·전용 화면·과거 More navigation 잔여 코드 제거
   - [x] Task·일정 row에 작은 간격과 낮은 radius outline을 적용하고 임의 색상은 배제
   - [x] Task row 내부 배경을 radius에 clip해 밝은 꼭짓점 artifact 제거
   - [x] Today 실행 순서 drag handle과 reorder interaction 제거
   - [x] Today 재정렬 전용 UI hook·helper·명칭을 제거하고 일반 실행 목록으로 정리
   - [x] Calendar의 보조 `오늘로 이동` 버튼을 제거하고 이전·다음 달 navigation만 유지
   - [x] 날짜 grid·하루 일정·기간 bar의 좌우 inset을 통일해 일 경계 밖 overflow 방지
   - [x] 정리할 항목의 큰 채움 action을 compact ghost action으로 낮추고 back button surface 제거
   - [x] 정리할 항목 화면을 Today와 같은 compact section·rule list 문법으로 전면 정리
   - [ ] 과거 Task·일정·완료 기록을 날짜와 키워드로 찾는 통합 검색을 프로필에서 제공
   - [ ] 검색 API의 기간·키워드·상태 filter, pagination, timezone 계약을 백엔드와 확정
   - [x] 통합 검색의 관련 날짜·결과 schema·정렬·cursor 요구사항을 문서화
8. UI/UX 회귀 점검
   - [x] Today 주간 strip에 outline surface와 날짜별 저대비 세로 rule 적용
   - [x] 일정·오늘 할 일·완료 section marker를 amber·blue·sage로 구분
   - [x] Profile 목적지를 독립 rounded row와 의미 기반 accent icon으로 변경
   - [x] 빠른 기록 placeholder·input inset·focus outline·저장 피드백 문구 정리
   - [x] Today·Calendar·Profile에 동일한 `PageHeader` title 계층 적용
   - [x] Today section marker를 semantic 원색 대신 pastel highlighter token으로 변경
   - [x] Today 주간 strip의 일정 label과 중복되는 일정 존재 dot 제거
   - [x] Calendar의 today dot은 일정 표시가 아닌 현재 날짜 표시로 역할을 제한
   - [x] warm paper background를 밝게 조정하고 pastel marker에 얇은 semantic outline 추가
   - [x] Calendar의 작은 일정 label·기간 bar·`+N`에 44pt 터치 범위와 keyboard focus outline 적용
   - [x] Today 정리 진입 row와 항목 이동 action에 keyboard focus outline 적용
   - [x] Today 주간 날짜 버튼에 현재 날짜 selected state와 keyboard focus outline 적용
   - [x] Profile destination row에 명시적 screen reader label과 keyboard focus outline 적용
   - [x] Task 유형 radio에 checked·disabled 상태와 구분되는 keyboard focus outline 적용
   - [x] 빠른 기록 input에 검증 오류와 구분되는 keyboard focus border 적용
   - [ ] 320px·375pt·430dp에서 calendar cell, event bar, `+N` clipping 비교
   - [x] Today·정리할 항목·완료·D-Day의 row radius, inset, action 높이를 같은 규칙으로 통일
   - [ ] light/dark와 font scale 1.5에서 hairline 대비와 텍스트 생략 상태 확인
   - [ ] touch target, keyboard focus, screen reader label이 시각 단순화 후에도 유지되는지 검증

#### Phase 6 후속 4. 반복 Task와 일정

목표: 매주 화요일 09:00 회의처럼 반복되는 실행 항목과 일정을 occurrence별로 계획하고 완료한다.

- [x] 반복 규칙과 occurrence API 요구사항을 [`API_RECURRENCE.md`](./API_RECURRENCE.md)에 문서화
- [ ] 백엔드 recurrence series, RRULE, occurrence, exception 계약 확정
- [ ] Task 작성 화면에 반복 없음·매일·매주·매월·사용자 지정 선택 추가
- [ ] `이번만 / 이후 모두 / 전체` 수정·삭제 범위 선택 UI
- [ ] Today·Calendar 범위 조회에 occurrence 표시
- [ ] occurrence별 완료·미룸·건너뛰기와 완료 기록 연결
- [ ] 반복 일정과 로컬 알림의 책임 분리

완료 기준:

- 375pt iPhone 기본 글꼴에서 첫 viewport 안에 오늘 실행 Task가 최소 한 개 보인다.
- 사용자는 초기 화면에서 추가 또는 완료 행동을 한 번의 탭으로 시작할 수 있다.
- 실행 Task 전에 영구적으로 노출되는 큰 카드는 최대 한 개다.
- 지난 미완료, 추천, 완료는 필요할 때 펼칠 수 있지만 실행 목록을 밀어내지 않는다.
- 같은 날짜, 제목, 진행 정보가 서로 다른 카드에서 반복되지 않는다.
- Android, iOS, Web에서 정보 우선순위는 같고 플랫폼별 navigation 관습만 다르다.
- 320px부터 599px까지 폭이 바뀌어도 수평 overflow나 잘린 핵심 행동이 없다.
- 큰 글꼴에서는 보조 설명과 metadata가 먼저 줄고 Task 제목과 핵심 행동은 유지된다.
- 한 줄 Task card는 기본 60–72px 밀도를 목표로 하며 보이는 rounded-square 완료 control이 hit area 전체를 채우지 않는다.
- 일정은 완료 control과 제목 아래 시간 metadata를 가진 Schedule card로 Task와 구분된다.
- Today 기본 화면에는 일정, 오늘 Task, 정리 진입점, 접힌 완료 외의 요약·전체 목록이 상시 노출되지 않는다.
- 목록의 이동·날짜 변경 같은 보조 행동은 상시 text button 행으로 세로 공간을 차지하지 않는다.

#### First viewport 기준선 기록 (2026-06-30)

검증 범위:

- Expo Web 서버 기준으로 현재 코드 구조와 spacing token을 확인했다.
- 자동 브라우저 연결은 인앱 브라우저 세션 부재와 플러그인 캐시 문서 경로 불일치로 막혀, 실제 픽셀 스크린샷 대신 현재 컴포넌트 순서와 최소 높이 기준으로 기록한다.
- 실제 기기 smoke test는 Phase 6 후반의 Android, iOS, Web 비교 항목에서 다시 수행한다.

공통 viewport 기준:

| 기준          |    폭 | 해석                                                                                   |
| ------------- | ----: | -------------------------------------------------------------------------------------- |
| 320px Web     | 320px | 가장 좁은 Web 회귀 기준. padding과 긴 한글 제목이 콘텐츠를 밀어내는지 확인한다.        |
| 375pt iPhone  | 375pt | Phase 6 완료 기준의 주 기준. 첫 viewport 안에 오늘 실행 Task가 최소 한 개 보여야 한다. |
| 430dp Android | 430dp | 넓은 Android 기준. 정보 우선순위는 같고 한 줄 표시 여유만 늘어나야 한다.               |

추가 반응형 검증 범위:

| 구간                | 검증 내용                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| 320–359 compact     | 한글 제목, page description, action이 겹치지 않고 수평 버튼 묶음이 세로로 안전하게 전환되는지 확인 |
| 360–399 regular     | 375pt iPhone을 주 기준으로 목록 밀도와 한 손 조작 확인                                             |
| 400–599 wide mobile | 넓은 Android에서 control과 글자가 불필요하게 커지지 않는지 확인                                    |
| 600–839 tablet      | readable width와 필요 시 2열/master-detail 전환 가능성 확인                                        |
| 840px+ Web          | max width, hover, drag handle, focus-visible, keyboard navigation 확인                             |

현재 화면별 first viewport 상태:

| 화면     | 첫 화면에 먼저 보이는 요소                                                                     | 현재 문제/관찰                                                                                                                                            | Phase 6 적용 방향                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Today    | `TODAY` pill, 큰 인사, 설명, 날짜 카드, 빠른 기록, `오늘의 흐름` heading, 5분할 요약 카드      | 실행 Task보다 장식/요약/정리 정보가 먼저 쌓인다. 지난 미완료와 추천이 있으면 `오늘 실행할 일`은 더 아래로 밀린다. 375pt 기준 완료 조건을 만족하기 어렵다. | top bar를 compact header로 합치고, 빠른 기록은 한 줄 composer 또는 FAB로 축소한다. 실행 Task를 header 바로 다음으로 이동한다.               |
| Calendar | `CALENDAR` label, 주간/월간 제목과 설명, mode switch, calendar card, 이전/오늘/다음 navigation | 첫 화면 안에 날짜 선택 맥락은 잘 보이지만, 320px에서는 navigation 버튼 3개가 좁고 일정 상세가 아래로 밀린다.                                              | header 문구를 줄이고 날짜 card와 상세 list 사이의 gap을 줄인다. 주/월 상태 점 API 연결 후에도 날짜 셀이 가로 overflow 없이 유지되어야 한다. |
| D-Day    | `D-DAY` label, 제목/설명, `새 D-Day 만들기`, 로딩/빈 상태/첫 목표 카드                         | CTA가 먼저 보이는 구조는 좋다. 다만 목표가 많거나 생성 form이 열리면 첫 목표 카드가 아래로 밀릴 수 있다.                                                  | header를 Today와 같은 compact 계층으로 맞추고, 생성 form은 필요 시 sheet/inline compact form 중 하나로 제한한다.                            |
| More     | `MORE` label, 제목/설명, 기록함/완료 기록/설정 카드                                            | 목적지는 명확하지만 각 카드 최소 높이가 104라 320px에서는 메뉴 2개 전후만 보인다.                                                                         | More는 허브 성격을 유지하되 header를 compact하게 줄이고 카드 밀도를 낮춰 첫 화면에 주요 목적지 3개가 보이게 한다.                           |

핵심 결론:

- Today는 현재 `TodayHeader → QuickCapture → TodayOverview` 구조이고, `TodayOverview` 내부에서도 `오늘의 흐름` heading과 5분할 summary가 실행 Task보다 앞선다.
- Phase 6의 첫 번째 UI 커밋은 Today top area를 줄이는 작업보다, “실행 Task가 header 직후에 온다”는 정보 순서를 먼저 고정해야 한다.
- Calendar, D-Day, More도 compact header 규칙을 공유하되, Today만큼 구조적 재배치는 필요하지 않다.

### Phase 7. 네이티브 품질과 출시 준비

목표: 기능 시연이 아닌 매일 사용할 수 있는 앱으로 마감한다.

- [ ] 로컬 알림 요구사항과 백엔드 알림 책임 분리
- [ ] 앱 아이콘, splash, 상태바, safe area 최종 점검
- [ ] 햅틱, 키보드, 날짜 선택기의 플랫폼별 조정
- [ ] 오프라인/느린 네트워크 처리
- [ ] 접근성 라벨, 읽기 순서, 명암, 글꼴 확대 점검
- [ ] 성능 점검: 초기 진입, 긴 목록, 캘린더 렌더링
- [ ] 오류 로깅과 개인정보 정책 결정
- [ ] Android package, iOS bundle identifier, EAS profile 구성
- [ ] Android, iOS, Web smoke test

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

## 10. 초기 결정 기록

- 첫 진입 화면은 Today로 한다.
- 하단 탭은 `오늘`, `달력`, `기록함`, `프로필` 네 개로 개편한다.
- 인증 UI는 백엔드 인증 계약이 정해진 뒤 구현한다.
- 초기 개발은 현재 API 기능을 기준으로 하되 API URL과 mock을 교체할 수 있게 만든다.
- 로컬 UI 개발은 `EXPO_PUBLIC_API_MODE=mock`으로 더미 데이터를 사용하고, 백엔드 연동 테스트는 `EXPO_PUBLIC_API_MODE=real`과 `EXPO_PUBLIC_API_URL`로 실제 서버를 사용한다.
- 자연어 빠른 입력, 검색, 하위 작업, 주간 리포트는 핵심 모바일 흐름 이후에 진행한다.
- 네이티브 알림은 MVP 데이터 흐름이 안정된 뒤 추가한다.

## 11. 바로 다음 작업

다음 모바일 작업은 Phase 6 후속 3의 공통 planner header와 date column 정리다. 이어 Today에 compact 주간 strip을 추가하고 Calendar는 월간 planner 전용으로 단순화한다. 하단 navigation은 `오늘 / 달력 / 기록함 / 프로필`로 재구성하며 D-Day와 기존 More 목적지는 Today와 프로필로 이동한다. 반복 Task와 일정은 [`API_RECURRENCE.md`](./API_RECURRENCE.md)의 백엔드 계약이 확정되기 전까지 mock과 form UI를 실제 저장 기능처럼 노출하지 않는다.

Calendar, D-Day, More의 핵심 세로 흐름을 Phase 5까지 연결한 뒤 Phase 6에서 Today를 포함한 전반적인 UI/UX를 집중적으로 정리한다. 그전에도 사용을 막는 접근성, 키보드, 오류 상태와 명백한 정보 중복은 발견 즉시 수정한다.
