# Schedule System — CS 264 Final Project (Group 6)

A browser-based scheduling and task-tracking app built with React and Vite. Users can create tasks, assign them to specific dates and times, set priorities and due dates, and view their schedule across day, week, and month calendar views.

## Features

- **Calendar views** — switch between Day, Week, and Month layouts to navigate your schedule
- **Task creation** — add tasks with a name, description, priority (high / medium / low), duration, scheduled time, and optional due date
- **Conflict detection** — tasks in the same time slot are grouped and flagged automatically
- **Priority-sorted task list** — the home page shows all tasks ranked by priority so the most urgent work is always visible first
- **Complete & delete** — bulk-select tasks to mark them done or remove them
- **Persistent storage** — tasks are saved to `localStorage` so your data survives page refreshes

## Team

| Name | Role |
|---|---|
| Shayan | Team Lead |
| Souleymane | Frontend Developer |
| Ridone | Frontend Developer |
| Raheen | Frontend Developer |
| Angela | Frontend Developer |

## Tech Stack

- **React 19** — UI
- **Vite 7** — dev server and build tool
- **Playwright** — end-to-end tests

## Local Setup

**Prerequisites:** Node.js v16 or later (LTS recommended).

```
cd src/client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Other Scripts

| Command | Description |
|---|---|
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run test:e2e:ui` | Open the Playwright UI runner |
| `npm run test:e2e:headed` | Run tests in a visible browser |

## Known Limitations

- No user authentication — all data is local to the browser
- No server or database — data does not sync across devices or browsers
- Conflict detection groups overlapping tasks but does not block creation
- No recurring task support
