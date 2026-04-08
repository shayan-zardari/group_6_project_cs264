

import {test, expect} from "@playwright/test";

test.describe("Task Scheduler MVP", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload();
  });

  test("user can add a task, see it on Home, mark it complete, and keep it after reload", async ({ page }) => {
    const taskName = "Playwright MVP Task";
    const taskDescription = "Verify add flow, persistence, and completion";
    const taskDate = "2026-04-15";
    const taskTime = "09:00";
    const dueDate = "2026-04-20";

    await page.getByRole("button", { name: "Add Task" }).click();

    await page.getByLabel("Date").fill(taskDate);
    await page.getByLabel("Time").selectOption(taskTime);
    await page.getByLabel("Task Name").fill(taskName);
    await page.getByLabel("Description").fill(taskDescription);
    await page.getByLabel("Priority").selectOption("high");
    await page.getByLabel("Duration (minutes)").fill("45");
    await page.getByLabel("Due date").fill(dueDate);

    await page.getByRole("button", { name: "Save Task" }).click();

    await page.getByRole("button", { name: "Home" }).click();

    const taskCard = page.locator(".home-task").filter({ hasText: taskName });
    await expect(taskCard).toBeVisible();
    await expect(taskCard).toContainText("high");
    await expect(taskCard).toContainText(`${taskDate} at ${taskTime}`);
    await expect(taskCard).toContainText(`Due: ${dueDate}`);

    await taskCard.getByRole("checkbox").check();
    await expect(taskCard.getByRole("checkbox")).toBeChecked();

    await page.reload();
    await page.getByRole("button", { name: "Home" }).click();

    const persistedTaskCard = page.locator(".home-task").filter({ hasText: taskName });
    await expect(persistedTaskCard).toBeVisible();
    await expect(persistedTaskCard.getByRole("checkbox")).toBeChecked();
  });

  test("user can switch calendar views and navigate pages", async ({ page }) => {
    await page.getByRole("button", { name: "Calendar" }).click();

    await expect(page.getByRole("button", { name: "Day" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Week" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Month" })).toBeVisible();

    await page.getByRole("button", { name: "Day" }).click();
    await expect(page.locator(".calendar-view")).toBeVisible();

    await page.getByRole("button", { name: "Week" }).click();
    await expect(page.locator(".calendar-view")).toBeVisible();

    await page.getByRole("button", { name: "Month" }).click();
    await expect(page.locator(".month-grid")).toBeVisible();

    await page.getByRole("button", { name: "About" }).click();
    await expect(page.getByRole("heading", { name: "About" })).toBeVisible();

    await page.getByRole("button", { name: "Home" }).click();
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  });
});