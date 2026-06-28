# ToDoLab Mobile Design System

## 1. 문서 목적

이 문서는 ToDoLab 모바일 클라이언트의 시각 언어와 상호작용 원칙을 AI와 개발자가 같은 기준으로 적용하기 위한 `DESIGN.md`다.

구현 일정과 기능 범위는 [ROADMAP.md](./ROADMAP.md)에서 관리하고, 이 문서는 Android, iOS, Web 화면이 어떤 모습과 경험을 가져야 하는지 정의한다.

현재 구현된 디자인 토큰과 공통 컴포넌트를 기준선으로 삼는다. 문서와 코드가 다르면 `src/theme/`의 실제 토큰을 먼저 확인하고, 의도된 변경이라면 코드와 이 문서를 함께 갱신한다.

## 2. Design Intent

ToDoLab은 사용자를 재촉하는 생산성 도구가 아니라, 오늘 실제로 끝낼 일을 차분히 고르고 실행하도록 돕는 동반자다.

목표 인상:

- calm: 정보와 색을 절제해 해야 할 일에 집중시킨다.
- clear: 다음 행동과 현재 상태를 한눈에 이해할 수 있어야 한다.
- encouraging: 실패나 미완료를 비난하지 않고 다시 판단할 기회를 준다.
- practical: 장식보다 빠른 입력, 한 손 조작, 읽기 쉬운 구조를 우선한다.
- trustworthy: 일관된 파란색과 명확한 상태색으로 안정감을 준다.

핵심 문장:

> 신뢰감 있는 파란색, 부드러운 카드, 넉넉한 여백으로 오늘의 실행을 차분하게 돕는다.

## 3. Product Experience

참고 제품의 기능을 그대로 복제하지 않고 다음 경험 패턴만 ToDoLab 흐름에 맞게 사용한다.

- Things: Today 중심의 실행 순서와 일정·할 일 분리
- Microsoft To Do: 하루 단위 선별과 추천
- Todoist: 빠른 추가와 짧은 입력 흐름
- TickTick: 날짜 탐색과 할 일의 결합
- MyTurn: 오늘 행동을 작게 시작하고 한 단계씩 완료하는 진행감

핵심 사용자 흐름:

```text
빠르게 기록
→ 오늘 할 일로 선별
→ 실행 가능한 순서로 정리
→ 완료
→ 완료 로그로 성취 확인
→ 미완료 항목 재판단
```

## 4. Color System

### Brand and neutrals

기본 화면은 차가운 밝은 회색 배경, 흰색 surface, 선명한 blue accent로 구성한다. 파란색은 브랜드와 주요 행동에 집중해서 사용하고 장식적으로 남용하지 않는다.

| Role             | Light       | Dark                    | Usage                        |
| ---------------- | ----------- | ----------------------- | ---------------------------- |
| primary          | `#2563EB`   | `#3B82F6`               | 주요 CTA, 선택, 활성 상태    |
| primary pressed  | `#1D4ED8`   | `#1D4ED8`               | 주요 CTA pressed 상태        |
| primary soft     | `#EFF6FF`   | `rgba(59,130,246,0.16)` | 배지, secondary action 배경  |
| background       | `#F3F5F7`   | `#020617`               | 앱 전체 배경                 |
| surface          | `#FFFFFF`   | `#0F172A`               | 카드, 탭 바, 주요 컨테이너   |
| surface muted    | `#F8FAFC`   | `#1E293B`               | 입력, pressed, 보조 영역     |
| surface elevated | `#FFFFFF`   | `#1E293B`               | modal, 떠 있는 surface       |
| border           | `#E2E8F0`   | `#1E293B`               | 일반 경계                    |
| border strong    | `#CBD5E1`   | `#334155`               | 입력·선택 컨트롤의 강한 경계 |
| text             | `#18212F`   | `#F8FAFC`               | 제목과 본문                  |
| text secondary   | `#64748B`   | `#94A3B8`               | 설명과 메타데이터            |
| text muted       | `#94A3B8`   | `#64748B`               | placeholder, 비활성 정보     |
| text on primary  | `#FFFFFF`   | `#FFFFFF`               | primary surface 위 텍스트    |
| overlay          | translucent | translucent             | modal backdrop               |

### Semantic colors

| Meaning | Main      | Soft light | Usage                     |
| ------- | --------- | ---------- | ------------------------- |
| success | `#16A34A` | `#F0FDF4`  | 완료, 저장 성공           |
| warning | `#D97706` | `#FFFBEB`  | 주의, 미룸, 과부하        |
| danger  | `#DC2626` | `#FEF2F2`  | 오류, 삭제 등 파괴적 행동 |

