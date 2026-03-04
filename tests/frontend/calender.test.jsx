// tests/CalendarGrid.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, beforeEach } from "vitest";
import CalendarGrid from "../../src/client/src/components/CalendarGrid";

describe("CalendarGrid Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders all 7 day headers", () => {
    render(<CalendarGrid />);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("renders time slots starting at 00:00", () => {
    render(<CalendarGrid />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
  });

  test("opens modal when a calendar cell is clicked", () => {
    render(<CalendarGrid />);
    const cells = document.querySelectorAll(".calendar-cell");
    fireEvent.click(cells[0]);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  test("closes modal when Cancel is clicked", () => {
    render(<CalendarGrid />);
    const cells = document.querySelectorAll(".calendar-cell");
    fireEvent.click(cells[0]);
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
  });

  test("saves a task and displays it on the grid", () => {
    render(<CalendarGrid />);
    const cells = document.querySelectorAll(".calendar-cell");
    fireEvent.click(cells[0]);

    fireEvent.change(screen.getByLabelText(/Task Name/i), {
      target: { value: "Math Homework" },
    });

    fireEvent.click(screen.getByText("Save Task"));
    expect(screen.getByText("Math Homework")).toBeInTheDocument();
  });
});