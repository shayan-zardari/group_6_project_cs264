# Testing Strategy

This document outlines a practical testing strategy for the Scheduling Task Manager project, covering both frontend and backend. It lists recommended tools, types of tests, ideas for implementation, folder structure, CI integration, and quick example snippets.

---

## Goals

- Ensure correctness of UI and business logic.
- Catch regressions early through automated tests.
- Verify end-to-end user flows and API contracts.
- Provide guidance for CI-based test runs and local development.

---

## Frontend Testing

### Recommended tools

- Unit & integration: Vitest (preferred for Vite), or Jest + React Testing Library
- Component testing: React Testing Library
- End-to-end (E2E): Playwright or Cypress
- Accessibility: axe-core (via jest-axe or @axe-core/playwright)
- Visual regression (optional): Storybook + Chromatic or Playwright visual comparisons
- Linting / static checks: ESLint (already present)

### Types of tests

- Unit tests: small pure functions, utility modules, hooks
- Component tests: rendering, user interactions, props, state changes
- Integration tests: component composition, interaction with mocked services
- E2E tests: full flows (sign in, add task, build schedule, mark complete)
- Accessibility tests: keyboard navigation, ARIA attributes, color contrast
- Smoke tests: quick checks that main routes render and API endpoints respond (in CI)

### Folder structure (suggested)

- `src/` (existing)
  - `src/__tests__/` — unit & integration tests
  - `src/components/__tests__/` — component tests next to components
  - `src/e2e/` — Playwright/Cypress tests (or put under `tests/e2e`)
  - `src/test-utils/` — shared test setup and helpers (render wrappers, mocked providers)

### Example commands

- Install (Vitest + RTL + Playwright):

```bash
cd src/client
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
# or for E2E
npm install -D playwright
npx playwright install
```

- Run unit tests:

```bash
cd src/client
npx vitest
# or with npm script:
# npm run test:unit
```

- Run E2E tests (Playwright):

```bash
cd src/client
npx playwright test
```

### Example component test (React Testing Library + Vitest)

```jsx
// src/components/__tests__/Navbar.test.jsx
import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

test("renders app title", () => {
  render(<Navbar />);
  expect(screen.getByText(/Scheduling Task Manager/i)).toBeInTheDocument();
});
```

### Test implementation notes

- Use `msw` (Mock Service Worker) to mock backend API responses for unit/integration tests.
- Provide a `test-utils` render wrapper that includes routers, providers (context, store), and theme.
- Keep tests deterministic: mock timers where needed and avoid external network calls.
- Use code coverage thresholds in CI to prevent coverage regressions.

---

## Backend Testing

### Project notes

- The backend repository currently has a minimal `package.json` with no test dependencies. We'll recommend Node.js testing tools.

### Recommended tools

- Test runner & assertion: Jest (widely used) or Vitest (if you prefer consistency with frontend)
- HTTP integration: Supertest (for Express/Koa HTTP endpoints)
- Unit tests: plain Jest/Vitest
- Contract testing: Pact (optional) or schema-based tests (OpenAPI validation)
- DB testing: use test database (SQLite, in-memory) or test containers / setup teardown scripts
- Mocks: `sinon` or Jest mocks; prefer dependency injection so logic can be unit-tested without I/O

### Types of tests

- Unit tests: service layer, utility functions, business logic
- Integration tests: routes/controllers combined with an in-memory DB or test DB instance
- API contract tests: ensure response shape matches expectations (use JSON schema validation)
- E2E (optional): run full stack locally (backend + frontend), then run Playwright/Cypress tests against running services

### Folder structure (suggested)

- `src/`
  - `src/__tests__/` — unit & integration tests
  - `tests/integration/` — route-level tests using Supertest
  - `tests/fixtures/` — sample payloads and DB seed data

### Example commands

```bash
cd src/backend
npm install -D jest supertest
# Add a test script in package.json: "test": "jest --coverage"
npm run test
```

### Example integration test (Express + Supertest)

```js
// tests/integration/tasks.test.js
const request = require("supertest");
const app = require("../../src/app"); // express app

describe("Tasks API", () => {
  test("GET /api/tasks returns 200 and array", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

### DB testing notes

- Use an isolated test database or an in-memory DB for faster tests.
- Provide seed/teardown scripts that run before/after test suites.
- For CI, spin up a test DB container (e.g., PostgreSQL) or use SQLite in-memory.

---

## CI Integration

- Add test steps to CI (GitHub Actions recommended):
  - Install dependencies for both frontend and backend
  - Run linting
  - Run unit tests (frontend & backend) with coverage
  - Run E2E tests against a deployed preview environment or a service started in the workflow
- Cache `node_modules` and Playwright browsers between CI runs

Example (high level) GitHub Actions job steps:

```yaml
- name: Install
  run: |
    cd src/client && npm ci
    cd ../../src/backend && npm ci
- name: Lint
  run: |
    cd src/client && npm run lint
- name: Unit tests
  run: |
    cd src/client && npx vitest --run
    cd ../../src/backend && npm test
- name: E2E tests
  run: |
    # start services and run Playwright
```

---

## Metrics & Coverage

- Enforce coverage thresholds (e.g., 80% lines) for critical modules.
- Monitor test duration; keep unit tests fast (<1s ideally per file) and move expensive flows to E2E only.

---

## Recommendations & Next Steps

1. Pick a frontend unit runner: prefer `vitest` for Vite projects — easier setup and faster native support.
2. Add `msw` to mock backend in frontend tests.
3. Add `supertest` + `jest` for backend route integration tests.
4. Add example test setup files (`test-utils`, `jest.config.js` or `vitest.config.js`) and one sample test per area to establish patterns.
5. Add a GitHub Actions workflow to run lint, unit tests, and E2E on PRs.

---

## References

- Vitest: https://vitest.dev
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Playwright: https://playwright.dev
- Cypress: https://www.cypress.io
- MSW (Mock Service Worker): https://mswjs.io
- Supertest: https://github.com/visionmedia/supertest
