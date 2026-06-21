# ToDoLab Mobile 작업 규칙

이 저장소에서는 ToDoLab 모바일 클라이언트만 작업한다.

## 작업 범위

- 기본 작업 대상은 Expo, React Native, TypeScript 기반 모바일·웹 클라이언트다.
- 백엔드 구현과 데이터베이스 변경은 별도 `todolab-backend` 저장소에서 진행한다.
- API 변경이 필요하면 클라이언트 요구 사항과 예상 계약을 먼저 문서화한다.

## 검증

- 변경 후 `npm run typecheck`를 실행한다.
- 플랫폼별 코드를 수정하면 영향받는 Android, iOS, Web 환경을 명시한다.
- 새 의존성은 Expo SDK 56 및 React Native 0.85 호환성을 확인한 뒤 추가한다.

## 변경 관리

- 모바일과 백엔드 변경은 각각의 저장소에서 별도의 이슈, 브랜치, 커밋, PR로 관리한다.
- 브랜치 이름은 `feat/mobile/<topic>`, `fix/mobile/<topic>`, `chore/mobile/<topic>` 형식을 사용한다.
- 실제 비밀 값과 로컬 환경 파일은 커밋하지 않는다.
