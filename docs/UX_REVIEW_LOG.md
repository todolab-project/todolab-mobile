# UX Review Log

ToDoLab Mobile의 화면을 “매일 열어도 피로하지 않은 네이버 모바일 앱 같은 단정함” 기준으로 점검하고, 수정 결정과 보류 이유를 기록한다.

이 문서는 구현 히스토리를 길게 남기기보다 다음 UI/UX 수정 단위를 고르는 데 집중한다.

## 리뷰 기준

- 첫 화면에서 바로 해야 할 일을 볼 수 있는가
- 같은 역할의 row, card, button이 화면마다 같은 모양과 밀도를 가지는가
- 한글 label이 짧고 바로 이해되는가
- 선, 여백, radius, 색상이 장식이 아니라 정보 구분에 쓰이는가
- 320px, 375pt, 430dp, font scale 1.5, light/dark에서 깨지지 않는가
- 터치 영역, focus outline, screen reader label이 시각 단순화 뒤에도 유지되는가

## 2026-07-14 소스 기준 리뷰

검토 범위:

- Today: `today-overview.tsx`, `today-week-strip.tsx`, `quick-capture.tsx`
- Calendar: `week-calendar.tsx`, `calendar-period-bars.tsx`
- 정리할 항목: `today-review-screen.tsx`
- Profile: `profile-overview.tsx`

실제 화면 캡쳐 비교는 다음 smoke test 때 추가한다.

### Today

좋은 점:

- 정보 순서가 `일정 → 오늘 할 일 → 정리할 항목 → 완료`로 정리되어 있다.
- 일정, 오늘 할 일, 완료 section marker가 서로 다른 색으로 구분된다.
- 완료 목록은 기본 접힘 상태라 첫 화면을 크게 차지하지 않는다.
- 정리할 항목은 Today 안에 모든 카드를 펼치지 않고 별도 화면으로 이동한다.

확인할 점:

- 주간 strip의 외부 border와 내부 세로 rule이 충분히 달력처럼 보이는지 실제 화면에서 확인한다.
- 주간 strip 안의 single-day label과 period bar가 날짜 column을 넘어가지 않는지 320px에서 확인한다.
- 일정 section과 오늘 할 일 section 사이 색 대비가 paper background에서 충분히 보이는지 확인한다.
- 완료 feedback `InlineNotice`가 목록 사이에 나타날 때 레이아웃을 밀어 사용자의 시선을 과하게 끊지 않는지 확인한다.

결정:

- Today는 큰 구조 변경보다 미니 달력의 선, label 정렬, section 색 대비를 먼저 다듬는다.
- 일정과 오늘 할 일의 row 문법은 계속 분리하되, 높이와 title 시작선은 같은 리듬으로 맞춘다.

다음 작업 후보:

1. Today 주간 strip의 border, column rule, label clipping을 실제 화면 기준으로 점검한다.
2. section marker의 파스텔 색과 outline 대비를 light/dark에서 재확인한다.
3. feedback notice가 너무 큰 경우 toast 또는 더 작은 inline 상태로 낮춘다.

### Calendar

좋은 점:

- 월간 planner 전용 구조라 주/월 toggle이 없어졌다.
- 이전/다음 달 navigation만 남아 조작이 단순하다.
- 6주 grid, 요일 row, 일 단위 column rule, 주간 horizontal rule이 코드상 분리되어 있다.
- 오늘 dot은 현재 날짜 표시로 역할이 제한되어 일정 표시와 겹치지 않는다.

확인할 점:

- `monthWeek` 내부 `marginHorizontal`과 column rule의 `left: 14.2857%`가 실제 날짜 cell의 좌우 경계와 정확히 맞는지 확인한다.
- 하루 일정 label과 여러 날 bar가 day column 밖으로 overflow하지 않는지 확인한다.
- 선택 날짜 outline, 오늘 dot, 일정 label, 기간 bar가 동시에 있을 때 과하게 복잡해지지 않는지 확인한다.
- 6주 row의 `minHeight: 120`이 작은 기기에서 아래 상세 목록을 너무 밀어내지 않는지 확인한다.

결정:

- Calendar는 디자인 변경보다 grid alignment와 overflow 검증을 우선한다.
- 일정이 많은 날짜는 더 화려하게 만들기보다 `+N`과 아래 상세 목록으로 넘긴다.

다음 작업 후보:

