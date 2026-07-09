# 오류 로깅과 개인정보 기준

ToDoLab 모바일의 오류 로깅은 장애를 재현하고 앱 품질을 개선하기 위한 최소 정보만 수집한다. 사용자가 기록한 Task 제목, 설명, 카테고리, D-Day 목표명처럼 생활 패턴을 직접 드러내는 내용은 기본적으로 외부 로깅 대상이 아니다.

## 수집 목적

- 앱 crash, API 실패, 화면 진입 실패, 데이터 동기화 실패를 재현한다.
- Android, iOS, Web별로 발생하는 플랫폼 차이를 파악한다.
- 느린 네트워크, timeout, 잘못된 서버 응답처럼 사용자 경험을 크게 해치는 문제의 빈도를 확인한다.

## 수집 가능 정보

| 범주        | 예시                                                            | 기준               |
| ----------- | --------------------------------------------------------------- | ------------------ |
| 앱 정보     | 앱 버전, build 번호, Expo SDK, 플랫폼, OS major version         | 허용               |
| 화면 정보   | route name, tab name, feature name                              | 허용               |
| 오류 정보   | 오류 kind, HTTP status, API error code, stack trace             | 허용               |
| 성능 정보   | cold start 구간, API latency bucket, list item count bucket     | 허용               |
| 네트워크    | online/offline 추정, timeout 여부, retry count                  | 허용               |
| 사용자 식별 | 내부 user id hash 또는 anonymous id                             | MVP 이후 재검토    |
| 원문 데이터 | Task title, description, category, D-Day title, 검색어, memo 등 | 기본 수집하지 않음 |

## 수집하지 않는 정보

- Task 제목과 설명 원문
- D-Day 목표명과 목표 날짜의 조합
- 검색어 원문
- 사용자의 연락처, 위치, 파일, 사진
- 인증 토큰, refresh token, 쿠키, API key
- 로컬 `.env` 값과 실제 API URL의 민감한 query parameter

## 오류 이벤트 형태

구현 시 이벤트는 다음 형태를 넘지 않는다.

```ts
type ErrorLogEvent = {
  feature: 'today' | 'calendar' | 'search' | 'completed' | 'dday' | 'task-detail' | 'profile';
  action: string;
  errorKind?: string;
  httpStatus?: number;
  apiCode?: number;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  retryCount?: number;
};
```

## 사용자에게 보이는 오류와 로깅의 분리

- 화면에는 [`getUserFacingApiErrorMessage`](../src/services/api/api-error.ts)를 통해 정규화된 문구를 표시한다.
- 로깅에는 사용자용 문구보다 `errorKind`, `httpStatus`, `apiCode`처럼 재현에 필요한 구조화 정보를 남긴다.
- 4xx/API 검증 오류는 사용자 입력 문제일 수 있으므로 빈도를 보되 원문 payload는 남기지 않는다.
- network, timeout, 5xx는 재시도 정책과 함께 묶어 빈도를 본다.

## 도구 도입 전 체크리스트

- Expo SDK 56, React Native 0.85와 호환되는지 확인한다.
- source map 업로드가 가능하더라도 비공개 저장소 정보와 환경 값이 노출되지 않는지 확인한다.
- 사용자가 개인정보 처리방침에서 수집 목적과 항목을 확인할 수 있어야 한다.
- 로그 비활성화 또는 최소 수집 모드를 설정할 수 있는지 확인한다.
