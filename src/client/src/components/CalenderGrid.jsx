import React, { useState } from "react";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export default function CalendarGrid() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [task, setTask] = useState({
    name: "",
    description: "",
    priority: "medium",
  });

  const openModal = (day, hour) => {
    setSelectedSlot({ day, hour });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTask({ name: "", description: "", priority: "medium" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Task created:", { ...task, ...selectedSlot });
    closeModal();
  };

  return (
    <>
      <div className="calendar-wrapper">
        <div
          className="calendar-grid"
          style={{
            gridTemplateColumns: `70px repeat(${days.length}, minmax(120px, 1fr))`,
          }}
        >
          <div className="calendar-corner" />
          {days.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}

          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="calendar-time">{hour}</div>
              {days.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className="calendar-cell"
                  onClick={() => openModal(day, hour)}
                />
              ))}
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
