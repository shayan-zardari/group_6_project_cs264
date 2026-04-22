import React, { useMemo, useState } from "react";
import CalendarTaskGroupBlock from "./CalendarTaskGroupBlock";
import {
  HOURS,
  getDayNameFromDate,
  getDateValueFromDate,
  getTaskGroupsStartingInHourSlot,
  getTaskLayoutForDate,
  addTaskWithRules,
  parseHourToMinutes,
  taskStartMinutes,
} from "./taskStorage";

export default function CalendarDayView({
  anchorDate,
  onAnchorDateChange,
  tasks,
  setTasks,
}) {
  const dayName = getDayNameFromDate(anchorDate);
  const dateValue = getDateValueFromDate(anchorDate);
  const taskLayout = useMemo(() => {
    return getTaskLayoutForDate(tasks, dateValue);
  }, [tasks, dateValue]);

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

  const getTaskBlockStyle = (group, hour) => {
    const slotStart = parseHourToMinutes(hour);
    const topMinutes = Math.max(0, taskStartMinutes(group) - slotStart);
    const layout = taskLayout[group.id] || { column: 0, columnCount: 1 };
    const width = 100 / layout.columnCount;

    return {
      top: `${(topMinutes / 60) * 100}%`,
      left: `calc(${layout.column * width}% + 2px)`,
      width: `calc(${width}% - 4px)`,
    };
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (!selectedSlot) return;

  const result = addTaskWithRules(tasks, {
    dateValue: selectedSlot.dateValue,
    hour: selectedSlot.hour,
    name: task.name,
    description: task.description,
    priority: task.priority,
    durationMinutes: task.durationMinutes,
    dueDate: task.dueDate,
  });

  if (!result.ok) {
    alert(result.message);
    return;
  }

  setTasks(result.nextTasks);
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
            const slotTaskGroups = getTaskGroupsStartingInHourSlot(
              tasks,
              dateValue,
              hour
            );

            return (
              <React.Fragment key={hour}>
                <div className="calendar-time">{hour}</div>
                <div
                  className={`calendar-cell${
                    slotTaskGroups.length > 0 ? " calendar-cell--has-task" : ""
                  }`}
                  onClick={() => openModal(hour)}
                >
                  {slotTaskGroups.map((group) => (
                    <CalendarTaskGroupBlock
                      key={group.id}
                      group={group}
                      style={getTaskBlockStyle(group, hour)}
                    />
                  ))}
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

