// Import necessary hooks and helper functions
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCoinbaseTradingPairs } from "../Helper/API_Calls"; // Update the import

// Component to display a list of available trading pairs
const Home = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch trading pairs from the API on component mount
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await fetchCoinbaseTradingPairs();

        setCoins(data);
      } catch (err) {
        setError("Failed to fetch trading pairs");
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  // Filter trading pairs based on user input
  const filteredCoins = coins.filter((coin) =>
    `${coin.base_currency}/${coin.quote_currency}` // Use correct properties for filtering
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Render loading, error, and filtered coin list
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="trading-pairs-container">
      <h1>Available Trading Pairs</h1>
      <input
        type="text"
        placeholder="Search for a coin..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {filteredCoins.map((coin) => {
          const name = `${coin.base_currency} / ${coin.quote_currency}`; // Create a descriptive name

          return (
            <li key={coin.id}>
              <Link to={`/details/${coin.id}`} className="link">
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
