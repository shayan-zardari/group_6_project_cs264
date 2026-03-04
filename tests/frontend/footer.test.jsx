// tests/Footer.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Footer from "../src/client/src/components/Footer";

describe("Footer Component", () => {
  test("renders the logo text", () => {
    render(<Footer />);
    expect(screen.getByText(/Task Scheduler/i)).toBeInTheDocument();
  });

  test("renders the tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/Plan smarter. Achieve faster./i)).toBeInTheDocument();
  });

  test("renders all navigation links", () => {
    render(<Footer />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });
});