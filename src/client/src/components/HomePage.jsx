import React, { useEffect, useState } from "react";
import { HOURS, updateTaskWithRules } from "./calendar/taskStorage";

const PRIORITY_RANK = {
  high: 0,
  medium: 1,
  low: 2,
};

function formatMaybeDueDate(dueDate) {
  if (!dueDate) return "No due date";
  return `Due: ${dueDate}`;
}

function collectAllTaskIds(tasks) {
  const ids = new Set();
  for (const slotTasks of Object.values(tasks)) {
    const list = Array.isArray(slotTasks)
      ? slotTasks
      : slotTasks
        ? [slotTasks]
        : [];
    for (const t of list) {
      if (t.id) ids.add(t.id);
    }
  }
  return ids;
}

export default function HomePage({ tasks, setTasks }) {
  const [selected, setSelected] = useState(() => new Set());
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({
    dateValue: "",
    hour: "09:00",
    name: "",
    description: "",
    priority: "medium",
    durationMinutes: "",
    dueDate: "",
  });

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

  useEffect(() => {
    const valid = collectAllTaskIds(tasks);
    setSelected((prev) => new Set([...prev].filter((id) => valid.has(id))));
  }, [tasks]);

  const selectedTasks = allTasks.filter((t) => selected.has(t.id));
  const allSelectedCompleted =
    selectedTasks.length > 0 && selectedTasks.every((t) => t.completed);
  const completeActionLabel = allSelectedCompleted
    ? "Mark as Not Complete"
    : "Mark as Complete";

  const applyCompleteAction = () => {
    if (selected.size === 0) return;
    const target = new Set(selected);
    const setCompletedTo = allSelectedCompleted ? false : true;
    setTasks((prev) => {
      const next = { ...prev };
      for (const [slotKey, slotTasks] of Object.entries(next)) {
        const list = Array.isArray(slotTasks)
          ? slotTasks
          : slotTasks
            ? [slotTasks]
            : [];
        next[slotKey] = list.map((t) =>
          target.has(t.id) ? { ...t, completed: setCompletedTo } : t
        );
      }
      return next;
    });
  };

  const toggleSelect = (taskId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const allIds = allTasks.map((t) => t.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selected.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(allIds));
  };

  const deleteSelected = () => {
    if (selected.size === 0) return;
    const remove = new Set(selected);
    setTasks((prev) => {
      const next = { ...prev };
      for (const [slotKey, slotTasks] of Object.entries(next)) {
        const list = Array.isArray(slotTasks)
          ? slotTasks
          : slotTasks
            ? [slotTasks]
            : [];
        const filtered = list.filter((t) => !remove.has(t.id));
        if (filtered.length === 0) {
          delete next[slotKey];
        } else {
          next[slotKey] = filtered;
        }
      }
      return next;
    });
    setSelected(new Set());
  };

  const openEditModal = (task) => {
    setEditTaskId(task.id);
    setEditForm({
      dateValue: task.dateValue || "",
      hour: task.hour || "09:00",
      name: task.name || "",
      description: task.description || "",
      priority: task.priority || "medium",
      durationMinutes: String(task.durationMinutes || ""),
      dueDate: task.dueDate || "",
    });
  };

  const closeEditModal = () => {
    setEditTaskId(null);
    setEditForm({
      dateValue: "",
      hour: "09:00",
      name: "",
      description: "",
      priority: "medium",
      durationMinutes: "",
      dueDate: "",
    });
  };

  const submitEditTask = (e) => {
    e.preventDefault();
    if (!editTaskId || !editForm.dateValue || !editForm.hour) return;

    const result = updateTaskWithRules(tasks, editTaskId, editForm);
    if (!result.ok) {
      alert(result.message);
      return;
    }

    setTasks(result.nextTasks);
    closeEditModal();
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Tasks</h1>
        <div className="home-subtitle">Sorted by priority</div>
      </div>

      {allTasks.length > 0 && (
        <div className="home-toolbar">
          <button
            type="button"
            className="home-toolbar-btn"
            onClick={toggleSelectAll}
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
          <button
            type="button"
            className="home-toolbar-btn home-toolbar-btn--primary"
            disabled={selected.size === 0}
            onClick={applyCompleteAction}
            aria-label={
              selected.size === 0
                ? "Select tasks to mark complete or not complete"
                : `${completeActionLabel} ${selected.size} task(s)`
            }
          >
            {completeActionLabel}
            {selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
          <button
            type="button"
            className="home-toolbar-btn home-toolbar-btn--danger"
            disabled={selected.size === 0}
            onClick={deleteSelected}
          >
            Delete selected
            {selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        </div>
      )}

      <div className="home-list">
        {allTasks.length === 0 && (
          <div className="home-empty">No tasks yet. Add one from the calendar.</div>
        )}

        {allTasks.map((t) => (
          <div
            key={t.id}
            className={`home-task${t.completed ? " home-task--completed" : ""}`}
          >
            <div className="home-task-row">
              <input
                className="home-task-select"
                type="checkbox"
                checked={selected.has(t.id)}
                onChange={() => toggleSelect(t.id)}
                aria-label={`Select ${t.name || "task"}`}
              />
              <div className="home-task-content">
                <div className="home-task-header">
                  <div className="home-task-title">
                    <span className="home-task-name">{t.name || "(Untitled)"}</span>{" "}
                    <span className={`home-priority home-priority--${t.priority}`}>
                      {String(t.priority || "medium")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="home-task-edit"
                    onClick={() => openEditModal(t)}
                  >
                    Edit
                  </button>
                </div>
                <div className="home-task-meta">
                  <span>
                    {t.dateValue ? `${t.dateValue} at ${t.hour}` : `at ${t.hour}`}
                  </span>
                  <span>{formatMaybeDueDate(t.dueDate)}</span>
                  {t.description ? <span>{t.description}</span> : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editTaskId && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Task</h2>
            <form onSubmit={submitEditTask}>
              <label>
                Date
                <input
                  type="date"
                  required
                  value={editForm.dateValue}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dateValue: e.target.value })
                  }
                />
              </label>

              <label>
                Time
                <select
                  value={editForm.hour}
                  onChange={(e) =>
                    setEditForm({ ...editForm, hour: e.target.value })
                  }
                >
                  {HOURS.map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Task Name
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </label>

              <label>
                Description
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </label>

              <label>
                Priority
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label>
                Duration (minutes)
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={editForm.durationMinutes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, durationMinutes: e.target.value })
                  }
                />
              </label>

              <label>
                Due date
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
