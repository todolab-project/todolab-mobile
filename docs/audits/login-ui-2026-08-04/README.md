# Login UI Product Design Audit

2026-08-04 기준 로그인 화면 UI/UX 수정 후 Product Design audit 기록이다.

## 범위

- 화면: `/login`
- 기준: Web static export, 390×844 mobile viewport
- 상태: 기본 로그인, 빈 입력 validation, 세션 만료 안내

## 캡처

| Step | File                                                 | 상태                   |
| ---- | ---------------------------------------------------- | ---------------------- |
| 1    | [01-login-current.png](./01-login-current.png)       | 기본 로그인 화면       |
| 2    | [02-login-validation.png](./02-login-validation.png) | 이메일/비밀번호 미입력 |
| 3    | [03-login-expired.png](./03-login-expired.png)       | 기존 로그인 세션 만료  |

## Product Design 판단

좋아진 점:

- 첫 진입 화면에서 뒤로가기 버튼을 제거해 로그인 화면의 시작점 성격이 분명해졌다.
- 브랜드 mark, headline, 짧은 설명, form card, primary CTA 순서로 시선 흐름이 정리됐다.
- validation과 세션 만료 안내가 form card 내부 같은 위치에 나타나 다음 행동을 찾기 쉽다.
- 390×844 기준 가로 overflow나 주요 요소 겹침은 보이지 않는다.

수정 반영:

- Web에서 platform symbol이 의도와 다르게 보여 임시 텍스트 brand mark로 교체했다.
- access token 없이 받은 401은 첫 설치/첫 진입의 세션 만료 안내로 처리하지 않도록 수정했다.
- 세션 만료 copy는 “다시 로그인해 주세요” 중심으로 낮은 압박의 보안 안내 톤으로 조정했다.

남은 확인:

- iOS/Android keyboard open 상태에서 CTA가 가려지지 않는지 확인한다.
- VoiceOver/TalkBack reading order와 password 보기 버튼 label을 확인한다.
- 최종 브랜드 asset이 확정되면 임시 `T` mark를 앱 icon 또는 wordmark로 교체한다.
- 소셜 로그인 또는 passkey를 도입하기 전까지 이메일/비밀번호 단일 경로의 오류 복구 copy를 유지한다.

## 비교 참고

- NAVER 계정 로그인은 브랜드를 먼저 보여주고 ID/PW 입력, 보조 로그인, 찾기/가입 링크를 낮은 강조로 정리한다.
- Kakao 로그인은 카카오톡/카카오계정 기반의 신뢰와 간편성을 앞세운다.
- ToDoLab은 현재 소셜 로그인이 없으므로 “브랜드 → 사용 가치 → 입력 카드 → 동기화 CTA → 계정 생성” 흐름을 기준으로 유지한다.
