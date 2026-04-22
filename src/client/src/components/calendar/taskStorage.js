// Calendar views persist demo tasks in localStorage for now.

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

export function getSlotKey(dateValue, hour) {
  return `${dateValue}-${hour}`;
}

export function getDayNameFromDate(date) {
  return DAYS[date.getDay()];
}

export function parseHourToMinutes(hour) {
  const [h, m] = String(hour || "00:00").split(":").map(Number);
  return h * 60 + (m || 0);
}

export function normalizeDuration(durationMinutes) {
  const n = Number(durationMinutes);
  return Number.isFinite(n) && n > 0 ? n : 60;
}

export function taskStartMinutes(task) {
  return parseHourToMinutes(task.hour);
}

export function taskEndMinutes(task) {
  return taskStartMinutes(task) + normalizeDuration(task.durationMinutes);
}

export function getCoveredHourSlots(task) {
  const start = taskStartMinutes(task);
  const end = taskEndMinutes(task);

  const covered = [];
  for (let slotStart = 0; slotStart < 24 * 60; slotStart += 60) {
    const slotEnd = slotStart + 60;
    const overlaps = start < slotEnd && end > slotStart;
    if (overlaps) {
      const hh = String(Math.floor(slotStart / 60)).padStart(2, "0");
      covered.push(`${hh}:00`);
    }
  }
  return covered;
}

function overlaps(taskA, taskB) {
  if (taskA.dateValue !== taskB.dateValue) return false;
  return taskStartMinutes(taskA) < taskEndMinutes(taskB) &&
    taskEndMinutes(taskA) > taskStartMinutes(taskB);
}

export function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored);

    const keys = Object.keys(parsed || {});
    const isLegacy = keys.some((key) =>
      DAYS.some((d) => key.startsWith(`${d}-`))
    );

    if (isLegacy) return {};

    const next = {};
    const normalizeTask = (t, slotKey, idx) => {
      const task = t && typeof t === "object" ? t : {};
      return {
        id: task.id || `t-${slotKey}-${idx}`,
        name: task.name || "",
        description: task.description || "",
        priority: task.priority || "medium",
        durationMinutes: normalizeDuration(task.durationMinutes),
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
  for (const value of Object.values(tasks)) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    for (const task of list) {
      if (task.dateValue === dateValue) count += 1;
    }
  }
  return count;
}

export function getTasksForSlot(tasks, slotKey) {
  const [dateValue, hour] = slotKey.split(/-(\d{2}:\d{2})$/).filter(Boolean);
  const results = [];

  for (const value of Object.values(tasks)) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    for (const task of list) {
      if (task.dateValue !== dateValue) continue;
      const covered = getCoveredHourSlots(task);
      if (covered.includes(hour)) {
        results.push(task);
      }
    }
  }

  return results;
}

export function getTasksStartingInHourSlot(tasks, dateValue, hour) {
  const slotStart = parseHourToMinutes(hour);
  const slotEnd = slotStart + 60;
  const results = [];

  for (const value of Object.values(tasks)) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    for (const task of list) {
      if (task.dateValue !== dateValue) continue;
      const start = taskStartMinutes(task);
      if (start >= slotStart && start < slotEnd) {
        results.push(task);
      }
    }
  }

  return results;
}

export function getTasksForDateValue(tasks, dateValue) {
  const results = [];

  for (const value of Object.values(tasks)) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    for (const task of list) {
      if (task.dateValue === dateValue) {
        results.push(task);
      }
    }
  }

  return results.sort((a, b) => {
    const startDiff = taskStartMinutes(a) - taskStartMinutes(b);
    if (startDiff !== 0) return startDiff;
    return taskEndMinutes(b) - taskEndMinutes(a);
  });
}

export function getTaskGroupsForDateValue(tasks, dateValue) {
  const byStartTime = new Map();

  for (const task of getTasksForDateValue(tasks, dateValue)) {
    const key = `${task.dateValue}-${task.hour}`;
    const existing = byStartTime.get(key) || {
      id: key,
      dateValue: task.dateValue,
      hour: task.hour,
      tasks: [],
    };
    existing.tasks.push(task);
    byStartTime.set(key, existing);
  }

  return [...byStartTime.values()].map((group) => {
    const tasksByDuration = [...group.tasks].sort((a, b) => {
      const durationDiff =
        normalizeDuration(b.durationMinutes) - normalizeDuration(a.durationMinutes);
      if (durationDiff !== 0) return durationDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    const longestTask = tasksByDuration[0];

    return {
      ...group,
      tasks: tasksByDuration,
      durationMinutes: normalizeDuration(longestTask?.durationMinutes),
    };
  });
}

export function getTaskGroupsStartingInHourSlot(tasks, dateValue, hour) {
  const slotStart = parseHourToMinutes(hour);
  const slotEnd = slotStart + 60;

  return getTaskGroupsForDateValue(tasks, dateValue).filter((group) => {
    const start = parseHourToMinutes(group.hour);
    return start >= slotStart && start < slotEnd;
  });
}

export function getTaskLayoutForDate(tasks, dateValue) {
  const layout = {};
  const dayTasks = getTaskGroupsForDateValue(tasks, dateValue);
  let active = [];
  let group = [];
  let groupEnd = -1;

  const finishGroup = () => {
    if (group.length === 0) return;

    const columnCount = Math.max(
      1,
      ...group.map((item) => item.column + 1)
    );

    for (const item of group) {
      layout[item.task.id] = {
        column: item.column,
        columnCount,
      };
    }

    active = [];
    group = [];
    groupEnd = -1;
  };

  for (const task of dayTasks) {
    const start = taskStartMinutes(task);
    const end = taskEndMinutes(task);

    if (group.length > 0 && start >= groupEnd) {
      finishGroup();
    }

    active = active.filter((item) => item.end > start);

    let column = 0;
    while (active.some((item) => item.column === column)) {
      column += 1;
    }

    active.push({ column, end });
    group.push({ task, column });
    groupEnd = Math.max(groupEnd, end);
  }

  finishGroup();
  return layout;
}

export function canAddTask(tasks, candidateTask) {
  const allTasks = [];
  for (const value of Object.values(tasks)) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    allTasks.push(...list);
  }

  for (const existing of allTasks) {
    if (!overlaps(existing, candidateTask)) continue;

    const existingHigh = existing.priority === "high";
    const candidateHigh = candidateTask.priority === "high";

    if (existingHigh || candidateHigh) {
      return {
        ok: false,
        message:
          "This time overlaps with a high priority task. High priority tasks cannot share time slots with any other tasks.",
      };
    }
  }

  return { ok: true };
}

export function addTaskWithRules(tasks, taskData) {
  const id = `t-${taskData.dateValue}-${taskData.hour}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;

  const candidateTask = {
    id,
    completed: false,
    name: taskData.name || "",
    description: taskData.description || "",
    priority: taskData.priority || "medium",
    durationMinutes: normalizeDuration(taskData.durationMinutes),
    dueDate: taskData.dueDate || "",
    dateValue: taskData.dateValue,
    hour: taskData.hour,
  };

  const check = canAddTask(tasks, candidateTask);
  if (!check.ok) {
    return check;
  }

  const startKey = getSlotKey(candidateTask.dateValue, candidateTask.hour);
  const existing = tasks[startKey];
  const list = Array.isArray(existing) ? existing : existing ? [existing] : [];

  return {
    ok: true,
    nextTasks: {
      ...tasks,
      [startKey]: [...list, candidateTask],
    },
  };
}
