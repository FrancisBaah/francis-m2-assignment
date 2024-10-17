import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import axios from "axios";

// Register chart.js components
ChartJS.register(...registerables);

// Define types for historical price data
interface PriceData {
  time: string;
  price: string;
}

interface HistoricalResponse {
  data: {
    prices: PriceData[];
  };
}
// Define the type for WebSocket feed data
interface FeedData {
  price: string;
  best_bid: string;
  best_ask: string;
}

// Define the types for chart data
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

// Component to display details for a specific trading pair
const Details = () => {
  // Extract the trading pair 'id' from the URL
  const { id } = useParams<{ id: string }>();

  // State variables to hold price, best bid/ask, errors, loading status, and WebSocket connection status
  const [feedData, setFeedData] = useState<FeedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [socketOpen, setSocketOpen] = useState(false);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  // Function to connect to the WebSocket for real-time price updates
  const connectWebSocket = () => {
    const newSocket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    // WebSocket event listeners
    newSocket.onopen = () => {
      setSocketOpen(true);
      console.log("opened");

      // Subscribe to the 'ticker' channel for real-time price updates
      const subscribeMessage = {
        type: "subscribe",
        product_ids: [id],
        channels: [{ name: "ticker", product_ids: [id] }],
      };
      newSocket.send(JSON.stringify(subscribeMessage));
    };

    // Handle incoming WebSocket messages
    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("message", message);

        if (message.type === "ticker") {
          setFeedData(message);
          setLoading(false); // Set loading to false after receiving the first message
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        setError("Error processing incoming data");
      }
    };

    // Handle WebSocket errors
    newSocket.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("WebSocket connection error");
    };

    // Handle WebSocket closure and attempt reconnection
    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
      setSocketOpen(false); // Update connection status
      setError("WebSocket connection closed. Attempting to reconnect...");
      setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    return () => {
      newSocket.close();
    };
  };

  // Fetch historical price data for the trading pair
  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get<HistoricalResponse>(
        `https://api.coinbase.com/v2/prices/${id}/historic?period=month`
      );

      const prices = response.data.data.prices;
      // Check if the expected historical price data is available
      if (!prices || prices.length === 0) {
        setError("No historical data available.");
        return;
      }
      if (!Array.isArray(prices)) {
        setLoading(false);
        setError("No historical data available.");
        return; // Exit if there's no data
      }

      // Process historical data for the chart
      const labels = prices.map((priceData) => {
        const date = new Date(parseInt(priceData.time) * 1000); // Convert to milliseconds
        return date.toLocaleDateString(); // Return timestamp for Chart.js
      });

      const dataValues = prices.map((priceData) => parseFloat(priceData.price));

      // Set the chart data
      setChartData({
        labels,
        datasets: [
          {
            label: `Price of ${id}`,
            data: dataValues,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching historical data:", error);
      setError("Failed to fetch historical data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data and establish WebSocket connection on component mount
  useEffect(() => {
    fetchHistoricalData(); // Fetch historical data when component mounts
    connectWebSocket();
  }, [id]);

  // Reconnect WebSocket when the connection status changes
  useEffect(() => {
    if (!socketOpen) connectWebSocket();
  }, [socketOpen]);

  // Define options for the chart
  const options = {
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: "Price (USD)",
        },
      },
    },
  };

  // Render the component with loading, error, and chart display logic
  if (loading) return <div>Loading data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Details for {id}</h1>
      <div className="container">
        <p>Current Price: {feedData ? `$${feedData.price}` : "N/A"}</p>
        <p>Best Bid: {feedData ? `$${feedData.best_bid}` : "N/A"}</p>
        <p>Best Ask: {feedData ? `$${feedData.best_ask}` : "N/A"}</p>
        <Link to={"/"} className="link">
          Go Home
        </Link>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Details;
