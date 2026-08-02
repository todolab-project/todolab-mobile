# 2026-08-02 Product Design Audit

범위: Mock Web 390×844 기준 Today, Calendar, Profile, 정리할 항목 화면.

증거:

- [01 Today](./01-today.png)
- [02 Calendar](./02-calendar.png)
- [03 Profile](./03-profile.png)
- [04 정리할 항목](./04-organize.png)
- [05 Today FAB 수정 후](./05-today-after-fab.png)

## 판단

현재 UI는 “Quiet Paper Planner” 방향과 대체로 맞는다. 흰 배경, 얇은 선, 낮은 채도의 section 색, 3-tab 구조는 네이버 모바일 앱처럼 가볍게 자주 열 수 있는 톤에 가까워졌다.

## 확인한 강점

- Today 첫 화면에서 주간 strip, 일정, 오늘 할 일이 바로 보여 실행 중심성이 좋다.
- Calendar는 3주 grid와 선택 날짜 목록이 한 흐름으로 연결되어 월간 전체보다 오늘 주변 맥락을 빠르게 본다.
- Profile은 로그인 card와 shortcut row가 단정하며, 불필요한 통계나 feed가 없어 가볍다.
- 정리할 항목은 지난 미완료, 추천, 기록함의 목적이 section copy로 분리되어 이해하기 쉽다.

## 수정 반영

- Today의 접힌 Quick Capture FAB가 `+ 기록` 라벨 폭 때문에 완료 section count와 시각적으로 충돌했다.
- 접힌 FAB를 54×54 icon-only 버튼으로 줄이고, 접근성 label은 `빠르게 기록 열기`로 유지했다.
- 수정 후 [05 Today FAB 수정 후](./05-today-after-fab.png) 기준으로 완료 section과 충돌이 줄었다.

## 남은 UX/접근성 리스크

- Calendar의 하루 일정 pill은 좁은 column에서 여전히 빠르게 잘린다. 다만 아래 예정 목록이 상세 정보를 보완하므로 현재는 허용 가능한 축약으로 본다.
- 실제 iOS/Android font scale 1.5, safe area, VoiceOver/TalkBack은 이 Web screenshot만으로 판단할 수 없다.
- icon-only FAB는 시각적으로는 정리됐지만 실제 screen reader label, touch target, keyboard focus는 native QA에서 확인해야 한다.

## 다음 확인

1. iOS/Android 실제 기기 또는 simulator에서 Today FAB와 tab bar, home indicator 충돌 확인.
2. Calendar 일정 pill이 320px, font scale 1.5에서 날짜 cell 밖으로 튀지 않는지 확인.
3. VoiceOver/TalkBack에서 빠른 기록, checkbox, 일정 bar, tab의 역할과 상태가 자연스럽게 읽히는지 확인.
