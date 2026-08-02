# Product Design state audit - 2026-08-02

## Scope

- Capture source: mock static Web export, 390×844 mobile viewport
- Product surface: non-default states that users reach while using Search, Task create, and D-Day
- Goal: catch visual friction that route-level screenshots do not reveal.

This audit checks visible Web states only. Native keyboard behavior, OS date/time pickers, VoiceOver/TalkBack, and real network loading/error transitions still need device checks.

## Accepted screenshots

| Step | State                       | Screenshot                   | Health                                                                                             |
| ---- | --------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| 1    | Search advanced filters     | `01-search-advanced.png`     | Good. The grouped filters are readable and the selected pills are clear.                           |
| 2    | Search empty query          | `02-search-empty-query.png`  | Good. Empty state copy is understandable. Browser focus outline is Web-only but should be watched. |
| 3    | Task create schedule type   | `03-task-new-schedule.png`   | Good. Schedule fields appear in a predictable order.                                               |
| 4    | Task create expanded fields | `04-task-new-expanded.png`   | Needed polish. `추가 정보 접기` looked heavier than the surrounding quiet form controls.           |
| 5    | D-Day create form           | `05-dday-create-form.png`    | Good. Form sits close to the goal list without feeling like a separate page.                       |
| 6    | D-Day menu open             | `06-dday-menu-open.png`      | Needed polish. Menu actions floated too much in the card body.                                     |
| 7    | D-Day delete confirmation   | `07-dday-delete-confirm.png` | Strong. The destructive state is clear without being noisy.                                        |
| 8    | D-Day linked tasks expanded | `08-dday-linked-tasks.png`   | Good. Linked tasks are readable; focus outline is a Web capture artifact to watch on keyboard QA.  |

## Changes after audit

- Task create `설명·카테고리 추가 / 추가 정보 접기` changed from a bordered button to a quieter text-like action.
- D-Day open menu changed from centered large text actions to a compact right-aligned action row inside the card.

## Re-audit screenshots

| Step | State                                 | Screenshot                       | Result                                                                    |
| ---- | ------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| 9    | Task create expanded fields after fix | `09-task-new-expanded-after.png` | Better. The toggle no longer competes with recurrence and input controls. |
| 10   | D-Day menu after fix                  | `10-dday-menu-after.png`         | Better. The menu reads as card-scoped secondary actions.                  |

## Remaining checks

- Search pagination after “더 보기” and advanced filter reset.
- Auth error/loading and validation messages.
- Task create custom recurrence and all-day schedule edge cases.
- D-Day create validation, linked task creation form, and delete failure state.
- Native keyboard, date/time picker, font scale 1.5, safe area, VoiceOver/TalkBack.
