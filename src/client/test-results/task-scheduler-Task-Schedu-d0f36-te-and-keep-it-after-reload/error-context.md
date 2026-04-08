# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: task-scheduler.spec.cjs >> Task Scheduler MVP >> user can add a task, see it on Home, mark it complete, and keep it after reload
- Location: tests\task-scheduler.spec.cjs:16:7

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('Date') resolved to 2 elements:
    1) <input required="" type="date" value="2026-04-08"/> aka getByRole('textbox', { name: 'Date', exact: true })
    2) <input value="" type="date"/> aka getByRole('textbox', { name: 'Due date' })

Call log:
  - waiting for getByLabel('Date')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Task Scheduler
      - generic [ref=e7]:
        - button "Home" [ref=e8] [cursor=pointer]
        - button "Calendar" [ref=e9] [cursor=pointer]
        - button "About" [ref=e10] [cursor=pointer]
      - generic [ref=e11]:
        - combobox "Calendar background color" [ref=e12] [cursor=pointer]:
          - option "Default" [selected]
          - option "Pink"
          - option "Yellow"
          - option "Blue"
          - option "Purple"
        - button "Add Task" [active] [ref=e13] [cursor=pointer]
  - generic [ref=e14]:
    - generic [ref=e15]:
      - heading "Tasks" [level=1] [ref=e16]
      - generic [ref=e17]: Sorted by priority
    - generic [ref=e19]: No tasks yet. Add one from the calendar.
  - generic [ref=e21]:
    - heading "Add Task" [level=2] [ref=e22]
    - generic [ref=e23]:
      - generic [ref=e24]:
        - text: Date
        - textbox "Date" [ref=e25]: 2026-04-08
      - generic [ref=e26]:
        - text: Time
        - combobox "Time" [ref=e27]:
          - option "00:00"
          - option "01:00"
          - option "02:00"
          - option "03:00"
          - option "04:00"
          - option "05:00"
          - option "06:00"
          - option "07:00"
          - option "08:00"
          - option "09:00" [selected]
          - option "10:00"
          - option "11:00"
          - option "12:00"
          - option "13:00"
          - option "14:00"
          - option "15:00"
          - option "16:00"
          - option "17:00"
          - option "18:00"
          - option "19:00"
          - option "20:00"
          - option "21:00"
          - option "22:00"
          - option "23:00"
      - generic [ref=e28]:
        - text: Task Name
        - textbox "Task Name" [ref=e29]
      - generic [ref=e30]:
        - text: Description
        - textbox "Description" [ref=e31]
      - generic [ref=e32]:
        - text: Priority
        - combobox "Priority" [ref=e33]:
          - option "Low"
          - option "Medium" [selected]
          - option "High"
      - generic [ref=e34]:
        - text: Duration (minutes)
        - spinbutton "Duration (minutes)" [ref=e35]
      - generic [ref=e36]:
        - text: Due date
        - textbox "Due date" [ref=e37]
      - generic [ref=e38]:
        - button "Cancel" [ref=e39] [cursor=pointer]
        - button "Save Task" [ref=e40] [cursor=pointer]
  - contentinfo [ref=e41]:
    - generic [ref=e42]:
      - generic [ref=e43]:
        - heading "Task Scheduler" [level=2] [ref=e44]
        - paragraph [ref=e45]: Plan smarter. Achieve faster.
      - generic [ref=e46]:
        - link "Home" [ref=e47] [cursor=pointer]:
          - /url: "#"
        - link "Tasks" [ref=e48] [cursor=pointer]:
          - /url: "#"
        - link "Calendar" [ref=e49] [cursor=pointer]:
          - /url: "#"
        - link "About" [ref=e50] [cursor=pointer]:
          - /url: "#"
      - generic:
        - paragraph
```

# Test source

```ts
  1  | 
  2  | 
  3  | import {test, expect} from "@playwright/test";
  4  | 
  5  | test.describe("Task Scheduler MVP", () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto("/");
  8  | 
  9  |     await page.evaluate(() => {
  10 |       localStorage.clear();
  11 |     });
  12 | 
  13 |     await page.reload();
  14 |   });
  15 | 
  16 |   test("user can add a task, see it on Home, mark it complete, and keep it after reload", async ({ page }) => {
  17 |     const taskName = "Playwright MVP Task";
  18 |     const taskDescription = "Verify add flow, persistence, and completion";
  19 |     const taskDate = "2026-04-15";
  20 |     const taskTime = "09:00";
  21 |     const dueDate = "2026-04-20";
  22 | 
  23 |     await page.getByRole("button", { name: "Add Task" }).click();
  24 | 
> 25 |     await page.getByLabel("Date").fill(taskDate);
     |                                   ^ Error: locator.fill: Error: strict mode violation: getByLabel('Date') resolved to 2 elements:
  26 |     await page.getByLabel("Time").selectOption(taskTime);
  27 |     await page.getByLabel("Task Name").fill(taskName);
  28 |     await page.getByLabel("Description").fill(taskDescription);
  29 |     await page.getByLabel("Priority").selectOption("high");
  30 |     await page.getByLabel("Duration (minutes)").fill("45");
  31 |     await page.getByLabel("Due date").fill(dueDate);
  32 | 
  33 |     await page.getByRole("button", { name: "Save Task" }).click();
  34 | 
  35 |     await page.getByRole("button", { name: "Home" }).click();
  36 | 
  37 |     const taskCard = page.locator(".home-task").filter({ hasText: taskName });
  38 |     await expect(taskCard).toBeVisible();
  39 |     await expect(taskCard).toContainText("high");
  40 |     await expect(taskCard).toContainText(`${taskDate} at ${taskTime}`);
  41 |     await expect(taskCard).toContainText(`Due: ${dueDate}`);
  42 | 
  43 |     await taskCard.getByRole("checkbox").check();
  44 |     await expect(taskCard.getByRole("checkbox")).toBeChecked();
  45 | 
  46 |     await page.reload();
  47 |     await page.getByRole("button", { name: "Home" }).click();
  48 | 
  49 |     const persistedTaskCard = page.locator(".home-task").filter({ hasText: taskName });
  50 |     await expect(persistedTaskCard).toBeVisible();
  51 |     await expect(persistedTaskCard.getByRole("checkbox")).toBeChecked();
  52 |   });
  53 | 
  54 |   test("user can switch calendar views and navigate pages", async ({ page }) => {
  55 |     await page.getByRole("button", { name: "Calendar" }).click();
  56 | 
  57 |     await expect(page.getByRole("button", { name: "Day" })).toBeVisible();
  58 |     await expect(page.getByRole("button", { name: "Week" })).toBeVisible();
  59 |     await expect(page.getByRole("button", { name: "Month" })).toBeVisible();
  60 | 
  61 |     await page.getByRole("button", { name: "Day" }).click();
  62 |     await expect(page.locator(".calendar-view")).toBeVisible();
  63 | 
  64 |     await page.getByRole("button", { name: "Week" }).click();
  65 |     await expect(page.locator(".calendar-view")).toBeVisible();
  66 | 
  67 |     await page.getByRole("button", { name: "Month" }).click();
  68 |     await expect(page.locator(".month-grid")).toBeVisible();
  69 | 
  70 |     await page.getByRole("button", { name: "About" }).click();
  71 |     await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  72 | 
  73 |     await page.getByRole("button", { name: "Home" }).click();
  74 |     await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  75 |   });
  76 | });
```