색상만으로 상태를 전달하지 않는다. 아이콘, 문구, 체크 상태 또는 선 장식을 함께 사용한다.

## 5. Typography

별도 브랜드 폰트가 확정되기 전까지 플랫폼 system font를 사용한다. 글꼴보다 명확한 크기와 굵기 위계를 우선하며, 사용자 글꼴 크기 설정을 막지 않는다.

| Variant    | Size | Line height | Default use                      |
| ---------- | ---: | ----------: | -------------------------------- |
| display    | 34px |        44px | Today 인사 등 화면의 핵심 메시지 |
| title      | 24px |        32px | 화면 제목                        |
| body large | 18px |        26px | Task 제목, 카드의 주요 정보      |
| body       | 16px |        24px | 일반 본문                        |
| label      | 14px |        20px | 버튼, 입력 보조 정보             |
| caption    | 12px |        16px | 배지, 메타데이터, eyebrow        |

Weights:

- regular `400`: 일반 본문
- medium `500`: 가벼운 강조
- semibold `600`: label과 선택 상태
- bold `700`: 제목, 버튼, 주요 항목
- heavy `800`: 날짜 숫자와 강한 화면 제목

Rules:

- display와 title에는 `-0.4`의 tight tracking을 사용할 수 있다.
- `TODAY`, `CALENDAR` 같은 eyebrow는 caption, bold, primary 색을 사용한다.
- 긴 Task 제목은 최대 두 줄을 기본으로 하며, 주요 행동을 밀어내지 않아야 한다.
- 보조 설명은 크기를 지나치게 줄이지 말고 secondary 색으로 위계를 만든다.

## 6. Spacing, Shape, and Depth

### Spacing

4px grid를 사용한다.

```text
4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64
```

- 화면 좌우 padding: 20px
- 일반 section gap: 24px
- 카드 기본 padding: 20px
- 조밀한 form/card padding: 12~16px
- 관련 항목 내부 gap: 4~12px

### Radius

| Token | Value | Usage                     |
| ----- | ----: | ------------------------- |
| sm    |   8px | 작은 제어 요소            |
| md    |  12px | 버튼, 입력, 날짜 버튼     |
| lg    |  16px | 기본 카드                 |
| xl    |  20px | 큰 container              |
| full  | 999px | pill, 원형 체크, 상태 dot |

### Depth

- 기본 surface는 그림자 대신 1px border로 구분한다.
- 한 컴포넌트에 강한 border와 강한 shadow를 동시에 사용하지 않는다.
- 그림자는 modal이나 실제로 떠 있는 surface처럼 elevation이 필요한 경우에만 절제해서 사용한다.
- blur, glass, gradient는 기능적 이유와 검증된 대비가 없으면 기본 디자인에 추가하지 않는다.

## 7. Layout

- 화면은 safe area를 존중한다.
- 모바일에서 한 손 조작과 세로 흐름을 우선한다.
- 주요 CTA는 가능한 한 엄지 접근 영역에 둔다.
- Web 콘텐츠 최대 너비는 720px이며 중앙 정렬한다.
- 카드와 section을 무조건 중첩하지 않는다. 배경, 간격, divider 중 가장 단순한 구획 방법을 선택한다.
- Today에서는 실행할 Task가 가장 강한 시각적 우선순위를 갖는다.
- 캘린더 일정, 추천, 지난 미완료는 핵심 Task 목록을 압도하지 않아야 한다.
- 첫 viewport 안에 화면의 핵심 content 또는 핵심 행동이 보여야 한다.
- 화면명, 날짜, 인사, 설명이 같은 맥락을 반복하면 compact header 하나로 합친다.
- 상단의 장식적·설명적 영역보다 실제 데이터 영역에 더 많은 세로 공간을 배정한다.

### Today Content Priority

Today의 기본 정보 순서는 다음과 같다.

```text
compact header
→ 오늘 실행 Task
→ 존재하는 일정
→ 지난 미완료·추천 진입점
→ 접힌 완료
```

- header는 화면명, 날짜, 보조 메뉴를 한 영역에서 해결한다.
- 큰 인사말은 상시 navigation 요소가 아니며 빈 상태나 의미 있는 피드백에서만 사용한다.
- 날짜를 top bar와 별도 대형 카드에서 중복 표시하지 않는다.
- 오늘 실행 Task는 사용자가 스크롤하기 전에 최소 한 개 이상 보여야 한다.
- 지난 미완료와 추천은 기본적으로 요약하고 사용자가 선택할 때 펼친다.
- 완료 목록은 기본적으로 접고 완료 수와 펼치기 affordance를 제공한다.
- 일정 section은 데이터가 있을 때만 표시한다.

