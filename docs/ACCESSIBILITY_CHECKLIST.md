# 접근성·읽기 순서·글꼴 확대 점검표

이 문서는 ToDoLab 모바일을 Android, iOS, Web에서 실제로 점검할 때 사용하는 기준이다. 디자인 원칙은 [`DESIGN.md`](./DESIGN.md)를 따른다.

## 공통 기준

- 터치 대상은 최소 44×44pt를 유지한다.
- 화면에 보이는 작은 checkbox, icon, event bar도 실제 hit area는 충분히 넓어야 한다.
- 역할이 다른 행동은 하나의 터치 대상으로 합치지 않는다.
  - 예: 완료 checkbox와 상세 보기 영역은 별도 역할과 label을 가진다.
- 색상만으로 상태를 전달하지 않는다.
  - 완료, 오류, 선택, 반복, 일정 상태는 문구·역할·상태값 중 하나를 함께 제공한다.
- 공통 오류와 loading 상태는 `InlineNotice`, `ListSkeleton`의 접근성 속성을 우선 사용한다.

## 화면별 읽기 순서

### Today

1. 페이지 맥락
2. 주간 날짜 strip
3. 일정 section
4. 오늘 할 일 section
5. 정리할 항목 진입점
6. 접힌 완료 목록
7. 빠른 기록 버튼 또는 composer

점검:

- 일정이 많아도 오늘 할 일 section이 지나치게 아래로 밀리지 않는지 확인한다.
- 완료 checkbox → Task 제목/상세 → 보조 행동 순서로 읽히는지 확인한다.
- 정리할 항목은 버튼 역할과 개수 정보를 함께 읽어야 한다.

### Calendar

1. 페이지 제목
2. 월 이동 controls
3. 월간 grid 날짜
4. 일정 label 또는 기간 bar
5. 선택 날짜의 목록과 filter

점검:

- 날짜 cell은 선택 상태를 읽어야 한다.
- 하루 일정과 기간 일정은 접근성 label에서 구분되어야 한다.
- `+N` overflow는 해당 날짜의 전체 목록을 여는 버튼으로 읽혀야 한다.

### Search

1. 페이지 제목
2. 검색어 입력
3. 필터 그룹
4. 정렬 그룹
5. 검색 결과 목록

점검:

- 검색어 입력에는 목적이 hint로 제공되어야 한다.
- filter와 sort는 selected state를 제공해야 한다.
- 검색 결과는 날짜 기준과 날짜 label을 함께 읽어야 한다.

### Completed

1. 페이지 제목
2. 주 이동 controls
3. 일별 완료 count
4. 선택 날짜 완료 목록

점검:

- 날짜 버튼은 선택 상태와 완료 개수를 함께 읽어야 한다.
- 다시 열기 action은 완료 취소 의미가 명확해야 한다.

### Profile

1. 페이지 제목
2. destination list
3. 각 목적지의 제목과 설명

점검:

- destination row는 list 안의 button으로 읽혀야 한다.
- 개인정보, 알림, 테마처럼 향후 설정 항목이 추가되어도 같은 row 문법을 유지한다.

## 글꼴 확대 기준

검증 배율:

- iOS Dynamic Type 기본, 큰 글꼴
- Android font scale `1.0`, `1.3`, `1.5`
- Web browser zoom 100%, 125%, 150%

점검:

- Task 제목과 primary action은 유지하고 metadata, 설명, 보조 count가 먼저 줄거나 생략된다.
- 버튼 text가 잘릴 때 icon-only로 바꾸지 않고 label을 유지할 수 있는지 먼저 확인한다.
- horizontal chip/filter는 overflow가 생기면 wrap 또는 scroll 중 하나로 명확하게 처리한다.
- 320px 폭에서 제목 2줄, 긴 category, 긴 시간 범위를 함께 확인한다.

## 명암과 상태

- `theme-contrast` 테스트는 최소 회귀선이고 실제 화면에서는 light/dark 둘 다 확인한다.
- hairline rule은 light/dark에서 section 구분이 가능해야 하지만 카드처럼 과하게 보이면 안 된다.
- pastel surface 위의 text는 4.5:1 이상을 목표로 한다.
- focus outline은 오류 border와 구분되어야 한다.

## 실제 기기 smoke test 항목

- VoiceOver: Today에서 첫 Task 완료 후 성공 안내가 읽히는지
- TalkBack: Calendar 날짜 이동과 일정 상세 진입이 끊기지 않는지
- Web keyboard: tab 순서가 시각 순서와 크게 어긋나지 않는지
- 큰 글꼴: Today 첫 viewport에서 일정과 오늘 할 일 중 최소 하나를 확인할 수 있는지
- 네트워크 오류: retry 버튼이 focus 가능하고 오류 문구가 live region으로 전달되는지
