# Release Checklist

ToDoLab Mobile을 실제 사용 또는 배포 후보로 올리기 전에 확인하는 최종 체크리스트다. 상세 기준은 각 전문 문서에 두고, 이 문서는 배포 직전 빠뜨리기 쉬운 결정과 검증 상태를 한곳에서 확인한다.

## 1. 릴리즈 범위

릴리즈 후보마다 아래 정보를 먼저 채운다.

```text
날짜:
커밋:
배포 대상: Android / iOS / Web
API 모드: mock / real
API URL:
백엔드 커밋 또는 배포 버전:
검증 기기:
담당자:
```

## 2. 코드와 검증

- [ ] 작업 트리에 의도하지 않은 변경이 없다.
- [ ] 실제 비밀 값, `.env.local`, 로컬 인증 정보가 포함되지 않았다.
- [ ] `npm run validate`가 통과했다.
- [ ] 새 의존성을 추가했다면 Expo SDK 56, React Native 0.85 호환성을 확인했다.
- [ ] 플랫폼별 코드 변경이 있으면 Android, iOS, Web 영향 범위를 기록했다.
- [ ] 이번 릴리즈에 포함된 주요 변경을 `README.md`, `ROADMAP.md`, 관련 문서에 반영했다.

## 3. 환경과 API

- [ ] `EXPO_PUBLIC_API_MODE`가 목적에 맞다.
  - 로컬 UI 확인: `mock`
  - 실제 연동 확인: `real`
- [ ] `EXPO_PUBLIC_API_URL`이 대상 환경을 가리킨다.
- [ ] `EXPO_PUBLIC_*`에 secret, token, password, API key가 없다.
- [ ] real 모드에서는 [`BACKEND_INTEGRATION_RUNBOOK.md`](./BACKEND_INTEGRATION_RUNBOOK.md)에 따라 Auth, Today, Calendar, D-Day, Search 흐름을 확인했다.
- [ ] 401 세션 만료 시 access token 삭제와 로그인 동선이 자연스럽다.
- [ ] network, timeout, 5xx 오류에서 기존 데이터 유지, 오류 문구, retry가 동작한다.
- [ ] 백엔드 변경이 필요하면 모바일 요구 계약만 문서화하고 백엔드 저장소에서 별도로 추적한다.

## 4. 핵심 사용자 흐름

[`SMOKE_TEST_CHECKLIST.md`](./SMOKE_TEST_CHECKLIST.md)를 기준으로 확인한다.

- [ ] 회원가입, 로그인, 내 정보 조회, 로그아웃
- [ ] 빠른 기록 추가
- [ ] 기록함/정리할 항목에서 오늘 할 일로 이동 또는 추가
- [ ] Today 일정 표시, 오늘 할 일 완료, 완료 다시 열기
- [ ] Calendar 월간 grid, 하루 일정 label, 여러 날 일정 bar
- [ ] Search mock 결과 또는 real API 준비 상태
- [ ] D-Day 목표 생성, 목표 상세, 목표 연결 Task 생성
- [ ] Completed 주 이동, 완료 목록, 다시 열기
- [ ] Profile 목적지 이동

검증 결과는 [`SMOKE_TEST_LOG.md`](./SMOKE_TEST_LOG.md)에 남긴다.

## 5. UI/UX 품질

[`UX_REVIEW_LOG.md`](./UX_REVIEW_LOG.md)와 [`DESIGN.md`](./DESIGN.md)를 기준으로 확인한다.

- [ ] 첫 viewport에서 오늘의 일정 또는 오늘 할 일을 바로 볼 수 있다.
- [ ] Today 주간 strip의 외부 경계와 내부 세로선이 날짜 cell과 맞는다.
- [ ] Calendar column rule, 하루 일정 label, 기간 bar가 cell 밖으로 튀지 않는다.
- [ ] 일정, 오늘 할 일, 완료 section 색이 배경과 충분히 구분된다.
- [ ] 빠른 입력 placeholder와 저장 feedback이 짧고 자연스럽다.
- [ ] 정리할 항목 action copy가 실제 동작과 맞다.
- [ ] Profile shortcut row가 다른 row와 같은 밀도와 radius를 가진다.
- [ ] 320px, 375pt, 430dp, 720px에서 horizontal overflow가 없다.
- [ ] font scale 1.5에서 핵심 제목과 action이 유지된다.
- [ ] light/dark에서 hairline, marker, text 대비가 충분하다.

## 6. 접근성

[`ACCESSIBILITY_CHECKLIST.md`](./ACCESSIBILITY_CHECKLIST.md)를 기준으로 확인한다.

- [ ] 터치 영역은 최소 44pt다.
- [ ] checkbox, 날짜 cell, 일정 bar, quick action의 역할과 상태가 screen reader에 읽힌다.
- [ ] 색상만으로 완료, 위험, 선택 상태를 전달하지 않는다.
- [ ] keyboard focus outline이 시각적으로 구분된다.
- [ ] Web Tab 순서가 시각 순서와 크게 어긋나지 않는다.
- [ ] VoiceOver/TalkBack에서 Today → Calendar → Profile 주요 흐름을 이해할 수 있다.

## 7. 플랫폼 품질

[`PLATFORM_QUALITY_CHECKLIST.md`](./PLATFORM_QUALITY_CHECKLIST.md)를 기준으로 확인한다.

- [ ] Android adaptive icon, monochrome icon preview가 깨지지 않는다.
- [ ] iOS icon이 라운드 마스크 안에서 자연스럽다.
- [ ] Splash에서 첫 화면으로 넘어갈 때 배경 전환이 튀지 않는다.
- [ ] Status bar와 safe area가 light/dark에서 자연스럽다.
- [ ] iOS home indicator, Android navigation bar, 하단 tab이 composer나 CTA를 가리지 않는다.
- [ ] Android back 버튼 첫 동작이 키보드 닫기인지 확인했다.
- [ ] Web favicon이 표시된다.

## 8. 성능과 안정성

[`PERFORMANCE_CHECKLIST.md`](./PERFORMANCE_CHECKLIST.md)를 기준으로 확인한다.

- [ ] 초기 진입에서 skeleton 또는 기존 데이터 유지가 자연스럽다.
- [ ] 긴 Today/Completed 목록에서 스크롤이 끊기지 않는다.
- [ ] Calendar 월간 grid와 일정 bar 렌더링이 과하게 느리지 않다.
- [ ] query retry가 무한 반복처럼 보이지 않는다.
- [ ] pull-to-refresh 후 데이터가 중복 표시되지 않는다.

## 9. 배포 식별자와 빌드

출시 빌드 전 확정해야 한다.

- [ ] 앱 표시 이름
- [ ] Android package
- [ ] iOS bundle identifier
- [ ] EAS profile
- [ ] scheme 유지 여부: `todolab`
- [ ] API 환경별 빌드 설정
- [ ] 앱 아이콘, splash, favicon 최종 asset

식별자가 확정되기 전에는 store 제출용 build를 만들지 않는다.

## 10. 릴리즈 판정

```text
결과: 통과 / 보류
보류 사유:
필수 수정:
후속 수정:
관련 커밋:
관련 이슈 또는 문서:
```

릴리즈 보류 기준:

- 로그인 또는 Today 핵심 흐름이 real 모드에서 실패한다.
- Calendar 날짜가 Today와 다르게 해석된다.
- 비밀 값 또는 로컬 환경 파일이 포함되어 있다.
- 작은 화면에서 핵심 action이 가려진다.
- 접근성상 완료, 삭제, 로그인 같은 주요 action 목적을 알 수 없다.
