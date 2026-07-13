# Smoke Test Log

## 2026-07-14

커밋 기준: `199c6b8` 이후 로컬 변경 포함

환경:

- API 모드: `mock`
- Web export: `/private/tmp/todolab-mobile-web-export`

실행:

```bash
npm run validate
npx expo export --platform web --output-dir /private/tmp/todolab-mobile-web-export
```

결과:

- `npm run validate` 통과
- Web static export 통과
- static route 17개 생성 확인

메모:

- `npx expo start --web`는 기존 `node` 프로세스가 8081 포트를 잡고 있어 새 dev server를 띄우지 못했다.
- 8081 포트는 listen 상태였지만 `curl http://localhost:8081`에는 응답하지 않았다.
- 다음 수동 smoke test 전에는 기존 Expo/Node 프로세스를 정리한 뒤 dev server를 다시 시작한다.
