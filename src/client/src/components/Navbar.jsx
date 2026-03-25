import React from "react";
import '../index.css';

export default function Navbar({ onAddTask }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">Task Scheduler</div>
        <div className="navbar-buttons">
          <button>Home</button>
          <button>About</button>
          <button>Contact</button>
        </div>
        <button type="button" className="add-task-btn" onClick={onAddTask}>
          Add Task
        </button>
      </div>
    </nav>
  );
}
