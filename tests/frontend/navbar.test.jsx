// src/components/__tests__/Navbar.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Navbar from "../../src/client/src/components/Navbar";

describe("Navbar Component", () => {
  test("renders the logo text", () => {
    render(<Navbar />);
    expect(screen.getByText(/Task Scheduler/i)).toBeInTheDocument();
  });

  test("renders navigation buttons", () => {
    render(<Navbar />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  test("renders the Add Task button", () => {
    render(<Navbar />);
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });
});