
import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import CalendarWeekView from "./components/calendar/CalendarWeekView";
import CalendarDayView from "./components/calendar/CalendarDayView";
import CalendarMonthView from "./components/calendar/CalendarMonthView";
import {
  getSlotKey,
  HOURS,
  loadTasks,
  saveTasks,
} from "./components/calendar/taskStorage";

export default function App() {
  const [view, setView] = useState("week");
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [tasks, setTasks] = useState(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const formatDateInput = (date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialAddForm = useMemo(() => {
    return {
      dateValue: formatDateInput(anchorDate),
      hour: "09:00",
      name: "",
      description: "",
      priority: "medium",
      durationMinutes: "",
      dueDate: "",
    };
  }, [anchorDate]);

  const [addForm, setAddForm] = useState(initialAddForm);

  const openAddModal = () => {
    setAddForm(initialAddForm);
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const submitAddTask = (e) => {
    e.preventDefault();
    if (!addForm.dateValue || !addForm.hour) return;

    const key = getSlotKey(addForm.dateValue, addForm.hour);
    setTasks((prev) => ({
      ...prev,
      [key]: {
        name: addForm.name,
        description: addForm.description,
        priority: addForm.priority,
        durationMinutes: addForm.durationMinutes,
        dueDate: addForm.dueDate,
        dateValue: addForm.dateValue,
        hour: addForm.hour,
      },
    }));

    closeAddModal();
  };

  return (
    <>
      <Navbar onAddTask={openAddModal} />

      <div className="view-tabs">
        <button
          type="button"
          className={view === "day" ? "active" : ""}
          onClick={() => setView("day")}
        >
          Day
        </button>
        <button
          type="button"
          className={view === "week" ? "active" : ""}
          onClick={() => setView("week")}
        >
          Week
        </button>
        <button
          type="button"
          className={view === "month" ? "active" : ""}
          onClick={() => setView("month")}
        >
          Month
        </button>
      </div>

      {view === "week" && (
        <CalendarWeekView
          anchorDate={anchorDate}
          onAnchorDateChange={setAnchorDate}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
      {view === "day" && (
        <CalendarDayView
          anchorDate={anchorDate}
          onAnchorDateChange={setAnchorDate}
          tasks={tasks}
          setTasks={setTasks}
        />
      )}
      {view === "month" && (
        <CalendarMonthView
          anchorDate={anchorDate}
          onAnchorDateChange={setAnchorDate}
          tasks={tasks}
          onSelectDate={(date) => {
            setAnchorDate(date);
            setView("day");
          }}
        />
      )}

      {addModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Task</h2>
            <form onSubmit={submitAddTask}>
              <label>
                Date
                <input
                  type="date"
                  required
                  value={addForm.dateValue}
                  onChange={(e) => setAddForm({ ...addForm, dateValue: e.target.value })}
                />
              </label>

              <label>
                Time
                <select
                  value={addForm.hour}
                  onChange={(e) => setAddForm({ ...addForm, hour: e.target.value })}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Task Name
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </label>

              <label>
                Description
                <textarea
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                />
              </label>

              <label>
                Priority
                <select
                  value={addForm.priority}
                  onChange={(e) =>
                    setAddForm({ ...addForm, priority: e.target.value })
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
                  value={addForm.durationMinutes}
                  onChange={(e) =>
                    setAddForm({ ...addForm, durationMinutes: e.target.value })
                  }
                />
              </label>

              <label>
                Due date
                <input
                  type="date"
                  required
                  value={addForm.dueDate}
                  onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })}
                />
              </label>

              <div className="modal-actions">
                <button type="button" onClick={closeAddModal}>
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

      <Footer />
    </>
  );
}
