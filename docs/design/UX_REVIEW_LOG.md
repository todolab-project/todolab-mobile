# UX Review Log

ToDoLab Mobile의 화면을 “매일 열어도 피로하지 않은 네이버 모바일 앱 같은 단정함” 기준으로 점검하고, 다음 UI/UX 수정 단위를 고르기 위한 문서다.

구현 날짜별 히스토리는 남기지 않는다. 오래된 결정 과정은 git history에 맡기고, 이 문서에는 현재 화면 판단과 앞으로 확인할 항목만 유지한다.

## 리뷰 기준

- 첫 화면에서 바로 해야 할 일을 볼 수 있는가
- 같은 역할의 row, card, button이 화면마다 같은 모양과 밀도를 가지는가
- 한글 label이 짧고 바로 이해되는가
- 선, 여백, radius, 색상이 장식이 아니라 정보 구분에 쓰이는가
- 320px, 375pt, 430dp, font scale 1.5, light/dark에서 깨지지 않는가
- 터치 영역, focus outline, screen reader label이 시각 단순화 뒤에도 유지되는가

## 현재 화면 판단

## 2026-08-02 Product Design audit 요약

캡처 기준:

- [`01 Today`](../audits/product-design-2026-08-02/01-today.png)
- [`02 Calendar`](../audits/product-design-2026-08-02/02-calendar.png)
- [`03 Profile`](../audits/product-design-2026-08-02/03-profile.png)
- [`04 정리할 항목`](../audits/product-design-2026-08-02/04-organize.png)
- [`05 Today FAB 수정 후`](../audits/product-design-2026-08-02/05-today-after-fab.png)

전반 판단:

- 흰 배경, 얇은 선, 낮은 채도의 section 색, 3-tab 구조는 `Quiet Paper Planner`와 “네이버 모바일 앱처럼 가볍게 여는” 방향에 맞다.
- Today는 첫 viewport에서 주간 strip, 일정, 오늘 할 일이 바로 보여 실행 중심성이 좋다.
- Calendar는 3주 grid와 선택 날짜 목록이 한 흐름으로 연결되어 오늘 주변 맥락을 빠르게 본다.
- Profile과 정리할 항목은 이전보다 단정하고 목적이 분명하다.

수정 반영:

- Today의 접힌 Quick Capture FAB가 `+ 기록` 라벨 폭 때문에 완료 section count와 충돌했다.
- 접힌 FAB를 54×54 icon-only 버튼으로 줄이고 접근성 label은 유지했다.
- 수정 후 캡처 기준으로 완료 section과의 충돌은 줄었다.

남은 확인:

- 실제 iOS/Android font scale 1.5, safe area, VoiceOver/TalkBack은 Web screenshot만으로 확정할 수 없다.
- Calendar의 일정 pill은 좁은 column에서 여전히 빨리 잘리므로 native font scale에서 cell overflow를 확인한다.
- icon-only FAB의 screen reader label, touch target, keyboard focus는 native QA에서 확인한다.

## 2026-07-30 Product Design audit 요약

Product Design plugin의 audit 기준으로 저장된 최신 screenshot을 다시 확인했다. 실시간 browser capture는 로컬 Expo 포트 연결 거절로 완료하지 못했으므로, 이 섹션은 `docs/screenshots/*.png` 기준의 visual audit이다.

전반 판단:

- 현재 화면은 이전보다 구조가 많이 정리되었지만, 아직 “완성된 상용 앱”보다는 “좋아지고 있는 MVP”에 가깝다.
- 네이버 모바일 앱이나 Figma 커뮤니티의 깔끔한 생산성 앱처럼 보이려면 기능 추가보다 visual polish와 interaction affordance를 먼저 마감해야 한다.
- 가장 큰 체감 개선 영역은 Calendar 일정 bar, Today/Calendar의 카드·선 무게, Quick Capture composer, 하단 tab active state, Profile 개인화 톤이다.

우선 수정 후보:

1. Calendar 이벤트 bar
   - 하루 일정 pill과 여러 날 일정 bar의 높이, 최소 너비, 텍스트 생략 규칙, column overflow 방지 기준을 다시 잡는다.
   - Calendar 안에서는 시간만 보여 주지 않고, 하루 column 폭을 활용해 일정 제목을 가능한 만큼 보여 준다. 시간은 아래 선택 날짜 목록과 accessibility label에서 보완한다.
2. Today 카드 위계
   - 일정, 오늘 할 일, 정리할 항목, 완료한 일이 모두 같은 border/card처럼 보이지 않게 section별 역할 차이를 만든다.
   - border를 많이 반복하기보다 여백, hairline, 아주 약한 tint로 정보 그룹을 분리한다.
3. Quick Capture
   - 열린 상태의 파란 기본 focus border는 앱의 차분한 톤과 맞지 않으므로 primary soft border, subtle shadow, bottom sheet형 composer 느낌으로 바꾼다.
   - keyboard, safe area, tab bar와 충돌하지 않는지 실제 기기에서 확인한다.
4. 하단 tab
   - active icon과 label 상태가 더 명확해야 한다.
   - 아이콘은 Today=sun/day, Calendar=calendar, Profile=person/settings destination 계열처럼 의미가 겹치지 않게 유지한다.
5. Profile
   - 단순 설정 목록이 아니라 “나의 플래너 공간”처럼 보이게 로그인 card의 여백, 동기화 상태, shortcut icon 리듬을 다듬는다.
   - 단, 불필요한 통계 카드나 feed 진입점은 추가하지 않는다.

접근성 확인 필요:

- Calendar 이벤트 텍스트가 너무 작거나 빨리 잘려 저시력 사용자가 의미를 놓칠 수 있다.
- icon-only 또는 축약 label이 screen reader에서 충분히 설명되는지 확인한다.
- Quick Capture와 하단 tab이 작은 화면에서 터치 충돌을 만들지 않는지 확인한다.
- 색상만으로 일정/완료/카테고리를 구분하지 않고 텍스트, 위치, icon을 함께 사용한다.

### Today

현재 방향:

- Today는 주간 strip, 일정, 오늘 할 일, 정리할 항목, 접힌 완료 목록 순서로 유지한다.
- 큰 page title이나 과한 안내 문구보다 첫 viewport에서 실제 일정과 할 일을 빨리 보여 준다.
- 일정과 오늘 할 일의 row 문법은 분리하되 checkbox, title, meta의 시작선과 밀도는 같은 리듬으로 맞춘다.
- 빠른 입력은 “할 일 입력”처럼 짧고 가벼운 copy를 쓴다.

2026-07-30 Web mock 점검 메모:

- 첫 viewport 안에 주간 strip, 일정 2개, 오늘 할 일 3개, 정리할 항목 진입점이 들어와 정보 구조는 이전보다 훨씬 좋아졌다.
- 다만 주간 strip 안의 일정 label이 `14:...`, `여러 날에 걸친 일정 UX...`처럼 빨리 잘려 “좁은 칸에 억지로 넣은” 느낌이 남아 있다.
- 네이버 모바일 앱처럼 가볍게 보이려면 미니 달력은 날짜 맥락과 일정 존재감만 전달하고, 정확한 제목/시간은 아래 일정 section이 담당하는 편이 좋다.
- 빠른 기록 composer는 손이 닿는 위치는 맞지만 하단 tab bar와 너무 가까워 “떠 있는 입력 bar”라기보다 화면 끝에 끼어 있는 느낌이 있다.
- composer가 열릴 때는 bottom sheet처럼 탭바 위에서 살짝 분리된 surface, 안정적인 여백, 은은한 shadow 또는 border를 사용한다.

다음 확인:

- Today 주간 strip의 border, column rule, label clipping이 실제 기기에서 깔끔한지 확인
- 일정 label과 여러 날 bar가 320px와 font scale 1.5에서 너무 빨리 잘리지 않는지 확인
- 완료 feedback notice가 목록 흐름을 과하게 밀지 않는지 확인
- 미니 달력 일정 bar를 더 추상적인 pill/dot/short marker로 바꿀 때 아래 일정 section과 정보가 중복되지 않는지 확인
- 빠른 기록 composer가 keyboard, safe area, tab bar와 충돌하지 않는지 확인

