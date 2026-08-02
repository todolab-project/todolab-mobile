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
npm run check:release-static
npm run check:eas-setup
```

확인할 것:

- `app.json`의 `android.package`와 `android.versionCode`
- 앱 표시 이름, scheme, icon/splash/favicon 파일 존재와 PNG 크기
- `eas.json`의 target profile
- EAS CLI가 설치되어 있고 Expo project id가 연결되어 있는지
- EAS에 `EXPO_PUBLIC_API_URL`이 profile에 맞게 등록되어 있는지
- `.env.local`이 커밋되지 않았는지
- 백엔드 production API가 Tailscale HTTPS로 접근 가능한지

`npm run check:eas-setup`은 Expo 로그인과 `eas init` 전에는 실패하는 것이 정상이다. 실패 메시지에서 남은 준비 항목을 확인한다.

## 5. EAS project 연결

Expo 계정 로그인이 끝난 뒤 한 번만 project를 연결한다.

```bash
eas login
eas init
```

연결 뒤 `app.json`에 `expo.extra.eas.projectId`가 추가됐는지 확인한다. `.expo/` 로컬 상태는 Git에 커밋하지 않는다.

## 6. 개인 APK 생성

EAS 계정과 project 연결이 끝난 뒤 preview APK를 생성한다.

```bash
eas build --platform android --profile preview
```

빌드 결과 APK를 Android 기기에 설치한 뒤 다음을 확인한다.

- Expo Go와 Metro 없이 cold start 된다.
- 로그인 후 access token이 SecureStore에 저장되고 앱 재시작 뒤 복원된다.
- Today, Calendar, Search, D-Day 주요 흐름이 production DB로 동작한다.
- Tailscale이 꺼져 있을 때 오류 문구와 재시도 동선이 이해된다.

## 7. 업데이트 운영

- 같은 package로 update install하려면 `android.versionCode`를 증가시킨다.
- signing keystore는 EAS managed credential 또는 별도 보관 위치를 정하되 저장소에 넣지 않는다.
- release 후보마다 앱 commit, 백엔드 commit/image, API URL, 기기, 검증 결과를 [`SMOKE_TEST_LOG.md`](../qa/SMOKE_TEST_LOG.md)에 기록한다.
- Play Store 배포는 개인 APK 사용이 안정된 뒤 별도로 결정한다.

## 8. Signing credential 운영

기본 방침:

- 개인 APK 단계에서는 EAS managed Android credential을 우선 사용한다.
- keystore 파일, keystore password, key alias, key password는 저장소에 커밋하지 않는다.
- 로컬 파일로 보관해야 하는 경우에도 `.jks`, `.keystore`, `.key`, `.pem`은 `.gitignore`에 의해 제외되어야 한다.

기록할 수 있는 정보:

| 항목                 | 저장 가능 여부 | 메모                                                                |
| -------------------- | -------------- | ------------------------------------------------------------------- |
| credential 소유 방식 | 가능           | `EAS managed` 또는 `local backup exists`처럼 비밀 없는 수준         |
| Expo 계정/조직명     | 가능           | 팀 정책상 공개 가능한 경우만                                        |
| 복구 담당자          | 가능           | 개인 이름 대신 역할명 권장                                          |
| keystore 파일 경로   | 주의           | 개인 로컬 경로는 문서에 남기지 않는다. 보관 시스템 이름 정도만 기록 |
| keystore password    | 금지           | 어떤 문서에도 남기지 않는다                                         |
| key alias/password   | 금지           | 어떤 문서에도 남기지 않는다                                         |

EAS project 연결 후 확인할 것:

```bash
eas credentials --platform android
```

확인 결과는 비밀 값을 제외하고 release smoke log에 다음 수준으로만 기록한다.

```text
Android credential: EAS managed
Keystore backup: not exported / exported to secure vault
Checked at: YYYY-MM-DD
```

credential을 잃어버리면 같은 package의 update install 또는 Play Store 배포가 어려워질 수 있다. 따라서 APK가 실제 사용 단계로 들어가기 전에는 EAS managed credential 접근 권한과 복구 절차를 반드시 확인한다.
