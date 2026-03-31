import React, { useEffect, useState } from "react";
import {
  DAYS,
  HOURS,
  getSlotKey,
  loadTasks,
  saveTasks,
} from "./calendar/taskStorage";

export default function CalendarGrid() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tasks, setTasks] = useState(() => loadTasks());
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    durationMinutes: "",
    dueDate: "",
  });

  /* Save tasks to localStorage */
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const openModal = (day, hour) => {
    setSelectedSlot({ day, hour });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTask({
      name: "",
      description: "",
      priority: "medium",
      durationMinutes: "",
      dueDate: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = getSlotKey(selectedSlot.day, selectedSlot.hour);

    setTasks((prev) => ({
      ...prev,
      [key]: (() => {
        const existing = prev[key];
        const list = Array.isArray(existing) ? existing : existing ? [existing] : [];
        return [
          ...list,
          {
            id: `t-${key}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            completed: false,
            ...task,
            ...selectedSlot,
          },
        ];
      })(),
    }));

    closeModal();
  };

  return (
    <>
      <div className="calendar-wrapper">
        <div
          className="calendar-grid"
          style={{
            gridTemplateColumns: `70px repeat(${DAYS.length}, minmax(120px, 1fr))`,
          }}
        >
          <div className="calendar-corner" />
          {DAYS.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}

          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="calendar-time">{hour}</div>
              {DAYS.map((day) => {
                const key = getSlotKey(day, hour);
                    const slotTasks = tasks[key] || [];

                return (
                  <div
                    key={key}
                    className="calendar-cell"
                    onClick={() => openModal(day, hour)}
                  >
                        {slotTasks.slice(0, 3).map((t) => (
                          <div
                            key={t.id || `${t.name}-${t.priority}`}
                            className={`task-badge ${t.priority}`}
                          >
                            {t.name}
                          </div>
                        ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            <p className="modal-subtitle">
              {selectedSlot.day} at {selectedSlot.hour}
            </p>

            <form onSubmit={handleSubmit}>
              <label>
                Task Name
                <input
                  type="text"
                  required
                  value={task.name}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                />
              </label>

              <label>
                Description
                <textarea
                  value={task.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                />
              </label>

              <label>
                Priority
                <select
                  value={task.priority}
                  onChange={(e) =>
                    setTask({ ...task, priority: e.target.value })
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
                  value={task.durationMinutes}
                  onChange={(e) =>
                    setTask({ ...task, durationMinutes: e.target.value })
                  }
                />
              </label>

              <label>
                Due date
                <input
                  type="date"
                  required
                  value={task.dueDate}
                  onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