### Calendar

현재 방향:

- Calendar는 선택일 기준 이전 1주, 현재 주, 다음 1주의 3주 planner grid를 기본으로 한다.
- 좌우 이동은 선택 날짜 기준 1주 이동이다.
- 월 제목을 누르면 같은 폭의 월 선택 panel을 열 수 있고, panel은 달력과 목록을 과하게 밀지 않게 compact하게 유지한다.
- 일정이 많은 날짜는 칸 안에 모두 넣기보다 축약 label과 아래 선택 날짜 목록으로 넘긴다.

2026-07-30 Web mock 점검 메모:

- 3주 grid와 월 선택 panel은 기능적으로 이해하기 쉽지만, 카드 테두리, 내부 선, 날짜 숫자, 선택 outline, 일정 label이 동시에 보여 Calendar 영역의 시각 밀도가 아직 조금 높다.
- 네이버 앱 같은 단정함을 내려면 모든 선을 선명하게 보이게 하기보다, 날짜 grid는 배경에 가까운 hairline으로 낮추고 선택 날짜와 현재 달 title만 또렷하게 두는 편이 좋다.
- 하루 일정 label은 compact 모드에서도 시간만이 아니라 일정 제목을 가능한 만큼 보여 줘야 한다. 작은 시각 영역이라 실제 터치 가능 영역은 `hitSlop`에 의존하므로 실기기에서 누르기 쉬운지 확인해야 한다.
- 월 선택 panel은 3열 버튼으로 명확하지만, 열린 상태에서 Calendar grid가 아래로 많이 밀리므로 “달 선택 중”이라는 시각적 집중 상태를 더 분명히 주는 것이 좋다.

2026-07-31 Product Design audit 메모:

- Web static export 390×844 캡처 기준으로 하루 일정 pill의 크기와 위치는 안정적이지만, `14:00`만 보여 주면 무엇이 있는지 알기 어렵다. 이후 표시 기준을 제목 중심으로 전환한다.
- 여러 날 일정 bar는 7월 30일–8월 1일 구간 안에 머물며 column 밖으로 넘치지 않는다.
- Calendar 안의 일정 label은 하루 column 폭을 활용해 제목을 가능한 만큼 보여 주고, 정확한 시간·기간은 아래 `예정` 목록에서 읽게 한다.
- 최종 static export 확인에서 하루 일정 pill은 `14:00` 대신 일정 제목을 표시하도록 정리했다.
- 추가 확인 결과 하루 일정은 작은 badge가 아니라 해당 날짜 column 폭을 가능한 만큼 쓰는 편이 더 좋다. `백엔드 계약 확...`처럼 제목 일부가 보이면 사용자는 아래 `예정` 목록을 보지 않아도 무엇이 있는지 먼저 이해할 수 있다.
- Today 미니 달력도 같은 원칙을 따른다. 작은 시간 badge처럼 보이게 줄이지 않고 하루 column 폭 안에서 제목을 보여 주며, 정확한 시간은 아래 일정 목록과 accessibility label에서 보완한다.
- Quick Capture 열린 상태는 Web 390×844 캡처 기준 브라우저 기본 파란 focus ring 없이 흰 input surface와 1px primary-soft border로 보인다. composer 자체가 하단 sheet처럼 열리므로 focus 표시는 조용하게 유지하되, 오류 상태만 danger border로 강하게 구분한다.
- Today 일정 row는 처음 적용한 highlighter amber가 390px 화면에서 과하게 노랗게 보여, schedule 전용 surface로 한 단계 낮췄다. 최종 캡처 기준 일정은 시간 제약 항목으로 구분되지만 오늘 할 일 목록보다 더 강하게 튀지 않는다.
- Today, Calendar, Profile mock Web 390×844 캡처를 최신 UI로 갱신했다. 하단 tab은 각 화면에서 해당 icon pill과 label tone이 active 상태로 보이며, 현재 위치를 구분하는 데 충분하다.
- 다음 polish는 bar 자체보다 Calendar 전체의 선 대비, 선택 날짜 outline, 일정 label이 동시에 있을 때의 시각 밀도를 낮추는 쪽이 더 효과적이다.
- 2026-08-01 mock Web 390×844 캡처를 최신 상태로 다시 갱신했다. Today와 Calendar의 하루 일정 pill은 시간만 덩그러니 보이지 않고 제목 일부를 보여 주며, 기간 bar는 3주 grid column 안에 머문다.
- 1080×1920 마켓 이미지 초안은 `marketing-frame.html` 기반으로 생성했다. 카피 위계와 여백은 안정적이고 실제 UI를 과장하지 않는 장점이 있다. 다만 스토어 제출 전에는 폰 목업 안 화면을 더 크게 보이는 버전과 현재처럼 여백이 넓은 버전을 A/B로 비교한다.

