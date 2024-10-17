# Real-time Price Tracker

## Overview

This application is a simplified multi-page web app that tracks and displays real-time prices for various commodities, currencies, and stocks. It demonstrates the use of React, API integration, WebSockets for real-time updates, and unit testing.

## Features

- **Home Page**: Displays a list of available trading pairs with a search functionality.
- **Details Page**: Shows real-time prices and historical trends for a selected trading pair.
- **Real-time Updates**: Utilizes WebSocket to fetch live price updates.

## Libraries Used

- **React**: For building user interfaces.
- **React Router**: For routing between the Home and Details pages.
- **Axios**: For making HTTP requests to fetch historical price data.
- **Chart.js**: For displaying historical price trends in a chart.
- **React Testing Library**: For unit testing components and functionalities.

### Justification for Libraries

- **React Router** was chosen for its simplicity in managing navigation between different views.
- **Axios** offers a straightforward API for handling HTTP requests.
- **Chart.js** provides an easy way to visualize data and is well-integrated with React.
- **React Testing Library** promotes good testing practices and encourages testing components as the user would interact with them.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/FrancisBaah/francis-m2-assignment
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```
5. Run tests:
   ```bash
   npm run test:ui
   ```

### Architectural Decisions

1. **Component-Based Structure**:

   - The application is built using a component-based architecture, where each logical part of the UI (like the home page and details page) is encapsulated within its own component. This promotes reusability, maintainability, and separation of concerns.

2. **State Management**:

   - React's built-in state management via hooks (`useState` and `useEffect`) is used to handle the state within components. This simplifies the logic for managing local state related to API calls, loading, and error handling.

3. **Routing**:

   - The `react-router-dom` library is utilized for navigation between pages. It allows for declarative routing, making it easy to define routes for different views within the application.

4. **WebSocket Integration**:

   - A WebSocket connection is established in the `Details` component to provide real-time price updates. The connection is managed with retry logic to ensure reliability in case of connection drops.

5. **Error Handling**:
   - Basic error handling is incorporated to provide feedback to users in case of issues with API calls or WebSocket connections. This enhances the user experience by clearly indicating failures.

### Library Choices

1. **React**:

   - Chosen for its popularity, community support, and component-based architecture, which fits the requirements for building interactive UIs.

2. **React Router**:

   - Selected for its ease of use and ability to handle dynamic routing, making it simple to navigate between different views without a full page reload.

3. **Axios**:

   - Used for making HTTP requests to fetch initial data. Axios simplifies requests and provides built-in support for handling JSON responses and intercepting requests or responses.

4. **Chart.js and react-chartjs-2**:

   - These libraries are chosen for data visualization. Chart.js provides a robust and flexible solution for rendering charts, while `react-chartjs-2` makes it easy to integrate Chart.js with React components.

5. **Vitest**:

   - Chosen for unit testing due to its compatibility with Vite and React, enabling fast test runs and a straightforward testing setup.

6. **Vite**:
   - A build tool that offers fast development and optimized production builds. It is chosen for its simplicity and performance benefits over traditional bundlers.

### Assumptions Made

1. **API Reliability**:

   - It is assumed that the external API (Coinbase API) used for fetching trading pairs and historical data is stable and reliable. This impacts how error handling is implemented.

2. **User Experience**:

   - Basic user experience considerations are made, such as loading indicators and error messages. It is assumed that users will benefit from immediate feedback while data is being fetched.

3. **Data Structure**:

   - The application assumes a specific structure for the data returned by the API (e.g., the format of historical price data). Any changes to the API response structure may require adjustments to the code.

4. **Target Audience**:

   - The application is designed for users with basic familiarity with financial data, without needing extensive explanations for terminology or data presented.

5. **Testing Coverage**:
   - It is assumed that critical functionalities are adequately covered by unit tests, focusing on components and data handling logic rather than exhaustive integration tests.
