// Import necessary components and libraries
import Details from "./Components/Details";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home";

// The main App component where routing is defined
function App() {
  return (
    // Wrap the application with the Router to enable routing
    <Router>
      {/* Define routes for the app */}
      <Routes>
        {/* The home route */}
        <Route path="/" element={<Home />} />
        {/* Route for viewing details, where ':id' is a dynamic parameter */}
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
