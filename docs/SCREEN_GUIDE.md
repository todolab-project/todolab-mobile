# 화면 가이드

ToDoLab Mobile의 주요 화면을 실제 캡쳐와 함께 설명하는 문서다. 개발 문서, 백엔드 협업, QA, 데모 준비에서 “이 화면이 어떤 역할을 하고 어떻게 사용하는지”를 빠르게 공유하는 데 사용한다.

스크린샷은 `EXPO_PUBLIC_API_MODE=mock` 기준으로 먼저 촬영하고, 실제 백엔드 연결 검증이 끝나면 필요한 화면만 real 모드 캡쳐를 추가한다.

## 캡쳐 파일 위치

```text
docs/screenshots/
  today.png
  quick-capture.png
  calendar.png
  search.png
  completed.png
  profile.png
  task-detail.png
  dday.png
```

## 캡쳐 기준

- 기본 기준: 375pt iPhone 폭 또는 390px mobile viewport
- 보조 기준: 320px, 430dp, 720px Web
- Theme: light 우선, 필요 시 dark 별도 추가
- Data mode: mock 우선
- 상태: 주요 화면은 기본 상태, 필요 시 loading/error/empty 상태를 별도 캡쳐
- 캡쳐 전 `npm run validate`를 통과한 커밋을 기준으로 한다.

## Today

![Today 화면](./screenshots/today.png)

목적:

- 오늘 처리할 일정과 할 일을 한 화면에서 확인하고 바로 실행한다.
- 일정, 오늘 할 일, 정리할 항목, 완료한 일을 우선순위에 따라 보여준다.

사용 흐름:

1. 앱을 열면 Today 화면에서 오늘 날짜와 주간 날짜 strip을 확인한다.
2. 오늘 일정이 있으면 먼저 확인한다.
3. 오늘 할 일을 체크해 완료한다.
4. 생각난 일은 하단 빠른 기록으로 추가한다.
5. 지난 미완료, 추천, 기록함 항목은 정리할 항목에서 다시 판단한다.

주요 UI:

- 주간 날짜 strip
- 일정 section
- 오늘 할 일 section
- 정리할 항목 진입 row
- 접힌 완료 목록
- 빠른 기록 composer

개발 참고:

- Today는 앱의 중심 화면이다.
- 실행 Task 전에 영구적으로 노출되는 큰 정보 카드는 최대 한 개만 허용한다.
- 일정은 Task와 구분되는 Schedule card 문법을 사용한다.

## 빠른 기록

![빠른 기록](./screenshots/quick-capture.png)

목적:

- 사용자가 생각난 일을 즉시 기록함에 추가한다.

사용 흐름:

1. 하단 빠른 기록 버튼을 누른다.
2. 할 일을 한 줄로 입력한다.
3. 추가 버튼으로 저장한다.
4. 저장된 항목은 정리할 항목 또는 기록함에서 다시 Today로 옮길 수 있다.

주요 UI:

- 하단 composer
- 닫기 버튼
- 입력창
- 추가 버튼
- 저장 성공 feedback

개발 참고:

- 키보드가 열려도 composer와 추가 버튼이 가려지면 안 된다.
- 빠른 기록은 큰 작성 form이 아니라 “나중에 정리할 seed”에 가깝다.

## Calendar

![Calendar 화면](./screenshots/calendar.png)

목적:

- 월간 달력에서 하루 일정과 여러 날에 걸친 일정을 확인한다.
- 특정 날짜를 선택해 예정·완료 항목을 확인한다.

사용 흐름:

1. 월간 grid에서 날짜를 훑는다.
2. 하루 일정 label과 여러 날 일정 bar를 확인한다.
3. 날짜를 선택해 하단 목록을 확인한다.
4. 일정 또는 Task를 눌러 상세로 이동한다.

주요 UI:

- 월 이동 controls
- 월간 calendar grid
- 하루 일정 label
- 여러 날 일정 bar
- `+N` overflow
- 선택 날짜의 예정·완료 목록

개발 참고:

- 여러 날 일정은 날짜마다 복제하지 않고 하나의 원본 ID로 표시한다.
- Calendar의 일정 bar는 날짜 cell 경계를 넘지 않아야 한다.
- Calendar 범위 조회는 백엔드 계약 확인이 필요하다.

