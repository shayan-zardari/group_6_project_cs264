# Project Design Document

## Context and Problem Statement

This project is a browser-based scheduling app for individual users who want to place tasks on a calendar and manage them in one interface. The current product is focused on lightweight personal planning rather than full academic scheduling or team coordination.

The app solves a simpler problem than the original MVP proposal: it lets a user create timed tasks, review them across calendar views, and manage them from a task list without requiring sign-in, a backend service, or external integrations.

---

## Current Product Scope

### In Scope

- Create tasks with:
  - name
  - description
  - priority
  - duration in minutes
  - scheduled date and hour
  - optional due date
- View tasks in:
  - day view
  - week view
  - month view
- Review all tasks on the Home page, sorted by priority
- Edit tasks from the Home page
- Mark tasks complete or not complete from the Home page
- Delete selected tasks from the Home page
- Persist task data and theme color in browser `localStorage`
- Enforce client-side scheduling rules for:
  - high-priority overlap restrictions
  - duration staying within the same calendar day

### Out of Scope

- User authentication
- Multi-user collaboration
- Server-side APIs
- Database storage
- Calendar sync with Google, Apple, or Outlook
- Notifications or reminders
- Recurring tasks
- Automatic task assignment into free-time gaps
- Separate fixed schedule blocks such as classes or work shifts

---

## Implemented User Experience

### Navigation

The app is a single-page React application with these top-level sections:

- `Home` for task review and editing
- `Calendar` for day, week, and month schedule views
- `About`
- `Contact`

### Calendar Behavior

- **Day view** shows a single date with hourly rows from `00:00` to `23:00`
- **Week view** shows Sunday through Saturday with the same hourly structure
- **Month view** shows a standard month grid with daily task indicators
- Clicking a calendar cell opens a modal to create a task starting in that hour

### Task Rendering Rules

- Tasks are stored as timed items with a start hour and duration
- Multi-hour tasks render as continuous blocks rather than repeated badges in each hour cell
- Tasks that start at the same time are grouped visually
- For same-start groups:
  - the longest task is shown by default
  - shorter tasks are represented with markers
  - a dropdown allows the user to inspect grouped tasks

### Home Page Behavior

- All tasks appear in a priority-sorted list
- Users can:
  - select individual tasks
  - select all tasks
  - mark selected tasks complete or not complete
  - delete selected tasks
  - edit any task through a modal form

---

## Technical Design

### Frontend Architecture

The application is built entirely on the client using:

- **React 19** for UI rendering and state
- **Vite 7** for development and production builds
- **CSS** in `src/client/src/index.css` for layout and visual styling

There is currently no active backend runtime in the shipped application flow.

### State and Persistence

- App-level task state is held in React state in `App.jsx`
- Tasks are loaded from `localStorage` on startup
- Tasks are saved back to `localStorage` whenever they change
- Calendar background color is also persisted in `localStorage`

### Main UI Modules

| Module | Responsibility |
|---|---|
| `App.jsx` | Top-level navigation, shared task state, add-task modal |
| `HomePage.jsx` | Priority-sorted task list, selection actions, edit modal |
| `CalendarDayView.jsx` | Single-day hourly calendar rendering |
| `CalendarWeekView.jsx` | Multi-day hourly calendar rendering |
| `CalendarMonthView.jsx` | Month grid with per-day task indicators |
| `CalendarTaskGroupBlock.jsx` | Grouped visual block for same-start tasks |
| `taskStorage.js` | Task loading, saving, validation, grouping, and layout helpers |

---

## Data Model

Tasks are stored in browser memory and `localStorage` as plain objects with fields equivalent to:

| Field | Purpose |
|---|---|
| `id` | Stable task identifier |
| `name` | Display name |
| `description` | Optional detail text |
| `priority` | `low`, `medium`, or `high` |
| `durationMinutes` | Task length in minutes |
| `dueDate` | Optional due date string |
| `dateValue` | Scheduled date in `YYYY-MM-DD` format |
| `hour` | Scheduled start hour in `HH:00` format |
| `completed` | Completion flag |

The persisted task collection is keyed by start slot using the pattern:

- `YYYY-MM-DD-HH:00`

Each key maps to one or more tasks that begin in the same slot.

---

## Validation and Scheduling Rules

Validation is centralized in `taskStorage.js`.

### Current Rules

1. **Duration normalization**
   - non-numeric or invalid durations fall back to a default positive value

2. **Day boundary enforcement**
   - a task cannot extend beyond the end of the day
   - durations that would run past `23:59` are rejected

3. **Overlap handling**
   - overlapping tasks are generally allowed
   - if either overlapping task is `high` priority, the new task is rejected

4. **Edit validation**
   - editing a task re-runs the same overlap and duration rules
   - changing date or hour can move the task to a different storage slot

---

## Current Architecture Diagram

*Fig. 1.1 - Current Application Architecture*

```text
+---------------------------+
| React App (Vite SPA)      |
|---------------------------|
| App.jsx                   |
| HomePage.jsx              |
| CalendarDayView.jsx       |
| CalendarWeekView.jsx      |
| CalendarMonthView.jsx     |
| CalendarTaskGroupBlock.jsx|
+-------------+-------------+
              |
              v
+---------------------------+
| Client-Side Task Logic    |
|---------------------------|
| taskStorage.js            |
| - load/save tasks         |
| - time parsing            |
| - overlap validation      |
| - day-limit validation    |
| - grouping/layout helpers |
+-------------+-------------+
              |
              v
+---------------------------+
| Browser Storage           |
|---------------------------|
| localStorage              |
| - calendarTasks           |
| - calendarBg              |
+---------------------------+
```

---

## Key Design Decisions

1. **Client-only architecture**
   - The app uses browser persistence instead of a backend to keep setup simple and fast.

2. **Calendar-first interaction**
   - Task creation starts from calendar time slots, with Home acting as the management surface.

3. **Grouped same-start rendering**
   - Tasks starting in the same slot are grouped to reduce visual clutter in dense calendar cells.

4. **Shared validation helpers**
   - Scheduling rules are enforced in one module so creation and editing stay consistent.

---

## Risks and Known Limitations

| Risk / Limitation | Current Status |
|---|---|
| Browser-only persistence | Data does not sync across devices or browsers |
| No authentication | Anyone using the same browser profile can access the same saved tasks |
| Dense calendar scenarios | Grouping helps, but very busy schedules can still become visually crowded |
| Limited time precision | Tasks start on hourly boundaries, even though durations are minute-based |
| Test coverage gaps | Existing Playwright coverage is light relative to the current feature set |

---

## Suggested Next Updates

If the project continues, the next design-document revision should cover:

- whether the app will remain fully client-side
- whether sub-hour task start times will be supported
- whether grouped calendar interactions should become click-based instead of hover-based
- whether recurring tasks or reminders are being added
