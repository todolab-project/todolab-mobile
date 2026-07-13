# Task·일정·완료 기록 통합 검색 API 요구사항

이 문서는 “과거에 어떤 일을 언제 했는가”를 포함한 ToDoLab 모바일의 통합 검색 화면을 구현하기 위해 백엔드에 필요한 계약을 정의한다. 백엔드 구현과 데이터베이스 변경은 `todolab-backend` 저장소에서 별도로 진행한다.

## 1. 사용자 흐름

- 제목이나 설명의 일부를 입력해 Task를 찾는다.
- 예정 Task, 시간 일정, 완료 기록을 하나의 결과 목록에서 찾는다.
- 상태, 종류, 카테고리, 관련 날짜, D-Day 연결 여부를 함께 필터링한다.
- 결과에 “7월 5일 일정”, “7월 3일 완료”처럼 사용자가 기억하는 시간 맥락을 표시한다.
- 결과에서 Task 상세로 이동하고, 상세 변경 후 같은 검색 조건과 위치로 돌아온다.
- 검색어 없이 필터만 적용하는 경우도 지원한다.

## 2. 조회 API

```http
GET /api/v1/tasks/search
```

### Query parameter

| 이름         | 형식                                                                 | 필수   | 기본값     | 의미                                        |
| ------------ | -------------------------------------------------------------------- | ------ | ---------- | ------------------------------------------- |
| `q`          | string                                                               | 아니오 | 없음       | 제목·설명 부분 검색                         |
| `statuses`   | `INBOX,TODAY,DONE`의 쉼표 구분 목록                                  | 아니오 | 전체       | Task 상태                                   |
| `taskTypes`  | `TODO,SCHEDULE,IDEA`의 쉼표 구분 목록                                | 아니오 | 전체       | Task 종류                                   |
| `category`   | string                                                               | 아니오 | 전체       | 정규화된 카테고리의 완전 일치               |
| `ddayGoalId` | positive integer                                                     | 아니오 | 전체       | 특정 D-Day 목표 연결                        |
| `hasDday`    | boolean                                                              | 아니오 | 전체       | D-Day 연결 유무. `ddayGoalId`가 있으면 무시 |
| `allDay`     | boolean                                                              | 아니오 | 전체       | 종일 Task 여부                              |
| `dateField`  | `RELEVANT`, `PLANNED`, `SCHEDULED`, `COMPLETED`, `CREATED`           | 아니오 | `RELEVANT` | 날짜 범위가 적용될 필드                     |
| `dateFrom`   | `YYYY-MM-DD`                                                         | 아니오 | 없음       | 포함되는 시작일, 서비스 시간대 기준         |
| `dateTo`     | `YYYY-MM-DD`                                                         | 아니오 | 없음       | 포함되는 종료일, 서비스 시간대 기준         |
| `sort`       | `RELEVANCE`, `DATE_DESC`, `DATE_ASC`, `UPDATED_DESC`, `CREATED_DESC` | 아니오 | 아래 규칙  | 정렬                                        |
| `cursor`     | opaque string                                                        | 아니오 | 없음       | 다음 페이지 커서                            |
| `limit`      | integer, 1–50                                                        | 아니오 | `20`       | 페이지 크기                                 |

`q`와 문자열 필터는 앞뒤 공백을 제거한다. `q`는 한 글자부터 허용하고 한글·영문 대소문자를 사용자 관점에서 동일하게 검색한다. 빈 `q`는 검색 조건에서 제외한다.

날짜 문자열과 범위 의미는 [`API_DATE_TIME.md`](./API_DATE_TIME.md)를 따른다. `dateFrom > dateTo`, 알 수 없는 enum, 유효하지 않은 커서에는 보정된 빈 목록이 아니라 HTTP 400을 반환한다.

### 관련 날짜

`RELEVANT`는 항목 종류와 상태에 따라 사용자가 가장 자연스럽게 기억할 날짜를 선택한다.

1. `DONE`이면 `completedAt`
2. 시간 또는 종일 일정이면 `startAt`을 서비스 시간대의 날짜로 변환한 값
3. 실행 Task이면 `plannedDate`
4. 위 값이 없으면 `createdAt`

명시적인 `SCHEDULED`는 `startAt`, `COMPLETED`는 `completedAt`, `PLANNED`는 `plannedDate`만 대상으로 한다. 해당 값이 없는 항목은 그 필드의 날짜 검색에서 제외한다.

### 검색 범위

