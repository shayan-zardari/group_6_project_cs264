# Project Design Document

## Context and Problem Statement

This project is a web app for students who need to fit flexible tasks into an already busy schedule. Students have fixed, non-negotiable time (classes, work, commuting) plus tasks with required time and deadlines.

The problem is that a task list alone does not show where work can realistically fit. The web app solves this by letting a user:

- Create fixed time blocks
- Add tasks (duration + due date + priority)
- View day/week/month gaps
- Assign tasks into open time
- Mark tasks complete
- Use reliable in-app reminders *(future functionality)*

---

## Goals (MVP In-Scope)

- Sign in and use the app as an individual student
- Create/edit/delete fixed schedule blocks with time validation and overlap handling
- Add/edit/delete tasks with duration, due date, and priority
- Show calendar views (day/week/month) with open gaps
- Assign tasks into free blocks and mark tasks complete

## Out of Scope

- Apple/Google/Outlook calendar syncing
- Group collaboration
- Browser push notifications as a requirement

---

## Module Breakdown

### Frontend UI (React Application)
- Calendar view (day/week/month)
- Forms/modals for blocks and tasks
- Task list with completion + reminder indicator

### Core Logic (Express)
- Validation (end > start, overlaps)
- Free time finder (compute gaps)
- Task assignment (manual + simple priority suggestion)

### Database (CSV)
- Load/save blocks, tasks, assignments using a fixed CSV schema

---

## Interface Functions

| Function | Description |
|---|---|
| `saveBlock(blockData)` | Create or update a fixed schedule block |
| `deleteBlock(blockId)` | Remove a fixed schedule block |
| `saveTask(taskData)` | Create or update a task |
| `deleteTask(taskId)` | Remove a task |
| `assignTask(taskId, gapId)` | Assign a task to a free time gap |

---

## Key Decisions

1. **CSV instead of PostgreSQL** — faster setup and simpler MVP.
2. **Simple scheduling first** — gaps + priority ordering, while keeping manual assignment as the main flow.
3. **Strong time validation** — centralized handling to keep the calendar clean.

---

## Risks and Unknowns

| Risk | De-risk Strategy |
|---|---|
| Time overlap edge cases | Centralize time parsing + test overlap scenarios |
| CSV save/load issues | Lock schema early + quick load/save testing |
| Team availability and design consistency | Pick a simple layout early + assign clear ownership per page |

---

## Architecture Diagram

*Fig. 1.1 — Basic Architecture Diagram*

```
┌─────────────────────┐        ┌─────────────────────┐        ┌─────────────────────┐
│                     │        │                     │        │                     │
│   Frontend (React)  │ ──────▶│   Core Logic        │ ──────▶│   Database (CSV)    │
│                     │        │   (Express)         │        │                     │
│  • Calendar View    │        │  • Validation       │        │  • blocks.csv       │
│  • Forms / Modals   │        │  • Gap Finder       │        │  • tasks.csv        │
│  • Task List        │        │  • Task Assignment  │        │  • assignments.csv  │
│                     │◀───────│                     │◀───────│                     │
└─────────────────────┘        └─────────────────────┘        └─────────────────────┘

Data Flows:  blocks · tasks · assignments · reminders
```

> **Steps to finalize diagram:**
> 1. Draw three boxes: Frontend (React) → Core Logic (Express) → Database (CSV).
> 2. Add arrows: UI calls logic; logic reads/writes CSV.
> 3. Label data flows: blocks, tasks, assignments, reminders.
