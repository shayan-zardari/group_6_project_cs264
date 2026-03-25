import React, { useState } from "react";
import {
  HOURS,
  getDayNameFromDate,
  getDateValueFromDate,
  getSlotKey,
} from "./taskStorage";

export default function CalendarDayView({
  anchorDate,
  onAnchorDateChange,
  tasks,
  setTasks,
}) {
  const dayName = getDayNameFromDate(anchorDate);
  const dateValue = getDateValueFromDate(anchorDate);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    durationMinutes: "",
    dueDate: "",
  });

  const openModal = (hour) => {
    setSelectedSlot({ dateValue, hour });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
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
    if (!selectedSlot) return;

    const key = getSlotKey(selectedSlot.dateValue, selectedSlot.hour);
    setTasks((prev) => ({
      ...prev,
      [key]: { ...task, ...selectedSlot },
    }));

    closeModal();
  };

  const dateLabel = anchorDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const prevDay = () => {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - 1);
    onAnchorDateChange(d);
  };

  const nextDay = () => {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() + 1);
    onAnchorDateChange(d);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button type="button" className="calendar-nav-btn" onClick={prevDay}>
          Prev
        </button>
        <div className="calendar-nav-title">
          {dayName} - {dateLabel}
        </div>
        <button type="button" className="calendar-nav-btn" onClick={nextDay}>
          Next
        </button>
      </div>

      <div className="calendar-wrapper">
        <div
          className="calendar-grid"
          style={{
            gridTemplateColumns: `70px minmax(120px, 1fr)`,
            minWidth: "0",
          }}
        >
          <div className="calendar-corner" />
          <div className="calendar-day-header">
            {dayName}
          </div>

          {HOURS.map((hour) => {
            const key = getSlotKey(dateValue, hour);
            const slotTask = tasks[key];

            return (
              <React.Fragment key={hour}>
                <div className="calendar-time">{hour}</div>
                <div
                  className="calendar-cell"
                  onClick={() => openModal(hour)}
                >
                  {slotTask && (
                    <div className={`task-badge ${slotTask.priority}`}>
                      {slotTask.name}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {modalOpen && selectedSlot && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            <p className="modal-subtitle">
              {dayName} ({selectedSlot.dateValue}) at {selectedSlot.hour}
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
    </div>
  );
}

