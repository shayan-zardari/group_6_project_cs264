import React, { useState } from "react";
import {
  normalizeDuration,
  taskEndMinutes,
  taskStartMinutes,
} from "./taskStorage";

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`;
}

export default function CalendarTaskGroupBlock({ group, style }) {
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const longestTask = group.tasks[0];
  const activeTask =
    group.tasks.find((task) => task.id === hoveredTaskId) || longestTask;
  const longestDuration = Math.max(1, normalizeDuration(longestTask.durationMinutes));
  const activeDuration = normalizeDuration(activeTask.durationMinutes);
  const start = taskStartMinutes(activeTask);
  const hasMultipleTasks = group.tasks.length > 1;

  const blockStyle = {
    ...style,
    height: `${(activeDuration / 60) * 100}%`,
    opacity: activeTask.completed ? 0.55 : 1,
    textDecoration: activeTask.completed ? "line-through" : "none",
  };

  return (
    <div
      className={`task-badge calendar-task-block ${
        hoveredTaskId ? "calendar-task-block--previewing" : ""
      } ${activeTask.priority}`}
      style={blockStyle}
      onClick={(event) => event.stopPropagation()}
      onMouseLeave={() => setHoveredTaskId(null)}
    >
      <div className="calendar-task-block-name">
        {activeTask.name}
        {hasMultipleTasks && (
          <span className="calendar-task-count">{group.tasks.length}</span>
        )}
      </div>

      {hasMultipleTasks &&
        !hoveredTaskId &&
        group.tasks
          .filter((task) => task.id !== longestTask.id)
          .map((task) => {
            const markerTop =
              ((taskEndMinutes(task) - start) / longestDuration) * 100;

            return (
              <span
                key={task.id}
                className="calendar-task-end-marker"
                style={{ top: `${Math.max(0, Math.min(100, markerTop))}%` }}
                title={`${task.name} ends after ${formatDuration(
                  normalizeDuration(task.durationMinutes)
                )}`}
              />
            );
          })}

      {hasMultipleTasks && (
        <details className="calendar-task-dropdown">
          <summary>{hoveredTaskId ? activeTask.name : "Tasks"}</summary>
          <div className="calendar-task-menu">
            {group.tasks.map((task) => (
              <div
                key={task.id}
                className={`calendar-task-menu-item ${task.priority}`}
                onMouseEnter={() => setHoveredTaskId(task.id)}
                onFocus={() => setHoveredTaskId(task.id)}
                tabIndex={0}
              >
                <span>{task.name || "(Untitled)"}</span>
                <span>{formatDuration(normalizeDuration(task.durationMinutes))}</span>
              </div>
          ))}
          </div>
        </details>
      )}
    </div>
  );
}
