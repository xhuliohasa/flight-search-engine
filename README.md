# Flight Search Engine

A modern, responsive flight search application built with React, TypeScript, and Tailwind CSS.

## Features

- **Real-time Search:** Search for flights by origin, destination, and date.
- **Amadeus Integration:** Uses the Amadeus Self-Service API for live flight data and location autocomplete.
- **Interactive Filters:** Filter results by maximum price, number of stops, and airlines.
- **Live Price Trends:** A dynamic scatter chart visualizes flight prices throughout the day, updating instantly as you filter.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Date Handling:** date-fns
- **Data Fetching:** Axios

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configuration:**
    The project uses Amadeus API. Ensure `.env` is set up with valid credentials (already included in this build).
    ```env
    VITE_AMADEUS_CLIENT_ID=your_key
    VITE_AMADEUS_CLIENT_SECRET=your_secret
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## Architecture

- **`services/api.ts`**: Handles OAuth authentication with Amadeus and data fetching.
- **`components/LocationInput.tsx`**: Provides autocomplete for city/airport codes.
- **`App.tsx`**: Orchestrates state between the search form, results list, and the visualization graph.

## Design Decisions

- **Autocomplete:** Implemented a custom debounced input to query the Amadeus Location API, improving UX over raw text inputs.
- **Token Management:** The API service handles automatic token generation and expiration checks transparently.