1. Calendar grid의 column rule과 date button width 기준을 하나의 상수/계산으로 묶는다.
2. day label과 period bar에 안전한 horizontal inset을 적용해 cell 밖 침범을 막는다.
3. 320px, font scale 1.5에서 row height와 상세 목록 진입성을 점검한다.

### 정리할 항목

좋은 점:

- `지난 미완료`, `추천`, `기록함`이 section으로 나뉘어 있다.
- 각 항목은 공통 `TaskCard`를 사용해 Today row와 문법이 이어진다.
- action label은 `+ 오늘`로 짧고 목적이 명확하다.

확인할 점:

- `+ 오늘` action이 모든 section에서 같은 의미로 읽히는지 확인한다. 지난 미완료는 “이동”, 추천/기록함은 “추가”에 가까워 문맥 차이가 있다.
- trailing action이 row 높이를 늘리거나 좁은 화면에서 제목 영역을 과하게 줄이지 않는지 확인한다.
- 뒤로 가기 icon이 PageHeader 안에서 다른 화면과 같은 무게로 보이는지 확인한다.

결정:

- 정리할 항목은 버튼을 크게 키우지 않고 compact action을 유지한다.
- 다만 action label은 실제 의미에 맞게 `오늘로`, `추가` 등 더 자연스러운 문구를 검토한다.

다음 작업 후보:

1. section별 action copy를 사용자가 이해하기 쉬운 한국어로 다듬는다.
2. 좁은 화면에서 trailing action 때문에 제목이 지나치게 줄지 않는지 확인한다.
3. 빈 상태와 완료 상태의 문구가 Today와 중복되거나 어색하지 않은지 확인한다.

### Profile

좋은 점:

- `목표`, `검색`, `완료 기록`, `설정`이 세로 row로 정리되어 있다.
- icon background에 파스텔 accent를 사용해 기능을 구분한다.
- 로그인 상태와 목적지 목록이 분리되어 있다.

확인할 점:

- Profile row의 `minHeight: 64`, icon 32, gap 12가 Today/정리할 항목 row와 같은 리듬으로 보이는지 확인한다.
- 로그인 버튼이 목적지 row보다 시각적으로 너무 강해 보이지 않는지 확인한다.
- 검색이 “과거 Task와 일정 찾기”를 약속하는 만큼 real API 미연결 상태 안내가 충분히 자연스러운지 확인한다.

결정:

- Profile은 dashboard card보다 네이버 홈 shortcut처럼 가벼운 destination list로 유지한다.
- 로그인 버튼은 기능적으로 필요하지만, 로그인 상태에서는 secondary로 낮춘 현재 방향을 유지한다.

다음 작업 후보:

1. Profile row와 Today review row의 radius, border, padding을 같은 토큰 기준으로 맞춘다.
2. 검색 진입 후 real API 준비 중 상태의 문구와 CTA를 다시 확인한다.
3. 설정/프로필 확장 전까지 불필요한 통계나 feed 진입점은 추가하지 않는다.

## 우선순위

1. Calendar grid alignment와 event bar overflow
2. Today 주간 strip의 경계, 내부 rule, 일정 label 정렬
3. 빠른 입력 placeholder와 feedback notice 밀도
4. 정리할 항목 action copy와 좁은 화면 제목 영역
5. Profile shortcut row의 spacing/radius 통일

## 진행 메모

### 2026-07-14 Calendar/Today grid alignment 1차 정리

- Calendar와 Today 주간 strip이 같은 7열 기준을 쓰도록 `calendar-layout.ts`에 column width와 boundary helper를 분리했다.
- 하루 일정 label cell에 horizontal inset과 overflow clipping을 추가했다.
- 기간 일정 bar container와 bar에 clipping/inset을 적용해 날짜 구간 밖으로 시각적으로 튀는 현상을 줄였다.
- `npm run validate` 통과.

남은 확인:

- 실제 화면에서 column rule과 날짜 button 경계가 정확히 맞는지 확인한다.
- 320px, font scale 1.5에서 label이 너무 빨리 잘리지 않는지 확인한다.
- 기간 bar가 주 시작/끝 날짜에서 어색하게 잘려 보이지 않는지 확인한다.

## 다음 리뷰 때 추가할 것

- 실제 화면 캡쳐 링크 또는 파일명
- 320px, 375pt, 430dp 비교 결과
- light/dark, font scale 1.5 비교 결과
- real API 데이터 기준 일정/Task가 많을 때의 밀도 평가