- `q`는 `title`, `description`을 대상으로 한다.
- 카테고리는 별도 필터로만 사용하며 자유 검색 범위에는 포함하지 않는다.
- 논리 삭제가 도입되면 삭제 Task는 항상 제외한다.
- 사용자 인증 도입 후에는 현재 사용자 소유 Task만 조회한다.
- 여러 필터 종류는 AND, 같은 쉼표 목록 안의 값은 OR로 결합한다.

예:

```http
GET /api/v1/tasks/search?q=병원&statuses=INBOX,TODAY&taskTypes=TODO&hasDday=true&sort=RELEVANCE&limit=20
```

## 3. 응답

공통 `ApiResponse<T>`의 `data`는 다음 형태다.

```ts
type TaskSearchItem = {
  task: TaskResponse;
  relevantDate: LocalDateString;
  dateSource: 'PLANNED' | 'SCHEDULED' | 'COMPLETED' | 'CREATED';
};

type TaskSearchPage = {
  items: TaskSearchItem[];
  nextCursor: string | null;
  hasNext: boolean;
};
```

- `task`는 단건 조회와 동일한 완전한 `TaskResponse`다.
- `relevantDate`와 `dateSource`는 검색 결과의 날짜 label과 날짜별 grouping에 사용한다.
- 서버는 서비스 시간대 기준 날짜를 반환하며 모바일이 UTC 문자열을 다시 추측하지 않게 한다.
- 마지막 페이지는 `nextCursor: null`, `hasNext: false`다.
- 결과가 없을 때도 성공 응답과 빈 `items`를 반환한다.
- 전체 개수는 초기 응답 비용을 늘릴 수 있으므로 필수 계약에 포함하지 않는다.

## 4. 정렬과 페이지 안정성

- `q`가 있으면 기본 정렬은 `RELEVANCE`, 없으면 `DATE_DESC`다.
- `RELEVANCE`가 같으면 `updatedAt DESC`, `id DESC`를 적용한다.
- `DATE_ASC`, `DATE_DESC`는 `relevantDate` 다음에 `id DESC`를 적용한다.
- 다른 정렬도 마지막 tie-breaker로 `id`를 사용한다.
- 커서는 정렬 기준과 마지막 Task 식별자를 포함한 opaque 값이어야 한다.
- 같은 커서 요청은 데이터 변경이 없는 동안 같은 다음 구간을 반환해야 한다.
- 커서는 검색 조건에 종속된다. 다른 조건에 재사용하면 HTTP 400을 반환한다.

## 5. 오류 계약

공통 오류 envelope를 유지하고 다음 상황을 구분한다.

| HTTP | 상황                                   |
| ---- | -------------------------------------- |
| 400  | 잘못된 필터, 날짜 범위, 정렬, 커서     |
| 401  | 인증 필요                              |
| 403  | 접근할 수 없는 D-Day 목표 등 권한 위반 |
| 500  | 서버 내부 오류                         |

오류 `message`는 모바일에 그대로 노출할 수 있는 안전한 사용자 문구여야 하며 SQL, stack trace, 내부 식별자를 포함하지 않는다.

## 6. 모바일 구현 전 확인 항목

- [ ] OpenAPI에 query enum, 기본값, 최대 길이와 응답 schema가 등록되어 있다.
- [ ] 한글 조합형·완성형과 영문 대소문자 검색 결과가 일관된다.
- [ ] 중복·누락 없는 cursor pagination 통합 테스트가 있다.
- [ ] Task 변경 후 같은 조건 재조회 시 결과 포함 여부가 즉시 갱신된다.
- [ ] 서울 자정 경계의 `startAt`, `completedAt`, `createdAt`이 올바른 `relevantDate`로 반환된다.
- [ ] 여러 날 일정은 시작일을 대표 날짜로 반환하고 기간 정보는 기존 Task 필드로 표현한다.
- [ ] 빈 검색, 필터만 검색, 결과 없음, 만료·오염된 커서가 테스트되어 있다.
- [ ] 300ms debounce와 이전 요청 취소를 사용해도 서버가 불필요한 작업을 계속하지 않는다.
- [ ] 대표 데이터 기준 첫 페이지 응답 시간 목표를 합의한다.

## 7. 후속 모바일 범위

계약이 구현된 뒤 모바일 저장소에서 다음 순서로 진행한다.

1. 프로필의 검색 진입점과 검색 route
2. 검색 query type, API client, query key
3. 검색어 debounce와 cursor infinite query
4. 상태·종류·날짜·D-Day 필터 UI
5. 관련 날짜별 결과 목록, 빈 상태, 오류와 재시도
6. 상세 화면 왕복 후 조건·스크롤 복원
7. Android, iOS, Web 접근성 및 긴 목록 성능 검증
