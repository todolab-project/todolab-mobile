# Register UI Product Design Audit

2026-08-05 기준 계정 만들기 화면 UI/UX 수정 후 Product Design audit 기록이다.

## 범위

- 화면: `/register`
- 기준: Web static export, browser capture
- 상태: 기본 계정 만들기, 빈 입력 validation

## 캡처

| Step | File                                                       | 상태                        |
| ---- | ---------------------------------------------------------- | --------------------------- |
| 1    | [01-register-current.jpg](./01-register-current.jpg)       | 기본 계정 만들기 화면       |
| 2    | [02-register-validation.jpg](./02-register-validation.jpg) | 이메일/이름/비밀번호 미입력 |

## Product Design 판단

좋아진 점:

- 로그인 화면과 같은 brand mark, headline, form card, secondary action 구조로 인증 flow의 일관성이 생겼다.
- 큰 PageHeader와 뒤로가기 버튼을 제거해 “가입 화면” 자체의 시작점이 더 명확해졌다.
- 비밀번호 조건을 field 근처 caption으로 보여 사용자가 제출 전에 최소 조건을 알 수 있다.
- 이미 계정이 있는 사용자는 하단의 낮은 강조 action으로 로그인 화면에 돌아갈 수 있다.

수정 반영:

- `회원가입` 중심 copy를 `계정 만들기` 중심으로 바꿔 사용자가 누르는 행동과 화면 목적을 맞췄다.
- `router.back()` 의존 대신 `/login` replace로 이동해 직접 URL 진입 후에도 안전하게 로그인으로 돌아간다.
- input 높이, radius, padding을 로그인 화면과 맞춰 같은 제품의 형제 화면처럼 보이게 했다.

남은 확인:

- 실제 iOS/Android keyboard open 상태에서 세 번째 field와 CTA가 가려지지 않는지 확인한다.
- VoiceOver/TalkBack reading order와 password 보기 버튼 label을 확인한다.
- 현재 이메일/비밀번호 기반 flow에는 비밀번호 찾기/재설정 진입이 없으므로, 실사용 전 백엔드 계약과 화면을 추가한다.
- 최종 브랜드 asset이 확정되면 임시 `T` mark를 로그인/계정 만들기에서 함께 교체한다.

## 비교 참고

- NAVER/Kakao 같은 인증 화면은 브랜드 신뢰, 명확한 입력 경로, 낮은 강조의 보조 링크를 분리한다.
- Expo 인증 가이드도 이메일/비밀번호 방식에는 비밀번호 분실/재설정 흐름이 함께 필요하다고 설명한다.
- ToDoLab은 현재 소셜/패스키 없이 이메일 기반으로 시작하므로, 계정 생성 form은 짧게 유지하고 복구 흐름을 다음 단위로 추가한다.
