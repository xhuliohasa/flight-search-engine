import React from 'react';
import { Flight } from '../../../types';
import { FlightCard } from './FlightCard';
import { useTranslation } from '../../../context/LanguageContext';

interface FlightListProps {
  flights: Flight[];
  isLoading: boolean;
}

export const FlightList: React.FC<FlightListProps> = ({ flights, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 h-32 animate-pulse">
            <div className="flex justify-between items-center h-full">
              <div className="w-1/4 h-12 bg-slate-100 rounded"></div>
              <div className="w-2/4 h-16 bg-slate-100 rounded mx-4"></div>
              <div className="w-1/4 h-12 bg-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-500">{t.results.noFlights}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
};