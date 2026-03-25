// Calendar views persist their demo tasks in localStorage for now.
// This keeps the UI testable before the backend API is wired up.

const STORAGE_KEY = "calendarTasks";

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export function getDateValueFromDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Keyed by a specific date (yyyy-mm-dd) + hour slot, so tasks don't repeat weekly.
export function getSlotKey(dateValue, hour) {
  return `${dateValue}-${hour}`;
}

export function getDayNameFromDate(date) {
  return DAYS[date.getDay()];
}

export function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);

    // Legacy keys were weekday-based like: "Monday-09:00".
    // If we detect that format, we drop it so the UI doesn't show "recurring" tasks.
    const keys = Object.keys(parsed || {});
    const isLegacy = keys.some((key) =>
      DAYS.some((d) => key.startsWith(`${d}-`))
    );

    return isLegacy ? {} : parsed;
  } catch {
    return {};
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTaskCountForDateValue(tasks, dateValue) {
  let count = 0;
  for (const key of Object.keys(tasks)) {
    if (key.startsWith(`${dateValue}-`)) count += 1;
  }
  return count;
}