다음 확인:

- column rule과 날짜 cell 경계가 실제 날짜 touch target과 정확히 맞는지 확인
- 하루 일정 label과 여러 날 bar가 day column 밖으로 overflow하지 않는지 확인
- 선택 날짜 outline, 오늘 dot, 일정 label, 기간 bar가 동시에 있을 때 과하게 복잡하지 않은지 확인
- 작은 화면에서 월 선택 panel이 주요 목록 진입성을 방해하지 않는지 확인
- Calendar grid의 테두리/내부 rule 대비를 더 낮춰도 날짜 구분성이 유지되는지 확인
- 월 선택 panel의 연도 이동 button도 최소 터치 영역 또는 충분한 hitSlop을 유지하는지 확인

### 정리할 항목

현재 방향:

- `지난 미완료`, `추천`, `기록함`을 section/list 중심으로 보여 준다.
- 버튼을 크게 나열하지 않고 `오늘로 ›`, `추가 ›`, `열기 ›`처럼 낮은 강조의 텍스트 action을 쓴다.
- 각 row는 Today Task row와 같은 radius, border, padding 체계를 따른다.

2026-07-30 Web mock 점검 메모:

- 실제 진입 경로(`/today/review`)는 정상이고, 화면은 이전보다 훨씬 담백하다.
- 다만 세 section이 모두 비슷한 흰 카드라 우선순위와 성격 차이가 약하게 느껴진다.
- `지난 미완료`, `추천`, `기록함`은 각각 의미가 다르므로 아주 약한 pastel icon, section tint, 또는 helper copy 차이로 “왜 이 항목을 봐야 하는지”가 더 빨리 이해되게 한다.
- trailing action(`오늘로 ›`, `추가 ›`)은 가볍고 좋지만 제목 영역을 잡아먹지 않게 긴 제목에서 줄바꿈과 터치 영역을 계속 확인한다.

다음 확인:

- `오늘로`와 `추가`가 실제 동작 차이를 충분히 설명하는지 확인
- 좁은 화면에서 trailing action 때문에 제목 영역이 지나치게 줄지 않는지 확인
- 빈 상태와 완료 상태 문구가 Today와 중복되거나 어색하지 않은지 확인
- section별 시각 차이를 넣더라도 Today의 실행 목록보다 강해지지 않는지 확인

### Search

현재 방향:

- 기본 filter는 먼저 보이고, 기간·D-Day·카테고리·정렬은 `상세 필터`로 접어 첫 화면 밀도를 낮춘다.
- 검색 화면은 안내 card보다 결과, 빈 상태, 필터 상태가 중심이 되게 한다.
- 과거에 어떤 일을 언제 했는지 찾는 기능은 Profile에서 접근 가능한 전역 탐색으로 유지한다.

다음 확인:

- 상세 필터가 접힌 상태에서도 사용자가 필터 기능을 발견할 수 있는지 확인
- real API 결과, 빈 상태, pagination 문구와 CTA가 자연스럽게 이어지는지 확인
- 기간 filter와 timezone 경계가 실제 데이터에서 의도대로 보이는지 확인

