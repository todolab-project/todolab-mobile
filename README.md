# ToDoLab Mobile

ToDoLab의 일정 관리 경험을 Android, iOS, Web에서 제공하는 크로스플랫폼 클라이언트입니다.

모바일 환경에 맞는 빠른 입력과 명확한 일정 탐색을 목표로 하며, 백엔드 API와 독립적인 배포 주기를 유지합니다.

## 기술 스택

| 영역            | 기술                           |
| --------------- | ------------------------------ |
| Framework       | Expo SDK 56, React Native 0.85 |
| Language        | TypeScript 6                   |
| UI              | React 19                       |
| Navigation      | Expo Router                    |
| Platforms       | Android, iOS, Web              |
| Package Manager | npm                            |

## 프로젝트 구조

```text
src/
└── app/
    ├── _layout.tsx  # 애플리케이션 공통 레이아웃
    └── index.tsx    # 시작 화면
```

기능이 확장되면 화면, 도메인, API 계층의 책임이 섞이지 않도록 `features/`, `services/`, `components/` 단위로 분리합니다.

## 로드맵

백엔드의 기존 기능과 UI/UX를 기준으로 정리한 모바일 정보 구조, 단계별 구현 계획, 완료 기준은 [모바일 로드맵](./docs/ROADMAP.md)에서 관리합니다.

## 로컬 개발

### 요구 사항

- Node.js LTS
- npm
- Android Studio 또는 Xcode(네이티브 시뮬레이터 사용 시)

### 설치

```bash
npm ci
```

### 환경변수

예제 파일을 복사해 로컬 API 주소를 설정합니다.

```bash
cp .env.example .env.local
```

```dotenv
EXPO_PUBLIC_API_URL=http://localhost:8080
```

`EXPO_PUBLIC_*` 값은 앱 번들에 포함되므로 API 주소처럼 공개 가능한 값만 사용하고, 토큰·비밀번호·서버 비밀 키는 넣지 않습니다.

플랫폼별 로컬 백엔드 주소:

| 실행 환경             | API 주소 예시                    |
| --------------------- | -------------------------------- |
| Web, iOS Simulator    | `http://localhost:8080`          |
| Android Emulator      | `http://10.0.2.2:8080`           |
| 실제 Android/iOS 기기 | `http://<개발 PC의 LAN IP>:8080` |

백엔드가 기본 포트 `8080`을 사용한다면 Expo Web은 기본 포트를 사용하거나 다른 포트로 실행해 충돌을 피합니다.

### 실행

```bash
npm start
```

```bash
npm run android
npm run ios
npm run web
```

### 검증

```bash
npm run validate
```

개별 검증은 `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`로 실행합니다. 코드 포맷을 적용하려면 `npm run format`을 사용합니다.

## 개발 원칙

- 플랫폼별 차이는 격리하고 핵심 사용자 흐름은 공통으로 유지합니다.
- 서버 상태와 화면 상태의 책임을 분리합니다.
- 백엔드 API 계약 변경은 호환성과 배포 순서를 함께 검토합니다.
- 접근성, 로딩, 오류, 빈 상태를 정상 흐름과 같은 수준으로 설계합니다.

## 관련 저장소

- [todolab-backend](https://github.com/todolab-project/todolab-backend) — ToDoLab 백엔드 및 서버 애플리케이션
