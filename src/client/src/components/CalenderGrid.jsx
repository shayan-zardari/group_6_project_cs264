import React from "react";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export default function CalendarGrid() {
  return (
    <div className="calendar-wrapper">
      <div
        className="calendar-grid"
        style={{
          gridTemplateColumns: `70px repeat(${days.length}, minmax(120px, 1fr))`,
        }}
      >
        {/* Header */}
        <div className="calendar-corner" />
        {days.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}

        {/* Rows */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="calendar-time">{hour}</div>
            {days.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="calendar-cell"
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
