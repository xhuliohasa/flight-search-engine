import React from 'react';
import { Flight } from '../../../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../context/LanguageContext';

interface FlightCardProps {
  flight: Flight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelect = () => {
    navigate(`/flight/${flight.id}`, { state: { flight } });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow mb-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-1/4">
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
            {flight.airline.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{flight.airline}</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">{flight.flightNumber}</p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                flight.status === 'On Time' ? 'bg-green-100 text-green-700' :
                flight.status === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                flight.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {flight.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full md:w-2/4 px-0 md:px-8">
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{format(new Date(flight.departureTime), 'HH:mm')}</p>
            <p className="text-sm text-slate-500">{flight.origin}</p>
          </div>
          
          <div className="flex flex-col items-center flex-1 px-4">
            <div className="text-xs text-slate-400 mb-1">{flight.duration}</div>
            <div className="w-full h-px bg-slate-300 relative flex items-center justify-center">
               <div className="absolute w-2 h-2 bg-slate-300 rounded-full left-0"></div>
               <div className="absolute w-2 h-2 bg-slate-300 rounded-full right-0"></div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {flight.stops === 0 ? t.results.direct : `${flight.stops} ${flight.stops === 1 ? t.results.stop : t.results.stops}`}
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-slate-900">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
            <p className="text-sm text-slate-500">{flight.destination}</p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end w-full md:w-1/4 gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <div className="text-left md:text-right">
            <p className="text-2xl font-bold text-slate-900">${flight.price}</p>
            <p className="text-xs text-slate-500">{t.results.perPassenger}</p>
          </div>
          <button 
            onClick={handleSelect}
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {t.results.select}
          </button>
        </div>
        
      </div>
    </div>
  );
};
