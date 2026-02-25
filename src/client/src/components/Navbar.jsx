import React from "react";
import '../index.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">MyApp</div>
        <div className="navbar-buttons">
          <button>Home</button>
          <button>About</button>
          <button>Contact</button>
        </div>
        <button className="add-task-btn">Add Task</button>
      </div>
    </nav>
  );
}
