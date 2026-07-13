# 마켓·소개 이미지 준비 문서

ToDoLab Mobile을 앱 마켓, 소개 페이지, 발표 자료에 보여주기 위한 이미지와 문구 초안이다. 실제 스토어 제출 전에는 Google Play와 App Store의 최신 이미지 규격을 별도로 확인한다.

## 기본 메시지

한 줄 설명:

> 오늘 할 일과 일정을 한 화면에서 정리하고, 끝낸 일을 날짜별로 되돌아보는 모바일 플래너

핵심 가치:

- 오늘 실제로 할 일을 먼저 보여준다.
- 일정과 Task를 구분해 혼란을 줄인다.
- 생각난 일을 빠르게 기록하고 나중에 정리한다.
- 완료한 일을 날짜별 기록으로 남긴다.
- Calendar에서 하루 일정과 여러 날 일정을 함께 확인한다.

## 이미지 세트 초안

```text
docs/marketing/
  01_today.png
  02_quick_capture.png
  03_calendar.png
  04_search.png
  05_completed.png
```

## 1. Today

이미지:

![Today 마켓 이미지](./marketing/01_today.png)

카피:

> 오늘 할 일과 일정을 한눈에

보조 문구:

> 일정은 위에, 실행할 일은 바로 아래에. 오늘 해야 할 일에 집중하세요.

보여줄 화면:

- Today
- 일정 section
- 오늘 할 일 section
- 빠른 기록 버튼 또는 composer

## 2. 빠른 기록

이미지:

![빠른 기록 마켓 이미지](./marketing/02_quick_capture.png)

카피:

> 생각난 일은 바로 기록

보조 문구:

> 지금 정리하지 않아도 괜찮아요. 먼저 기록하고 나중에 Today로 옮기세요.

보여줄 화면:

- 하단 빠른 기록 composer
- 입력창
- 추가 버튼

## 3. Calendar

이미지:

![Calendar 마켓 이미지](./marketing/03_calendar.png)

카피:

> 여러 날 일정도 달력에서 깔끔하게

보조 문구:

> 하루 일정은 label로, 여러 날 일정은 이어지는 bar로 확인하세요.

보여줄 화면:

- 월간 calendar grid
- 하루 일정 label
- 여러 날 일정 bar

## 4. Search

이미지:

![Search 마켓 이미지](./marketing/04_search.png)

카피:

> 언제 무엇을 했는지 빠르게 검색

보조 문구:

> 완료 기록, 일정, Task를 키워드와 필터로 다시 찾을 수 있어요.

보여줄 화면:

- 검색 input
- filter chip
- 검색 결과 row

## 5. Completed

이미지:

![Completed 마켓 이미지](./marketing/05_completed.png)

카피:

> 끝낸 일을 날짜별 기록으로

보조 문구:

> 오늘 끝낸 일과 지난 완료 기록을 확인하고, 필요하면 다시 열 수 있어요.

보여줄 화면:

- Completed
- 날짜별 완료 count
- 완료 Task list

## 이미지 제작 기준

- 실제 화면 캡쳐를 기반으로 한다.
- mock 데이터만 사용하고 실제 개인정보를 넣지 않는다.
- 문구는 한 이미지에 1개 핵심 메시지만 사용한다.
- 배경은 앱의 warm paper tone 또는 중립 배경을 사용한다.
- 스토어 규격 이미지를 만들기 전 원본 캡쳐와 편집본을 분리한다.

권장 원본 구조:

```text
docs/screenshots/       # 실제 앱 캡쳐
docs/marketing/         # 문구와 배경을 얹은 소개 이미지
```

## 실제 제작 전 확인

- [ ] 앱 화면이 mock smoke test를 통과했다.
- [ ] 캡쳐에 실제 개인정보가 없다.
- [ ] light theme 기준 이미지가 준비됐다.
- [ ] 필요 시 dark theme 이미지를 별도 준비한다.
- [ ] Google Play, App Store 이미지 규격을 최신 기준으로 확인했다.
