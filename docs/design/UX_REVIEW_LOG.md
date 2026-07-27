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

### Today

현재 방향:

- Today는 주간 strip, 일정, 오늘 할 일, 정리할 항목, 접힌 완료 목록 순서로 유지한다.
- 큰 page title이나 과한 안내 문구보다 첫 viewport에서 실제 일정과 할 일을 빨리 보여 준다.
- 일정과 오늘 할 일의 row 문법은 분리하되 checkbox, title, meta의 시작선과 밀도는 같은 리듬으로 맞춘다.
- 빠른 입력은 “할 일 입력”처럼 짧고 가벼운 copy를 쓴다.

다음 확인:

- Today 주간 strip의 border, column rule, label clipping이 실제 기기에서 깔끔한지 확인
- 일정 label과 여러 날 bar가 320px와 font scale 1.5에서 너무 빨리 잘리지 않는지 확인
- 완료 feedback notice가 목록 흐름을 과하게 밀지 않는지 확인

### Calendar

현재 방향:

- Calendar는 선택일 기준 이전 1주, 현재 주, 다음 1주의 3주 planner grid를 기본으로 한다.
- 좌우 이동은 선택 날짜 기준 1주 이동이다.
- 월 제목을 누르면 같은 폭의 월 선택 panel을 열 수 있고, panel은 달력과 목록을 과하게 밀지 않게 compact하게 유지한다.
- 일정이 많은 날짜는 칸 안에 모두 넣기보다 축약 label과 아래 선택 날짜 목록으로 넘긴다.

다음 확인:

- column rule과 날짜 cell 경계가 실제 날짜 touch target과 정확히 맞는지 확인
- 하루 일정 label과 여러 날 bar가 day column 밖으로 overflow하지 않는지 확인
- 선택 날짜 outline, 오늘 dot, 일정 label, 기간 bar가 동시에 있을 때 과하게 복잡하지 않은지 확인
- 작은 화면에서 월 선택 panel이 주요 목록 진입성을 방해하지 않는지 확인

### 정리할 항목

현재 방향:

- `지난 미완료`, `추천`, `기록함`을 section/list 중심으로 보여 준다.
- 버튼을 크게 나열하지 않고 `오늘로 ›`, `추가 ›`, `열기 ›`처럼 낮은 강조의 텍스트 action을 쓴다.
- 각 row는 Today Task row와 같은 radius, border, padding 체계를 따른다.

다음 확인:

- `오늘로`와 `추가`가 실제 동작 차이를 충분히 설명하는지 확인
- 좁은 화면에서 trailing action 때문에 제목 영역이 지나치게 줄지 않는지 확인
- 빈 상태와 완료 상태 문구가 Today와 중복되거나 어색하지 않은지 확인

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

다음 확인:

- Profile row가 320px에서 description 생략 뒤에도 목적을 충분히 전달하는지 확인
- 설정/프로필 확장 전까지 불필요한 통계나 feed 진입점을 추가하지 않는다.

## 우선순위

1. 실제 기기 기준 Today와 Calendar의 320px, 375pt, 430dp, font scale 1.5 확인
2. Calendar grid alignment와 event bar overflow 확인
3. Today 주간 strip의 경계, 내부 rule, 일정 label 정렬 확인
4. 정리할 항목 action copy와 좁은 화면 제목 영역 확인
5. Search 상세 필터 discoverability와 real API pagination 화면 확인

## 다음 리뷰 때 추가할 것

- 실제 화면 캡쳐 링크 또는 파일명
- 320px, 375pt, 430dp 비교 결과
- light/dark, font scale 1.5 비교 결과
- real API 데이터 기준 일정/Task가 많을 때의 밀도 평가