## 8. Components

### Button

- primary: blue fill, white bold label, 주요 행동에 사용한다.
- secondary: primary-soft fill, blue label, 보조 선택에 사용한다.
- ghost: transparent fill, secondary label, 낮은 우선순위 행동에 사용한다.
- danger: red fill, white label, 확인된 파괴적 행동에 사용한다.
- 기본 radius는 12px이다.
- 최소 높이는 44px, 강조 CTA는 52px이다.
- loading 중에는 중복 입력을 막고 spinner와 busy 상태를 제공한다.
- 한 화면에서 primary CTA를 경쟁적으로 여러 개 배치하지 않는다.

### Card

- 기본 radius는 16px, border는 1px이다.
- default는 surface, muted는 surface-muted, outlined는 transparent 배경을 사용한다.
- 카드 전체가 눌리는 경우 pressed 상태를 명확히 제공한다.
- 카드 중첩과 반복적인 그림자로 정보 구조를 만들지 않는다.

### Input

- 기본 높이는 최소 44px, radius는 12px이다.
- surface-muted 배경과 border를 사용한다.
- 오류 상태에서는 danger border와 설명 문구를 함께 표시한다.
- placeholder만으로 필수 의미를 전달하지 않는다.
- 키보드가 열린 상태에서도 입력과 저장 행동이 가려지지 않아야 한다.

### Quick Add

- 모바일 기본 상태에서는 큰 입력 카드보다 하단 추가 버튼이나 한 줄 composer를 우선한다.
- 입력을 시작하면 필요한 필드와 저장 행동이 점진적으로 확장된다.
- 어느 주요 탭에서도 같은 위치와 동작으로 빠른 추가를 시작할 수 있어야 한다.
- FAB를 사용할 때 마지막 목록 항목과 겹치지 않도록 하단 inset을 확보한다.
- 빠른 추가가 실행 Task보다 더 많은 영구적 세로 공간을 차지하지 않게 한다.

### Task Card

- 왼쪽 4px accent bar로 활성 Task의 primary 상태를 표시한다.
- 완료 Task는 accent와 checkbox를 success 색으로 바꾸고 제목에 취소선을 사용한다.
- checkbox는 44×44px의 독립된 터치 영역을 유지한다.
- 제목 영역은 상세 보기, checkbox는 완료 전환으로 행동을 분리한다.
- category, all-day, D-Day는 작은 pill badge로 표시한다.
- 시간과 메타데이터는 제목보다 조용하게 보여준다.

### Badge and Pill

- full radius와 작은 수평 padding을 사용한다.
- 일반 메타데이터는 neutral surface, 선택·브랜드 문맥은 primary-soft를 사용한다.
- 긴 문장이나 주요 행동을 badge 안에 넣지 않는다.

### Navigation

- 하단 탭은 Today, Calendar, D-Day, More 네 개를 유지한다.
- active tab은 primary, inactive tab은 text-muted를 사용한다.
- iOS는 SF Symbols, Android와 Web은 대응하는 Material 계열 symbol을 사용한다.
- 아이콘 의미와 접근성 label은 플랫폼 간 동일해야 한다.

## 9. Content and Tone

문구는 짧고 구체적이며 비난하지 않는 존댓말을 사용한다.

Preferred:

- “가장 중요한 일부터 하나씩 끝내보세요.”
- “날짜는 나중에 정해도 괜찮아요.”
- “다시 시도해 주세요.”
- “기록함에 추가했어요.”

Avoid:

- 실패를 사용자 탓으로 돌리는 문구
- 불필요하게 긴 설명
- 같은 화면에서 서로 다른 용어로 동일한 개념 표현
- 완료를 강요하거나 과도하게 게임화하는 표현

`Today`, `Calendar`, `D-Day`, `More`는 탭 이름으로 사용하고, 한국어 접근성 label을 함께 제공한다. 기능 용어는 화면 전체에서 일관되게 사용한다.

## 10. Interaction and Motion

Motion duration tokens:

- fast: 150ms
- normal: 220ms
- slow: 320ms

Rules:

