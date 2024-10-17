import axios from 'axios';

export const fetchCoinbaseTradingPairs = async () => {
  try {
    const response = await axios.get('https://api.exchange.coinbase.com/products');
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      throw new Error('Failed to fetch trading pairs: ' + error.message);
    } else {
      // Handle non-Axios errors (if necessary)
      throw new Error('Failed to fetch trading pairs: ' + String(error));
    }
  }
};