## Search

![Search 화면](./screenshots/search.png)

목적:

- 과거 Task, 일정, 완료 기록을 키워드와 필터로 찾는다.

사용 흐름:

1. 검색어를 입력한다.
2. 상태, 기간, D-Day, category, 정렬 조건을 조정한다.
3. 결과 row를 눌러 Task 상세로 이동한다.
4. 결과가 많으면 다음 페이지를 불러온다.

주요 UI:

- 검색 input
- 상태 filter
- 날짜 범위 filter
- D-Day filter
- category filter
- 정렬 filter
- 검색 결과 row

개발 참고:

- mock 검색은 이미 동작하지만 real API는 백엔드 검색 계약 확인이 필요하다.
- 검색 결과에는 관련 날짜와 date source가 함께 보여야 한다.

## Completed

![Completed 화면](./screenshots/completed.png)

목적:

- 완료한 일을 날짜별로 확인하고 필요하면 다시 오늘 할 일로 되돌린다.

사용 흐름:

1. 주 단위 날짜 picker에서 날짜를 선택한다.
2. 선택 날짜의 완료 목록을 확인한다.
3. 필요한 완료 Task를 다시 연다.

주요 UI:

- 주 이동 controls
- 날짜별 완료 count
- 선택 날짜 완료 목록
- 다시 열기 action

개발 참고:

- 완료 목록은 성취 확인이 목적이므로 과도한 통계보다 실제 완료 card를 우선한다.

## Profile

![Profile 화면](./screenshots/profile.png)

목적:

- 검색, 완료 기록, D-Day, 설정 등 보조 목적지로 이동한다.

사용 흐름:

1. 프로필 화면에서 원하는 목적지를 선택한다.
2. 검색, 완료 기록, 목표, 설정으로 이동한다.

주요 UI:

- 목적지 row list
- 목적별 accent icon
- title, description, chevron

개발 참고:

- Profile은 설정과 보조 기능의 hub다.
- 카드 grid가 아니라 세로 navigation row 문법을 유지한다.

## Task 상세

![Task 상세](./screenshots/task-detail.png)

목적:

- Task의 상세 정보, 날짜, 반복 여부, D-Day 연결 상태를 확인하고 수정한다.

사용 흐름:

1. 목록에서 Task를 선택한다.
2. 제목, 설명, 일정, 계획일, 목표일, 반복 여부를 확인한다.
3. 필요하면 수정하거나 삭제한다.
4. 날짜 빠른 변경으로 오늘·내일·7일 후·기록함으로 이동한다.

주요 UI:

- 상태 badge
- 제목/설명
- 날짜 빠른 변경
- 정보 section
- D-Day 연결 section
- 수정/삭제 action

개발 참고:

- 반복 정보는 표시만 제공하며, 반복 작성/수정 UI는 백엔드 계약 확정 전까지 실제 기능처럼 노출하지 않는다.

## D-Day

![D-Day 화면](./screenshots/dday.png)

목적:

- 목표 날짜가 있는 항목을 관리하고 Today Task로 연결한다.

사용 흐름:

1. D-Day 목표를 생성한다.
2. 목표까지 남은 날짜를 확인한다.
3. 목표와 연결된 오늘 할 일을 추가한다.

주요 UI:

- 목표 생성 form
- 목표 card
- D-Day label
- 연결 Task 목록
- Today 할 일 만들기 action

개발 참고:

- D-Day 관련 백엔드 500 응답 이슈는 real 모드 연동 시 확인이 필요하다.

## 캡쳐 후 업데이트 체크리스트

- [ ] 모든 이미지 파일명이 이 문서의 경로와 일치한다.
- [ ] 스크린샷이 mock 데이터 기준인지 real 데이터 기준인지 명시한다.
- [ ] 개인정보, 실제 일정, 실제 검색어가 이미지에 포함되지 않는다.
- [ ] README의 문서 링크가 최신 상태다.
- [ ] 마켓용 이미지는 [`APP_STORE_ASSETS.md`](./APP_STORE_ASSETS.md)에 별도로 정리한다.