- 애니메이션은 상태 변화와 공간 이동을 이해시키는 데 사용한다.
- 완료 피드백은 빠르고 가볍게 처리하며 다음 Task를 방해하지 않는다.
- 네트워크 mutation 중 중복 입력을 차단한다.
- 성공 시 가벼운 햅틱과 짧은 피드백을 사용할 수 있다.
- 장시간 지속되거나 반복되는 장식 애니메이션은 사용하지 않는다.
- reduced motion 설정을 존중해야 한다.

## 11. Screen States

모든 데이터 화면은 다음 상태를 정상 흐름의 일부로 설계한다.

- initial loading 또는 skeleton
- pull to refresh
- empty state와 다음 행동 CTA
- inline error와 retry
- mutation pending과 중복 입력 방지
- success feedback
- offline 또는 timeout 안내

목록 데이터 갱신에 실패해도 기존 데이터를 가능한 한 유지한다. 전체 화면 오류는 화면을 구성할 데이터가 전혀 없을 때만 사용한다.

## 12. Accessibility

- 모든 터치 대상은 최소 44×44pt를 유지한다.
- WCAG 대비를 고려하고 색상만으로 상태를 전달하지 않는다.
- VoiceOver, TalkBack에서 역할, 상태, label을 제공한다.
- checkbox와 상세 보기처럼 행동이 다른 영역을 하나의 모호한 터치 대상으로 합치지 않는다.
- 큰 글꼴에서 주요 CTA, Task 제목, 오류 문구가 잘리지 않아야 한다.
- 동적 상태 변화에는 적절한 live region 또는 접근성 알림을 제공한다.
- 파괴적 행동은 확인 또는 실행 취소 가능성을 검토한다.

## 13. Platform Behavior

핵심 기능과 디자인 언어는 Android, iOS, Web에서 동일하게 유지하고 플랫폼 관습이 다른 부분만 분기한다.

- Android: system back과 Material 계열 symbol 관습을 존중한다.
- iOS: safe area, modal, SF Symbols 관습을 존중한다.
- Web: hover, focus-visible, keyboard navigation을 추가하고 720px max width를 유지한다.
- 플랫폼별 구현 차이가 핵심 사용자 흐름이나 용어 차이로 이어지지 않게 한다.

## 14. Do and Don't

Do:

- primary blue를 주요 행동과 현재 선택에 집중해서 사용한다.
- 여백과 타이포그래피로 우선순위를 만든다.
- 사용자가 지금 할 수 있는 다음 행동을 분명히 보여준다.
- 완료와 오류에 색상, 아이콘, 문구를 함께 사용한다.
- 기존 token과 공통 component를 우선 재사용한다.
- Android, iOS, Web과 light/dark theme를 함께 고려한다.

Don't:

- 모든 카드와 제목을 blue로 강조하지 않는다.
- 큰 인사, 날짜 카드, 요약 카드를 연속 배치해 핵심 목록을 초기 화면 아래로 밀지 않는다.
- 무거운 shadow, gradient, glass effect를 기본 장식으로 사용하지 않는다.
- 작은 회색 텍스트로 정보 밀도를 억지로 높이지 않는다.
- mobile 화면에 desktop table이나 과밀한 calendar cell을 축소해 넣지 않는다.
- 새로운 색상, radius, spacing 값을 화면 안에 임의로 추가하지 않는다.
- 완료 경험을 confetti, streak, 점수 등으로 과도하게 게임화하지 않는다.

## 15. Known Gaps

다음 항목은 아직 확정된 디자인 규칙이 아니며 구현과 검증을 거쳐 이 문서에 반영한다.

- ToDoLab 고유의 브랜드 자산과 wordmark
- system font를 대체할 브랜드 typography 필요 여부
- 아이콘 크기, stroke, filled/outlined 사용 규칙
- 화면별 카드 밀도와 카드가 필요 없는 section 기준
- modal, bottom sheet, toast의 세부 visual specification
- 햅틱과 motion의 상황별 매핑
- 빈 상태 illustration의 사용 여부와 스타일
- dark mode의 실제 기기별 시각 검증
- Web의 hover, focus, 넓은 화면 레이아웃 세부 규칙

## 16. Maintenance

다음 변경에는 이 문서의 동시 갱신 여부를 확인한다.

- theme token 추가 또는 변경
- 공통 UI component의 variant 변경
- 새로운 상태색이나 interaction pattern 도입
- 탭과 핵심 정보 구조 변경
- 플랫폼별 visual behavior 분기
- 브랜드 font, icon, illustration 도입

화면 하나만을 위한 예외보다 재사용 가능한 semantic token과 component variant를 먼저 검토한다. 새 규칙이 두 곳 이상에서 반복되면 공통화하고 이 문서에 기록한다.
