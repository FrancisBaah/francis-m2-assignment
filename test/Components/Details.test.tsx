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

  it("should render details and chart on successful data fetch", async () => {
    const historicalData = {
      data: {
        prices: [
          { time: "1728669600", price: "4.2875" },
          { time: "1728662400", price: "4.2715" },
          { time: "1728655200", price: "4.255" },
        ],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(historicalData);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/details/BTC-USD"]}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Details for BTC-USD/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Current Price:/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Bid:/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Ask:/i)).toBeInTheDocument();
    });
  });

  it("should update when WebSocket data is received", async () => {
    const originalWebSocket = window.WebSocket;

    class MockWebSocket extends originalWebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);

        setTimeout(() => {
          const event = new MessageEvent("message", {
            data: JSON.stringify({
              type: "ticker",
              price: "50000",
              best_bid: "49900",
              best_ask: "50100",
            }),
          });

          if (this.onmessage) {
            this.onmessage(event);
          }
        }, 100);
      }
    }

    window.WebSocket = MockWebSocket;

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/details/BTC-USD"]}>
          <Routes>
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Current Price:/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Bid:/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Ask:/i)).toBeInTheDocument();
    });

    // Restore the original WebSocket
    window.WebSocket = originalWebSocket;
  });
  it("should display 'No historical data available.' if no prices data is present", async () => {
    const emptyData = {
      data: {
        prices: [],
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(emptyData);

    render(
      <MemoryRouter initialEntries={["/details/BTC-USD"]}>
        <Routes>
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </MemoryRouter>
    );

    const noDataMessage = await screen.findByText(
      /No historical data available./i
    );
    expect(noDataMessage).toBeInTheDocument();
  });
});
