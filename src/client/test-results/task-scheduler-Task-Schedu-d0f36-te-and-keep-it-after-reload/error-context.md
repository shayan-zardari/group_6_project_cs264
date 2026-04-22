# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: task-scheduler.spec.cjs >> Task Scheduler MVP >> user can add a task, see it on Home, mark it complete, and keep it after reload
- Location: tests\task-scheduler.spec.cjs:14:3

# Error details

```
Error: expect(locator).toBeChecked() failed

Locator:  locator('.home-task').filter({ hasText: 'Playwright MVP Task' }).getByRole('checkbox')
Expected: checked
Received: unchecked
Timeout:  5000ms

Call log:
  - Expect "toBeChecked" with timeout 5000ms
  - waiting for locator('.home-task').filter({ hasText: 'Playwright MVP Task' }).getByRole('checkbox')
    9 × locator resolved to <input type="checkbox" class="home-task-select" aria-label="Select Playwright MVP Task"/>
      - unexpected value "unchecked"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Task Scheduler
      - generic [ref=e7]:
        - button "Home" [active] [ref=e8] [cursor=pointer]
        - button "Calendar" [ref=e9] [cursor=pointer]
        - button "About" [ref=e10] [cursor=pointer]
      - generic [ref=e11]:
        - combobox "Calendar background color" [ref=e12] [cursor=pointer]:
          - option "Default" [selected]
          - option "Pink"
          - option "Yellow"
          - option "Blue"
          - option "Purple"
        - button "Add Task" [ref=e13] [cursor=pointer]
  - generic [ref=e15]:
    - generic [ref=e16]:
      - heading "Tasks" [level=1] [ref=e17]
      - generic [ref=e18]: Sorted by priority
    - generic [ref=e19]:
      - button "Select all" [ref=e20] [cursor=pointer]
      - button "Select tasks to mark complete or not complete" [disabled] [ref=e21]: Mark as Complete
      - button "Delete selected" [disabled] [ref=e22]
    - generic [ref=e25]:
      - checkbox "Select Playwright MVP Task" [ref=e26] [cursor=pointer]
      - generic [ref=e27]:
        - generic [ref=e28]: Playwright MVP Task high
        - generic [ref=e29]:
          - generic [ref=e30]: 2026-04-15 at 09:00
          - generic [ref=e31]: "Due: 2026-04-20"
  - contentinfo [ref=e32]:
    - generic [ref=e33]:
      - generic [ref=e34]:
        - heading "Task Scheduler" [level=2] [ref=e35]
        - paragraph [ref=e36]: Plan smarter. Achieve faster.
      - generic [ref=e37]:
        - link "Home" [ref=e38] [cursor=pointer]:
          - /url: "#"
        - link "Calendar" [ref=e39] [cursor=pointer]:
          - /url: "#"
        - link "About" [ref=e40] [cursor=pointer]:
          - /url: "#"
      - generic:
        - paragraph
```

# Test source

```ts
  1  | const { test, expect } = require("@playwright/test");
  2  | 
  3  | test.describe("Task Scheduler MVP", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
  6  | 
  7  |     await page.evaluate(() => {
  8  |       localStorage.clear();
  9  |     });
  10 | 
  11 |     await page.reload();
  12 |   });
  13 | 
  14 |   test("user can add a task, see it on Home, mark it complete, and keep it after reload", async ({ page }) => {
  15 |     const taskName = "Playwright MVP Task";
  16 |     const taskDescription = "Verify add flow, persistence, and completion";
  17 |     const taskDate = "2026-04-15";
  18 |     const taskTime = "09:00";
  19 |     const dueDate = "2026-04-20";
  20 | 
  21 |     await page.getByRole("button", { name: "Add Task" }).click();
  22 | 
  23 |     // Target the first date input = task date
  24 |     await page.locator(".modal input[type='date']").first().fill(taskDate);
  25 | 
  26 |     await page.getByLabel("Time").selectOption(taskTime);
  27 |     await page.getByLabel("Task Name").fill(taskName);
  28 |     await page.getByLabel("Description").fill(taskDescription);
  29 |     await page.getByLabel("Priority").selectOption("high");
  30 |     await page.getByLabel("Duration (minutes)").fill("45");
  31 | 
  32 |     // Target the second date input = due date
  33 |     await page.locator(".modal input[type='date']").nth(1).fill(dueDate);
  34 | 
  35 |     await page.getByRole("button", { name: "Save Task" }).click();
  36 | 
  37 |     await page.getByRole("button", { name: "Home" }).click();
  38 | 
  39 |     const taskCard = page.locator(".home-task").filter({ hasText: taskName });
  40 |     await expect(taskCard).toBeVisible();
  41 |     await expect(taskCard).toContainText("high");
  42 |     await expect(taskCard).toContainText(`${taskDate} at ${taskTime}`);
  43 |     await expect(taskCard).toContainText(`Due: ${dueDate}`);
  44 | 
  45 |     await taskCard.getByRole("checkbox").check();
  46 |     await expect(taskCard.getByRole("checkbox")).toBeChecked();
  47 | 
  48 |     await page.reload();
  49 |     await page.getByRole("button", { name: "Home" }).click();
  50 | 
  51 |     const persistedTaskCard = page.locator(".home-task").filter({ hasText: taskName });
  52 |     await expect(persistedTaskCard).toBeVisible();
> 53 |     await expect(persistedTaskCard.getByRole("checkbox")).toBeChecked();
     |                                                           ^ Error: expect(locator).toBeChecked() failed
  54 |     await expect(persistedTaskCard).toContainText(`${taskDate} at ${taskTime}`);
  55 |     await expect(persistedTaskCard).toContainText(`Due: ${dueDate}`);
  56 |   });
  57 | 
  58 |   test("user can switch calendar views and navigate pages", async ({ page }) => {
  59 |     await page.getByRole("button", { name: "Calendar" }).click();
  60 | 
  61 |     await expect(page.getByRole("button", { name: "Day" })).toBeVisible();
  62 |     await expect(page.getByRole("button", { name: "Week" })).toBeVisible();
  63 |     await expect(page.getByRole("button", { name: "Month" })).toBeVisible();
  64 | 
  65 |     await page.getByRole("button", { name: "Day" }).click();
  66 |     await expect(page.locator(".calendar-view")).toBeVisible();
  67 | 
  68 |     await page.getByRole("button", { name: "Week" }).click();
  69 |     await expect(page.locator(".calendar-view")).toBeVisible();
  70 | 
  71 |     await page.getByRole("button", { name: "Month" }).click();
  72 |     await expect(page.locator(".month-grid")).toBeVisible();
  73 | 
  74 |     await page.getByRole("button", { name: "About" }).click();
  75 |     await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  76 | 
  77 |     await page.getByRole("button", { name: "Home" }).click();
  78 |     await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  79 |   });
  80 | });
```