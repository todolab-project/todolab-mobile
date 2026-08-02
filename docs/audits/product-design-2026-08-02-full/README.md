# Product Design full route audit - 2026-08-02

## Scope

- Capture source: mock static Web export, 390×844 mobile viewport
- Product surface: ToDoLab Mobile route-level screens
- Goal: confirm every currently routable mobile screen has at least one visual pass, then fix obvious UI/UX inconsistencies before moving on.

This is a route-level audit, not a full state audit. Loading, error, empty, keyboard-open, expanded menu, destructive confirmation, and native iOS/Android accessibility states still need dedicated checks.

## Accepted screenshots

| Step | Screen      | Screenshot           | Health                                                                                            |
| ---- | ----------- | -------------------- | ------------------------------------------------------------------------------------------------- |
| 1    | Login       | `01-login.png`       | Good base. Simple and readable, but large empty lower area remains.                               |
| 2    | Register    | `02-register.png`    | Good base. Same auth rhythm as Login.                                                             |
| 3    | Search      | `03-search.png`      | Strong. Filter hierarchy and results are clear.                                                   |
| 4    | Completed   | `04-completed.png`   | Strong. Compact cards and weekly summary feel coherent.                                           |
| 5    | D-Day       | `05-dday.png`        | Needed polish: naked `+` control felt too loose.                                                  |
| 6    | Task create | `06-task-new.png`    | Good base. Disabled save state is clear; later validate expanded schedule/recurrence form states. |
| 7    | Task detail | `07-task-detail.png` | Good content hierarchy. Web scrollbar is visually strong, but this is mostly Web-specific.        |
| 8    | Settings    | `08-settings.png`    | Good base. Sparse, but clear for current settings scope.                                          |
| 9    | Organize    | `09-organize.png`    | Needed polish: section marker dots were visually inconsistent with Today.                         |

## Changes after audit

- D-Day header action changed from an isolated `+` icon to a compact `새 목표` button.
- Organize section marker dots were removed so the screen relies on title, helper copy, count, and card spacing like the rest of the app.

## Re-audit screenshots

| Step | Screen             | Screenshot              | Result                                                                        |
| ---- | ------------------ | ----------------------- | ----------------------------------------------------------------------------- |
| 10   | D-Day after fix    | `05-dday-after.png`     | Better. Add action is now understandable without relying on icon recognition. |
| 11   | Organize after fix | `09-organize-after.png` | Better. The page feels calmer and closer to Today list rhythm.                |

## Remaining UX risks

- Auth screens are clean but may feel slightly empty on tall phones. Add reassurance copy only if onboarding/security context needs it.
- Search advanced filters need an expanded-state screenshot and pagination/empty result screenshot.
- Task create needs expanded schedule and recurrence form screenshots.
- D-Day needs menu-open, create form, delete confirmation, and linked task expanded-state screenshots.
- Native iOS/Android checks remain required for font scale 1.5, safe area, VoiceOver/TalkBack, and OS-level scrolling behavior.
