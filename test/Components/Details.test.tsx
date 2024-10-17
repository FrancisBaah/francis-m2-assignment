import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { it, expect, describe, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Details from "../../src/Components/Details";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");

describe("Details component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/details/BTC-USD"]}>
        <Routes>
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  it("should display error message on API failure", async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch historical data")
    );

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/details/BTC-USD"]}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const errorMessage = await screen.findByText(
      /Failed to fetch historical data. Please try again later./i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display 'No historical data available.' if no prices data is present", async () => {
    const emptyData = {
      data: {
        prices: [], // This is correct for simulating no data
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(emptyData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/details/BTC-USD"]}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      );
    });

    const noDataMessage = await screen.findByText(
      /No historical data available./i
    );
    expect(noDataMessage).toBeInTheDocument();
  });
});
