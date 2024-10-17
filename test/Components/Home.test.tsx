import React from "react";
import { render, screen } from "@testing-library/react";
import { it, expect, describe, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Home from "../../src/Components/Home";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import * as api from "../../src/Helper/API_Calls"; // Adjust the path as necessary
import { vi } from "vitest"; // Import vi

// Mock the fetchCoinbaseTradingPairs function
vi.mock("../../src/Helper/API_Calls", () => ({
  fetchCoinbaseTradingPairs: vi.fn(),
}));

describe("Home component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    (api.fetchCoinbaseTradingPairs as jest.Mock).mockReset();
  });

  it("should render Available Trading Pairs", async () => {
    // Mock the API call to return some data
    (api.fetchCoinbaseTradingPairs as jest.Mock).mockResolvedValue([
      { id: "1", base_currency: "BTC", quote_currency: "USD" },
      { id: "2", base_currency: "ETH", quote_currency: "USD" },
    ]);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for the heading to appear
    const heading = await screen.findByRole("heading", {
      name: /Available Trading Pairs/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("should display loading text initially", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const loadingText = screen.getByText(/loading/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("should display an error message when API call fails", async () => {
    // Mock the API call to throw an error
    (api.fetchCoinbaseTradingPairs as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch trading pairs")
    );

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(
      /Failed to fetch trading pairs/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
