import React from "react";

const PRIORITY_RANK = {
  high: 0,
  medium: 1,
  low: 2,
};

function formatMaybeDueDate(dueDate) {
  if (!dueDate) return "No due date";
  return `Due: ${dueDate}`;
}

export default function HomePage({ tasks, setTasks }) {
  const allTasks = [];
  for (const slotTasks of Object.values(tasks)) {
    const list = Array.isArray(slotTasks)
      ? slotTasks
      : slotTasks
        ? [slotTasks]
        : [];
    for (const t of list) allTasks.push(t);
  }

  allTasks.sort((a, b) => {
    const ra = PRIORITY_RANK[a.priority] ?? 9;
    const rb = PRIORITY_RANK[b.priority] ?? 9;
    if (ra !== rb) return ra - rb;
    if ((a.dateValue || "") !== (b.dateValue || "")) {
      return (a.dateValue || "").localeCompare(b.dateValue || "");
    }
    return (a.hour || "").localeCompare(b.hour || "");
  });

  const toggleComplete = (taskId, nextCompleted) => {
    setTasks((prev) => {
      const copy = { ...prev };
      for (const [slotKey, slotTasks] of Object.entries(copy)) {
        const list = Array.isArray(slotTasks)
          ? slotTasks
          : slotTasks
            ? [slotTasks]
            : [];

        copy[slotKey] = list.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, completed: nextCompleted };
        });
      }
      return copy;
    });
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Tasks</h1>
        <div className="home-subtitle">Sorted by priority</div>
      </div>

      <div className="home-list">
        {allTasks.length === 0 && (
          <div className="home-empty">No tasks yet. Add one from the calendar.</div>
        )}

        {allTasks.map((t) => (
          <div key={t.id} className="home-task">
            <label className="home-task-row">
              <input
                type="checkbox"
                checked={Boolean(t.completed)}
                onChange={(e) => toggleComplete(t.id, e.target.checked)}
              />
              <div className="home-task-content">
                <div className="home-task-title">
                  {t.name || "(Untitled)"}{" "}
                  <span className={`home-priority home-priority--${t.priority}`}>
                    {String(t.priority || "medium")}
                  </span>
                </div>
                <div className="home-task-meta">
                  <span>
                    {t.dateValue ? `${t.dateValue} at ${t.hour}` : `at ${t.hour}`}
                  </span>
                  <span>{formatMaybeDueDate(t.dueDate)}</span>
                </div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

