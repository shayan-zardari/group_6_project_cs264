# Schedule System - CS 264 Final Project (Group 6)

A browser-based scheduling and task-tracking app built with React and Vite. The current version is a client-side personal planner that lets users create tasks, place them on a calendar, manage them from a Home page, and keep data locally in the browser.

## Project Summary

This project helps a user plan work across calendar views instead of relying on a plain checklist. Each task includes a scheduled date, start hour, duration, priority, description, and optional due date. The application then presents those tasks in:

- a `Home` task-management view
- a `Day` calendar view
- a `Week` calendar view
- a `Month` overview

The app is currently optimized for lightweight individual planning and demo-ready use, not for multi-user collaboration or cloud sync.

## Current Features

- **Calendar views** - switch between Day, Week, and Month layouts
- **Task creation** - add tasks with a name, description, priority, duration, scheduled time, and optional due date
- **Task editing** - update task details from the Home page
- **Priority-sorted task list** - review all tasks in one place
- **Completion controls** - mark selected tasks complete or not complete
- **Delete controls** - remove selected tasks from the Home page
- **Continuous multi-hour rendering** - longer tasks display as extended blocks in calendar views
- **Grouped same-start tasks** - tasks starting in the same slot are grouped to reduce clutter
- **Day-limit validation** - tasks cannot extend beyond the end of the day
- **High-priority overlap protection** - high-priority tasks cannot share time with other overlapping tasks
- **Persistent storage** - tasks and theme color are stored in `localStorage`

## Architecture Overview

The shipped project is a client-side single-page app. There is no active backend or external database in the current implementation.

### Architecture Diagram

```text
+-----------------------------+
| Browser                     |
|-----------------------------|
| React + Vite SPA            |
| - App.jsx                   |
| - HomePage.jsx              |
| - CalendarDayView.jsx       |
| - CalendarWeekView.jsx      |
| - CalendarMonthView.jsx     |
| - CalendarTaskGroupBlock.jsx|
+---------------+-------------+
                |
                v
+-----------------------------+
| Shared Task Logic           |
|-----------------------------|
| taskStorage.js              |
| - load/save tasks           |
| - time parsing              |
| - overlap validation        |
| - day-bound validation      |
| - task grouping             |
| - calendar layout helpers   |
+---------------+-------------+
                |
                v
+-----------------------------+
| Browser localStorage        |
|-----------------------------|
| calendarTasks               |
| calendarBg                  |
+-----------------------------+
```

### Main Modules

| Module | Purpose |
|---|---|
| `src/client/src/App.jsx` | App shell, navigation, shared task state, add-task modal |
| `src/client/src/components/HomePage.jsx` | Task list, bulk actions, task editing modal |
| `src/client/src/components/calendar/CalendarDayView.jsx` | Single-day hourly schedule |
| `src/client/src/components/calendar/CalendarWeekView.jsx` | Weekly hourly schedule |
| `src/client/src/components/calendar/CalendarMonthView.jsx` | Month grid and day indicators |
| `src/client/src/components/calendar/CalendarTaskGroupBlock.jsx` | Grouped display for same-start tasks |
| `src/client/src/components/calendar/taskStorage.js` | Storage, validation, grouping, and timing logic |
| `src/client/src/index.css` | Global layout and component styling |

## Tech Stack

- **React 19** - user interface
- **Vite 7** - dev server and production build tool
- **Playwright** - end-to-end browser testing
- **ESLint** - linting

## Repository Layout

```text
.
|-- README.md
|-- docs/
|   |-- project-design-document.md
|   `-- test-strategy.md
|-- M4_Roadmap.md
`-- src/
    |-- backend/
    `-- client/
        |-- package.json
        |-- tests/
        `-- src/
```

Notes:

- `src/client` is the active application workspace.
- `src/backend` exists in the repo, but the current delivered product flow is client-only.
- `docs/project-design-document.md` is the best reference for the current implemented architecture.

## Setup Instructions

### Prerequisites

- Node.js 18+ recommended
- npm

### Install and Run

```bash
cd src/client
npm install
npm run dev
```

Then open:

- `http://localhost:5173`

## Build Instructions

To create a production build:

```bash
cd src/client
npm run build
```

Build output is written to:

- `src/client/dist`

To preview the production build locally:

```bash
cd src/client
npm run preview
```

## Testing Instructions

### End-to-End Tests

Run the Playwright suite:

```bash
cd src/client
npm run test:e2e
```

Useful variants:

```bash
npm run test:e2e:ui
npm run test:e2e:headed
```

### Linting

Run:

```bash
cd src/client
npm run lint
```

### Important Testing Notes

- The current project includes Playwright coverage for basic add-task flow and view navigation.
- Test artifacts may appear under `src/client/test-results/` after a run.
- The existing lint configuration may still report known issues unrelated to everyday app usage.

## Current Validation Rules

The app currently enforces these scheduling rules:

1. Tasks are scheduled on hourly start slots (`HH:00`)
2. Duration must be positive
3. Duration cannot push a task past the end of the day
4. Overlaps are allowed except when a high-priority task is involved
5. Editing a task re-runs the same rules as creation

## Known Limitations

- No authentication
- No cloud sync or shared accounts
- No recurring task support
- No sub-hour task start times
- No reminders or notifications
- No active backend or API integration
- Dense task schedules can still become visually crowded even with grouping

## Development Roadmap

This roadmap reflects the project as it exists now and the most sensible next steps for a continued handoff.

### Completed

- React single-page app structure
- Day, Week, and Month views
- Task creation modal
- Home page task list
- Bulk complete and delete actions
- Home page task editing
- Grouped rendering for tasks starting in the same slot
- Client-side persistence with `localStorage`
- Shared time and overlap validation helpers

### Recommended Next Steps

#### Short Term

- Expand Playwright coverage for:
  - task editing
  - duration validation
  - grouped same-start task rendering
- Clean up existing lint issues
- Improve Home page task details and inline feedback

#### Medium Term

- Support finer-grained start times than hourly slots
- Add click-based inspection for grouped tasks in calendar views
- Improve conflict messaging and validation feedback in forms
- Add filtering or search on the Home page

#### Long Term

- Introduce a backend API and persistent database
- Add user authentication
- Support reminders and recurring tasks
- Add cross-device sync and account-based storage

## Team

| Name | Role |
|---|---|
| Shayan | Team Lead |
| Souleymane | Frontend Developer |
| Ridone | Frontend Developer |
| Raheen | Frontend Developer |
| Angela | Frontend Developer |

## Additional Documentation

- [Project Design Document](./docs/project-design-document.md)
- [M4 Roadmap](./M4_Roadmap.md)
- [Test Strategy](./docs/test-strategy.md)
