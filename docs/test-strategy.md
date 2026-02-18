# Test Strategy — Scheduling Task Manager

## Parts to Be Tested

We will test the **Scheduling Task Manager React Web App** using **unit and integration tests only**. Focus is on correctness of scheduling logic and CSV persistence in our data files.

---

## Unit Tests

Test individual functions in isolation — no real CSV file writing, no real UI.

| # | Test Area | Description |
|---|-----------|-------------|
| 1 | Time validation | End time must be > start time; required fields must be present |
| 2 | Overlap detection | Detect overlapping fixed blocks on the same day |
| 3 | Free-time gap calculation | Derive available gaps from a set of fixed blocks |
| 4 | Task ranking | Order tasks by priority and due date |
| 5 | Task fit check | Confirm task duration fits inside a given free-time gap |

---

## Integration Tests

Test modules working together with real data flow.

| # | Test Scenario | What Is Verified |
|---|---------------|-----------------|
| 1 | Create block → validate → save → load | Round-trip correctness for fixed blocks |
| 2 | Create task → assign → save → load | Round-trip correctness for scheduled tasks |
| 3 | CSV schema correctness | No missing columns, no corrupted rows after save/load |
| 4 | Reminder logic | Fake timers + persisted reminder settings function correctly while app is open |

---

## Critical Behaviors to Test First (Highest Risk)

Ordered by risk level — tackle these first.

| Priority | Behavior | Risk |
|----------|----------|------|
| 1 | Overlap handling for fixed blocks | Prevent double-booking or show correct warning |
| 2 | Free-time gap calculation | Correct gaps must be shown to user |
| 3 | CSV persistence round-trip | Save/load must not lose or corrupt data |
| 4 | Task assignment fit | Duration must fit; start/end times must be correct |
| 5 | End time > start time validation | Invalid blocks must be rejected |

---

## Mocked/Stubbed vs. Tested for Real

| Approach | What & Why |
|----------|------------|
| **Mock / Stub** | `setTimeout` — use fake timers for reminder logic |
| **Mock / Stub** | `Date` (system time) — for due date and reminder calculations |
| **Mock / Stub** | File I/O in unit tests — unit tests never touch disk |
| **Test for real** | CSV load/save — use actual persistence utilities writing to a temp test folder |
| **Test for real** | Combined flows — validate + save + reload run end-to-end |

---

## How to Run Tests Locally

```bash
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch       # Watch mode (optional)
```

---

## CI Plan (M3)

A GitHub Actions workflow will run on every push and pull request:

1. Install dependencies — `npm ci`
2. Run full test suite — `npm test`

---

## Test Data Strategy

- Keep **small fixtures** targeting edge cases: overlapping blocks, boundary times, tight gaps.
- Use **sample CSV files** and/or in-test generated objects for integration tests.
- Integration tests write to a **temp folder** and clean up after each run.
