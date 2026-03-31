import React, { useMemo } from "react";
import {
  getDateValueFromDate,
  getTaskCountForDateValue,
} from "./taskStorage";

export default function CalendarMonthView({
  anchorDate,
  onAnchorDateChange,
  tasks,
  onSelectDate,
}) {
  const monthTitle = anchorDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const monthStart = useMemo(() => {
    return new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  }, [anchorDate]);

  const gridStart = useMemo(() => {
    // Align the grid to a Sunday-start week
    const d = new Date(monthStart);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, [monthStart]);

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 42; i += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      arr.push(date);
    }
    return arr;
  }, [gridStart]);

  const prevMonth = () => {
    const d = new Date(anchorDate);
    d.setMonth(d.getMonth() - 1);
    onAnchorDateChange(d);
  };

  const nextMonth = () => {
    const d = new Date(anchorDate);
    d.setMonth(d.getMonth() + 1);
    onAnchorDateChange(d);
  };

  const weekdayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button type="button" className="calendar-nav-btn" onClick={prevMonth}>
          Prev
        </button>
        <div className="calendar-nav-title">{monthTitle}</div>
        <button type="button" className="calendar-nav-btn" onClick={nextMonth}>
          Next
        </button>
      </div>

      <div className="month-wrapper">
        <div className="month-weekday-row">
          {weekdayHeaders.map((h) => (
            <div key={h} className="month-weekday">
              {h}
            </div>
          ))}
        </div>

        <div className="month-grid">
          {cells.map((date) => {
            const isOutsideMonth = date.getMonth() !== anchorDate.getMonth();
            const dateValue = getDateValueFromDate(date);
            const taskCount = getTaskCountForDateValue(tasks, dateValue);

            return (
              <button
                key={dateValue}
                type="button"
                className={`month-cell ${
                  isOutsideMonth ? "month-cell--outside" : ""
                }`}
                onClick={() => onSelectDate(date)}
                aria-label={`Select ${date.toLocaleDateString()}`}
              >
                <div className="month-cell-day">{date.getDate()}</div>
                {taskCount > 0 && <div className="month-cell-indicator" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

