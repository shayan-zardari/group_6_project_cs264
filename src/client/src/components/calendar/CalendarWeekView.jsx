import React, { useMemo, useState } from "react";
import CalendarTaskGroupBlock from "./CalendarTaskGroupBlock";
import {
  DAYS,
  HOURS,
  getDateValueFromDate,
  getTaskGroupsStartingInHourSlot,
  getTaskLayoutForDate,
  addTaskWithRules,
  parseHourToMinutes,
  taskStartMinutes,
} from "./taskStorage";

export default function CalendarWeekView({
  anchorDate,
  onAnchorDateChange,
  tasks,
  setTasks,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    durationMinutes: "",
    dueDate: "",
  });

  const weekStart = useMemo(() => {
    const d = new Date(anchorDate);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay()); // Sunday-start week
    return d;
  }, [anchorDate]);

  const weekDays = useMemo(() => {
    return DAYS.map((dayName, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      return { dayName, date, dateValue: getDateValueFromDate(date) };
    });
  }, [weekStart]);

  const taskLayoutsByDate = useMemo(() => {
    return Object.fromEntries(
      weekDays.map((day) => [
        day.dateValue,
        getTaskLayoutForDate(tasks, day.dateValue),
      ])
    );
  }, [tasks, weekDays]);

  const openModal = (dayName, dateValue, hour) => {
    setSelectedSlot({ dayName, dateValue, hour });
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
    const taskLayout = taskLayoutsByDate[group.dateValue] || {};
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

  const rangeLabel = `${weekDays[0].date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} - ${weekDays[6].date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;

  const prevWeek = () => {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() - 7);
    onAnchorDateChange(d);
  };

  const nextWeek = () => {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() + 7);
    onAnchorDateChange(d);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button type="button" className="calendar-nav-btn" onClick={prevWeek}>
          Prev
        </button>
        <div className="calendar-nav-title">{rangeLabel}</div>
        <button type="button" className="calendar-nav-btn" onClick={nextWeek}>
          Next
        </button>
      </div>

      <div className="calendar-wrapper">
        <div
          className="calendar-grid"
          style={{
            gridTemplateColumns: `70px repeat(${DAYS.length}, minmax(120px, 1fr))`,
          }}
        >
          <div className="calendar-corner" />
          {weekDays.map((d) => (
            <div key={d.dayName} className="calendar-day-header">
              {d.dayName}
              <div className="calendar-day-date">{d.date.getDate()}</div>
            </div>
          ))}

          {HOURS.map((hour) => (
            <React.Fragment key={hour}>
              <div className="calendar-time">{hour}</div>
              {weekDays.map((d) => {
                const slotTaskGroups = getTaskGroupsStartingInHourSlot(
                  tasks,
                  d.dateValue,
                  hour
                );

                return (
                  <div
                    key={`${d.dateValue}-${hour}`}
                    className={`calendar-cell${
                      slotTaskGroups.length > 0 ? " calendar-cell--has-task" : ""
                    }`}
                    onClick={() => openModal(d.dayName, d.dateValue, hour)}
                  >
                    {slotTaskGroups.map((group) => (
                      <CalendarTaskGroupBlock
                        key={group.id}
                        group={group}
                        style={getTaskBlockStyle(group, hour)}
                      />
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {modalOpen && selectedSlot && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            <p className="modal-subtitle">
              {selectedSlot.dayName} ({selectedSlot.dateValue}) at{" "}
              {selectedSlot.hour}
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

