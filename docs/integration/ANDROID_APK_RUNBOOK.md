# Android 개인 APK Runbook

ToDoLab Mobile을 Expo Go나 Metro 없이 Android 기기에 직접 설치해 실제 production API와 연결하기 위한 절차다.

## 1. 현재 확정한 앱 식별자

| 항목                  | 값                   | 메모                                                                             |
| --------------------- | -------------------- | -------------------------------------------------------------------------------- |
| 앱 이름               | `ToDoLab`            | `app.json`                                                                       |
| Android package       | `com.todolab.mobile` | 개인 APK용 기준값. Play Store 또는 조직 도메인 정책이 생기면 출시 전 재검토한다. |
| iOS bundle identifier | `com.todolab.mobile` | iOS 배포는 후순위지만 Android와 같은 기준값을 먼저 맞춘다.                       |
| App version           | `1.0.0`              | `package.json`, `app.json`                                                       |
| Android versionCode   | `1`                  | APK update install 전 증가 정책을 유지한다.                                      |
| Scheme                | `todolab`            | deep link 정책 확정 전까지 유지한다.                                             |

식별자를 변경하면 기존 Android 앱과 다른 앱으로 설치될 수 있고, 기존 SecureStore 로그인 상태와 앱 데이터가 이어지지 않을 수 있다.

## 2. EAS profile

`eas.json`은 다음 profile을 기준으로 둔다.

| Profile       | 목적                           | Android artifact         | API mode |
| ------------- | ------------------------------ | ------------------------ | -------- |
| `development` | 개발 client 또는 device 디버깅 | APK                      | `mock`   |
| `preview`     | 개인 설치용 real API APK       | APK                      | `real`   |
| `production`  | 추후 store 또는 정식 후보      | 기본 production artifact | `real`   |

`preview`와 `production`은 `EXPO_PUBLIC_API_MODE=real`만 커밋한다. 실제 API URL은 환경마다 달라질 수 있으므로 저장소에 고정하지 않고 EAS 환경변수로 주입한다.

## 3. Production API URL 주입

Tailscale HTTPS URL이 확정되면 EAS 환경변수에 public API origin만 등록한다.

```text
EXPO_PUBLIC_API_URL=https://<device>.<tailnet>.ts.net
```

주의:

- `EXPO_PUBLIC_*` 값은 앱 번들에 포함되는 공개 값이다.
- token, password, API key, 서버 secret은 절대 넣지 않는다.
- `localhost`, `10.0.2.2`, LAN IP는 개인 production APK에 남기지 않는다.

## 4. 빌드 전 확인

```bash
npm run validate
```

확인할 것:

- `app.json`의 `android.package`와 `android.versionCode`
- `eas.json`의 target profile
- EAS에 `EXPO_PUBLIC_API_URL`이 profile에 맞게 등록되어 있는지
- `.env.local`이 커밋되지 않았는지
- 백엔드 production API가 Tailscale HTTPS로 접근 가능한지

## 5. 개인 APK 생성

EAS 계정과 project 연결이 끝난 뒤 preview APK를 생성한다.

```bash
eas build --platform android --profile preview
```

빌드 결과 APK를 Android 기기에 설치한 뒤 다음을 확인한다.

- Expo Go와 Metro 없이 cold start 된다.
- 로그인 후 access token이 SecureStore에 저장되고 앱 재시작 뒤 복원된다.
- Today, Calendar, Search, D-Day 주요 흐름이 production DB로 동작한다.
- Tailscale이 꺼져 있을 때 오류 문구와 재시도 동선이 이해된다.

## 6. 업데이트 운영

- 같은 package로 update install하려면 `android.versionCode`를 증가시킨다.
- signing keystore는 EAS managed credential 또는 별도 보관 위치를 정하되 저장소에 넣지 않는다.
- release 후보마다 앱 commit, 백엔드 commit/image, API URL, 기기, 검증 결과를 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록한다.
- Play Store 배포는 개인 APK 사용이 안정된 뒤 별도로 결정한다.
