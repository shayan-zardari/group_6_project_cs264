# Test Strategy - Schedule System

## Purpose

This document describes what should be tested in the current Schedule System application and how those tests should be prioritized. It reflects the project as it exists now: a client-side React and Vite application with browser `localStorage` persistence and Playwright-based end-to-end coverage.

---

## Current Testing Scope

The current product is primarily a frontend application, so the testing focus should be:

- client-side task validation
- calendar rendering behavior
- task persistence in `localStorage`
- Home page task-management actions
- core user flows across navigation and task editing

There is no active backend API flow in the current shipped product, so backend and database testing are not the main focus for this version.

---

## What Should Be Tested

### 1. Validation Logic

These behaviors should be tested first because they protect data correctness:

- task duration must be positive
- task duration must not extend beyond the end of the day
- high-priority tasks must not overlap with other tasks
- editing a task must re-run the same validation rules as creation
- moving a task to a different date or hour must update its stored slot correctly

### 2. Calendar Rendering

These behaviors should be tested to confirm the UI matches scheduling logic:

- day view renders tasks in the correct hourly slot
- week view renders tasks in the correct day and hour cell
- month view shows indicators for dates with tasks
- multi-hour tasks render as continuous blocks
- same-start tasks render as grouped blocks
- grouped tasks expose dropdown behavior correctly

### 3. Home Page Management

These are critical because the Home page is the main task-management surface:

- tasks appear sorted by priority
- users can select and deselect tasks
- users can mark selected tasks complete
- users can delete selected tasks
- users can open the edit modal and save valid updates
- invalid edits show the correct validation message and do not save

### 4. Persistence

Because the app relies on browser storage, persistence needs direct coverage:

- tasks persist after reload
- edited task data persists after reload
- completion state persists after reload
- deleted tasks stay deleted after reload

---

## Test Levels

### End-to-End Tests

Best for validating:

- add task flow
- edit task flow
- calendar navigation
- grouped task behavior
- persistence after reload

Playwright is already installed and is the most practical test layer currently present in the repository.

### Unit Tests

Best for:

- `taskStorage.js` helper functions
- time parsing
- duration normalization
- overlap detection
- day-bound validation
- task grouping and layout helpers

Unit tests are recommended for the next step because much of the project's risk sits in shared scheduling logic.

### Integration Tests

In this project, integration tests should focus on:

- React component behavior with shared task state
- interaction between forms and `taskStorage.js`
- persistence behavior with mocked or controlled `localStorage`

---

## Highest-Risk Behaviors

These should receive coverage first:

| Priority | Behavior | Why It Matters |
|---|---|---|
| 1 | Day-bound duration validation | Prevents impossible tasks from being saved |
| 2 | High-priority overlap rejection | Protects the main scheduling rule |
| 3 | Task edit flow from Home page | Edits now change both details and slot assignment |
| 4 | Persistence after reload | The app depends on browser storage |
| 5 | Grouped same-start task rendering | It is custom UI behavior and easy to regress |

---

## Suggested Test Cases

### Core Validation

1. Add a task at `23:00` with duration `60` -> save succeeds
2. Add a task at `23:00` with duration `61` -> save is rejected
3. Add a high-priority task that overlaps another task -> rejected
4. Edit an existing task into an invalid overlapping high-priority slot -> rejected
5. Edit a task to a valid new hour -> save succeeds and task appears in the new slot

### Home Page

1. Add a task and verify it appears on Home
2. Edit a task name from Home and verify the new name appears
3. Edit a task duration/date/hour and verify the calendar reflects the change
4. Select tasks and mark them complete
5. Select tasks and delete them

### Calendar Views

1. Switch between Day, Week, and Month views successfully
2. Verify a task appears in the correct day/hour in Day view
3. Verify the same task appears in the correct day/hour in Week view
4. Verify a date with tasks shows an indicator in Month view
5. Verify same-start tasks appear as one grouped block instead of stacked duplicates

### Persistence

1. Add a task, reload, and verify it remains
2. Edit a task, reload, and verify changes remain
3. Mark a task complete, reload, and verify completion remains
4. Delete a task, reload, and verify it is still removed

---

## Test Data Strategy

- Use small task fixtures with explicit dates and hours
- Prefer edge cases such as:
  - `00:00`
  - `23:00`
  - overlapping durations
  - same-start grouped tasks
- Keep test inputs deterministic
- Clear `localStorage` before each end-to-end test

---

## Local Test Commands

From `src/client`:

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npm run lint
npm run build
```

Notes:

- `npm run build` is a useful validation step even though it is not a test suite
- the repo does not currently include a configured frontend unit-test runner such as Vitest

---

## Recommended Next Testing Improvements

1. Add Vitest for unit tests around `taskStorage.js`
2. Add targeted tests for Home page editing
3. Add Playwright coverage for grouped task rendering
4. Add explicit regression tests for day-limit validation
5. Add CI steps that run build, lint, and Playwright on pull requests
