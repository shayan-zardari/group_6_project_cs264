import React from "react";
import '../index.css';

export default function Navbar({
  onAddTask,
  page,
  onPageChange,
  calendarBg,
  onCalendarBgChange,
}) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Task Scheduler</div>
        <div className="navbar-buttons">
          <button
            type="button"
            className={page === "home" ? "active" : ""}
            onClick={() => onPageChange("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={page === "calendar" ? "active" : ""}
            onClick={() => onPageChange("calendar")}
          >
            Calendar
          </button>
          <button
            type="button"
            className={page === "about" ? "active" : ""}
            onClick={() => onPageChange("about")}
          >
            About
          </button>
        </div>

        <div className="navbar-right">
          <select
            className="calendar-theme"
            value={calendarBg}
            onChange={(e) => onCalendarBgChange(e.target.value)}
            aria-label="Calendar background color"
          >
            <option value="#f9f9f9">Default</option>
            <option value="#ffe4f1">Pink</option>
            <option value="#fff2b3">Yellow</option>
            <option value="#d9ecff">Blue</option>
            <option value="#eadbff">Purple</option>
          </select>

          <button
            type="button"
            className="add-task-btn"
            onClick={onAddTask}
          >
            Add Task
          </button>
        </div>
      </div>
    </nav>
  );
}