### Completed

현재 방향:

- 완료 Task는 Today compact card와 같은 밀도로 표시한다.
- 별도 `다시 열기` 버튼보다 완료 checkbox 자체가 다시 열기 역할을 하게 해 중복 action을 줄인다.
- 완료 목록은 기본적으로 성취 확인을 위한 로그이므로 Today의 실행 목록보다 시각적 무게를 낮춘다.

다음 확인:

- checkbox 다시 열기 동작이 사용자가 예상 가능한지 확인
- 긴 완료 title과 meta가 좁은 화면에서 과하게 답답하지 않은지 확인

### D-Day

현재 방향:

- 목표 목록과 연결된 할 일은 카드 안에서 너무 많은 액션을 한 줄에 넣지 않는다.
- 목표 메뉴는 작은 화면에서 읽기 쉬운 세로 액션을 기본으로 한다.
- 반복 일정과 D-Day는 기능 목적이 다르므로 copy와 badge를 혼동되지 않게 유지한다.

다음 확인:

- 목표 메뉴가 펼쳐질 때 card 높이가 과하게 길어 보이지 않는지 확인
- 목표 연결 label이 Today, Calendar, Search에서 같은 의미로 읽히는지 확인

### Profile

현재 방향:

- Profile은 dashboard card보다 네이버 홈 shortcut 같은 가벼운 destination list로 유지한다.
- `목표`, `검색`, `완료 기록`, `설정`은 row 높이, icon treatment, radius를 같은 토큰으로 맞춘다.
- 로그인 상태와 목적지 목록은 분리해 인증 UI가 기능 shortcut보다 과하게 강해 보이지 않게 한다.
- 상단 로그인 card에는 큰 페이지 제목을 되살리지 않고 `나의 플래너 공간` eyebrow만 추가한다. 하단 탭의 `프로필` label과 중복하지 않으면서, 설정 목록이 아니라 개인 공간이라는 맥락을 준다.
- Profile은 첫 콘텐츠가 너무 위에 붙지 않게 상단 여백을 조금 더 주고, shortcut row 간격과 focus border를 Today row 리듬에 맞춘다.

2026-07-30 Web mock 점검 메모:

- 현재 주요 화면 중 Profile이 가장 안정적으로 보인다. 로그인 card와 shortcut row의 구조가 명확하고, 불필요한 통계가 없어 가볍다.
- 아이콘 pastel surface도 앱의 전체 방향과 잘 맞는다.
- 단, Web DOM에서는 Symbol icon이 텍스트 glyph처럼 중복 노출되는 흔적이 있어 접근성/웹 렌더링 품질 관점에서 점검한다.

다음 확인:

- Profile row가 320px에서 description 생략 뒤에도 목적을 충분히 전달하는지 확인
- 설정/프로필 확장 전까지 불필요한 통계나 feed 진입점을 추가하지 않는다.
- 하단 tab과 Profile shortcut icon의 색·크기 리듬이 같은 제품처럼 보이는지 확인

## 우선순위

1. 실제 기기 기준 Today와 Calendar의 320px, 375pt, 430dp, font scale 1.5 확인
2. iOS VoiceOver와 Android TalkBack에서 Calendar 일정 bar, checkbox, tab, 빠른 기록 동선 확인
3. Search 상세 필터 discoverability와 real API pagination 화면 확인
4. 마켓 이미지의 폰 목업 크기와 카피 줄바꿈 A/B 비교
5. 반복 작성·수정 UI는 real smoke 통과 기준으로 열려 있으므로, 이후에는 실제 기기에서 form 입력과 scope 선택 흐름을 확인

## 다음 리뷰 때 추가할 것

- 실제 화면 캡쳐 링크 또는 파일명
- 320px, 375pt, 430dp 비교 결과
- light/dark, font scale 1.5 비교 결과
- real API 데이터 기준 일정/Task가 많을 때의 밀도 평가
