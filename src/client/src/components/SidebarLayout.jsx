import { useState } from "react";
import "./SidebarLayout.css";

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(false); // start collapsed

  return (
    <div className="layout">
      {/* small edge button when closed */}
      {!open && (
        <button className="sidebar-peek" onClick={() => setOpen(true)} aria-label="Open sidebar">
          {"›"}
        </button>
      )}

      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="side-top">
          <span className="side-title">Menu</span>
          <button className="toggle" onClick={() => setOpen(false)} aria-label="Close sidebar">
            {"‹"}
          </button>
        </div>

        <div className="side-section">
          <h4>Blocks</h4>
          <div className="row">
            <input type="time" />
            <input type="time" />
          </div>
          <button disabled>Add Block</button>
        </div>

        <div className="side-section">
          <h4>Tasks</h4>
          <input type="time" />
          <input type="number" min={-999} max={999} placeholder="Priority (-999..999)" />
          <textarea rows="3" placeholder="Description" />
          <button disabled>Add Task</button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}