import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { FlightDetailsPage } from './pages/FlightDetailsPage';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/flight/:id" element={<FlightDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
