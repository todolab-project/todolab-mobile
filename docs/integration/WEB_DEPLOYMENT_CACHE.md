# Web Deployment Cache Policy

ToDoLab Web 배포에서 사용자가 브라우저 캐시를 직접 지우지 않아도 새 버전이 자연스럽게 반영되도록 하는 캐시 기준이다.

## 목표

- 새 배포 후 사용자가 앱에 다시 들어오면 최신 `index.html`을 확인한다.
- JS, CSS, image, font 같은 hashed asset은 길게 캐싱해도 안전하게 둔다.
- API 응답, 인증 정보, 사용자 데이터는 정적 asset 캐시 정책과 분리한다.
- service worker 또는 PWA cache는 명시적으로 도입하기 전까지 사용하지 않는다.

## 기본 원칙

| 대상                              | 권장 Cache-Control                          | 이유                                               |
| --------------------------------- | ------------------------------------------- | -------------------------------------------------- |
| `index.html`                      | `no-cache, must-revalidate`                 | 매 진입 시 새 asset manifest를 확인해야 한다.      |
| hashed JS/CSS                     | `public, max-age=31536000, immutable`       | 내용이 바뀌면 파일명이 바뀌므로 장기 캐시한다.     |
| hashed image/font                 | `public, max-age=31536000, immutable`       | 재사용성이 높고 파일명 변경으로 무효화한다.        |
| favicon, manifest 등 고정 파일    | `no-cache` 또는 짧은 `max-age`              | 파일명이 고정될 수 있어 재검증이 안전하다.         |
| API 응답                          | API별 정책. 기본은 `no-store` 또는 짧은 TTL | 사용자 데이터와 앱 shell 캐시는 분리한다.          |
| auth/token/개인정보 관련 endpoint | `no-store`                                  | 민감 데이터가 브라우저/중간 캐시에 남지 않게 한다. |

`no-cache`는 “캐시하지 않는다”가 아니라 “사용하기 전에 서버에 재검증한다”는 의미다. 앱 shell의 진입점에는 이 동작이 적합하다. 정적 hashed asset은 오히려 오래 캐싱해야 재진입이 빠르다.

## 서버 설정 예시

### Nginx

```nginx
location = /index.html {
  add_header Cache-Control "no-cache, must-revalidate";
  try_files $uri =404;
}

location / {
  try_files $uri /index.html;
}

location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|woff2?)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
  try_files $uri =404;
}
```

SPA fallback을 사용하는 경우에도 fallback으로 내려가는 `index.html`에는 장기 캐시를 적용하지 않는다.

### CDN 또는 object storage

- `index.html`: metadata/header를 `Cache-Control: no-cache, must-revalidate`로 설정한다.
- hashed asset directory, 예: `_expo/static/`, `assets/`: `Cache-Control: public, max-age=31536000, immutable`로 설정한다.
- CDN invalidation을 할 수 있다면 배포 시 `index.html`만 우선 invalidation한다.
- 모든 asset을 매번 invalidation하는 방식은 비용과 속도 면에서 기본 전략으로 삼지 않는다.

## Service worker 기준

현재 ToDoLab Web은 별도 service worker/PWA cache를 운영하지 않는다.

나중에 service worker를 도입한다면 아래 기준을 먼저 구현한다.

- 새 service worker 발견 시 background install 후 사용자에게 “새 버전이 있어요. 새로고침” 안내를 제공한다.
- 오래된 service worker가 `index.html` 또는 API 응답을 무기한 들고 있지 않게 한다.
- logout, token 만료, 사용자 변경 시 app data cache를 비운다.
- service worker update smoke를 release checklist에 포함한다.

## 배포 전 확인 순서

1. `npm run validate`를 통과한다.
2. Web production build artifact의 `index.html`과 hashed asset 파일명을 확인한다.
3. 배포 서버 또는 CDN에서 `index.html` 응답 header가 `no-cache` 계열인지 확인한다.
4. 대표 JS/CSS asset 응답 header가 `immutable` 장기 캐시인지 확인한다.
5. 새 배포 후 기존 브라우저 tab에서 reload 또는 재진입 시 최신 화면이 보이는지 확인한다.
6. API 응답에 token, 사용자 데이터가 중간 캐시에 저장될 만한 header가 없는지 확인한다.

## 확인 명령 예시

```bash
curl -I https://<web-host>/index.html
curl -I https://<web-host>/<hashed-js-file>.js
```

기대값:

```text
index.html: Cache-Control: no-cache, must-revalidate
hashed asset: Cache-Control: public, max-age=31536000, immutable
```

## ToDoLab 운영 판단

- 사용자가 새 버전 반영을 위해 브라우저 캐시를 직접 삭제하는 절차는 운영 기준으로 두지 않는다.
- 문제가 생겼을 때 “캐시 삭제해 주세요”는 임시 안내일 뿐이며, 근본 조치는 배포 header 또는 service worker update 정책 수정이다.
- Web 배포 방식이 정해지면 이 문서에 실제 host, CDN, header 적용 위치, 확인 결과를 추가한다.
