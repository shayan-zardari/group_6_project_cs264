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

// Keyed by a specific date (yyyy-mm-dd) + hour slot, so tasks don't repeat.
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

    // Ignore old weekday-based tasks so they don't show up again.
    const keys = Object.keys(parsed || {});
    const isLegacy = keys.some((key) =>
      DAYS.some((d) => key.startsWith(`${d}-`))
    );

    if (isLegacy) return {};

    // Normalize storage into: slotKey -> array of tasks.
    const next = {};
    const normalizeTask = (t, slotKey, idx) => {
      const task = t && typeof t === "object" ? t : {};
      return {
        id: task.id || `t-${slotKey}-${idx}`,
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "medium",
        durationMinutes: task.durationMinutes ?? "",
        dueDate: task.dueDate ?? "",
        dateValue: task.dateValue ?? "",
        hour: task.hour ?? "",
        completed: Boolean(task.completed),
      };
    };

    for (const [slotKey, value] of Object.entries(parsed || {})) {
      if (Array.isArray(value)) {
        next[slotKey] = value.map((t, idx) => normalizeTask(t, slotKey, idx));
        continue;
      }
      if (value && typeof value === "object") {
        next[slotKey] = [normalizeTask(value, slotKey, 0)];
      }
    }
    return next;
  } catch {
    return {};
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTaskCountForDateValue(tasks, dateValue) {
  let count = 0;
  for (const [key, value] of Object.entries(tasks)) {
    if (!key.startsWith(`${dateValue}-`)) continue;
    if (Array.isArray(value)) count += value.length;
  }
  return count;
}

export function getTasksForSlot(tasks, slotKey) {
  return Array.isArray(tasks[slotKey]) ? tasks[slotKey] : [];
}
