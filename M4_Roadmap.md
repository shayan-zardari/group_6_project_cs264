# M4 Roadmap — Schedule System (Group 6, CS264)

**Due:** Monday, April 6, 2026
**Current status:** UI complete — backend, tests, error handling, logging, and git tag still needed.

---

## Where We Stand

| Area | Status |
|---|---|
| React UI | ✅ Done |
| Database + backend API | ❌ In Progress |
| Tests | ❌ In Progress |
| Error handling / reliability fixes | ❌ Not started |


---

## Week 1 — Core Functionality (Mar 18–23)
**Focus: Backend + API + UI connection**

**Shayan (Database Engineer)**
- Set up database (SQLite for MVP)
- Tables: `users`, `courses`, `schedules`, `conflicts`
- Write Definition of Done for each core user story in the README

**Ridone (Backend Developer)**
  Create algorithms for searching for local availability for tasks - Freetime Algorithm
  Create functionality for user to put reminders - Reminders
  Create task time conflict if they fall with in same time - Time Conflict Resolver
  Upgrade add task functionality to multiple time blocks

**Ridone and Shayan (Frontend)**
- Replace all hardcoded/mock data in the React UI with real `fetch()` calls to the API
- Add loading states while API calls are in progress
- Create the other webpages for the different calendar views.
- Upgrade navbar

**Goal by Mar 23:** A user can add a task, see their schedule, and get a rejection if there's a time conflict — end to end.

---

## Week 2 — Error Handling + Tests (Mar 24–30)
**Focus: Quality sprint — tests + 2 reliability fixes**

**Tests (everyone contributes)**

Write at least 6 unit tests covering:
- Conflict detection with two overlapping courses
- Conflict detection with two non-overlapping courses (should pass)
- Adding a duplicate course (should be rejected)
- Dropping a course that doesn't exist (graceful error)
- Empty schedule returns correctly
- Invalid course ID input doesn't crash the server

Write 2 integration tests:
- End-to-end: add course → verify it appears in schedule
- End-to-end: add conflicting course → expect rejection response


---

**Presentation Prep** 
**Focus: CI, beta tag, demo rehearsal**

**Engineering (Shayan)**
- Set up GitHub Actions CI: on every push, run `npm test` and backend tests
- CI must be green by April 5
- Create and push beta release tag:
  ```
  git tag v0.9.0-beta
  git push origin v0.9.0-beta
  ```

**Known Issues List (whole team)**

Write an honest list of 3–5 known limitations to present on demo day. Examples:
- No user authentication — any user can view any schedule
- Conflict detection does not yet account for lab sections
- No pagination on the course list
- Error messages are generic, not specific to the failure type

> A Known Issues list demonstrates professional maturity and is directly rewarded in the M4 rubric.

**Presentation prep (whole team)**
- Rehearse the live demo once as a team — assign each person a specific segment
- Prepare answers for likely Q&A questions (see below)
- Do not push new code the morning of April 6 — demo from the tagged commit

---

## Demo Day — April 6

**Suggested narrative order:**
1. Problem statement + core user stories (1–2 min)
2. Live demo: add courses, trigger a conflict, view schedule (3–4 min)
3. Show tests running in the terminal (1 min)
4. Point to the 2 reliability fix PRs in GitHub (1 min)
5. Known Issues list (30 sec)
6. What we'd do next (30 sec)

**Likely Q&A — prepare answers for these:**
- "How does your conflict detection work?" — be ready to show the logic in code
- "What would you fix or add if you had more time?"
- "Where are your tests and what do they cover?"
- "What broke during development and how did you fix it?" — this is your reliability fixes answer


---

## Team Assignments Summary

| Name | Role | M4 Focus |
|---|---|---|
| Shayan | Database Engineer / Team Lead | DB schema, CI setup, git tag |
| Souleymane | Backend Developer | API endpoints, logging, reliability fixes |
| Ridone | Frontend Developer | API integration, UI error states |
| Raheen | Frontend Developer | API integration, UI error states |
| Angela | Frontend Developer | API integration, testing support |
