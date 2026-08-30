import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component Tests", () => {
  it("renders navbar brand title and main heading correctly", () => {
    render(<App />);

    // Check Brand Name
    expect(screen.getByText("CloudDeploy")).toBeInTheDocument();

    // Check Hero Section Title
    expect(screen.getByText(/Deploy your Frontend/i)).toBeInTheDocument();
  });

  it("renders stats grid items", () => {
    render(<App />);

    // Check Stats Cards Values
    expect(screen.getByText("1,482")).toBeInTheDocument();
    expect(screen.getByText("42s")).toBeInTheDocument();
    expect(screen.getByText("28ms")).toBeInTheDocument();
  });

  it("handles trigger deploy click and updates UI", async () => {
    render(<App />);

    // Find Trigger button
    const deployButtons = screen.getAllByRole("button", {
      name: /Trigger Quick Deploy|Deploy Branch/i,
    });
    const triggerBtn = deployButtons[0];

    // Click button to start deployment
    fireEvent.click(triggerBtn);

    // Check loading status
    expect(screen.getByText("Deploying...")).toBeInTheDocument();

    // Wait for deployment completion
    await waitFor(
      () => {
        expect(screen.getByText("Trigger Quick Deploy")).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
