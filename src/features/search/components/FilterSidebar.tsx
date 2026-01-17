import React from 'react';
import { FilterState } from '../../../types';
import { useTranslation } from '../../../context/LanguageContext';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  airlines: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFilterChange, 
  minPrice, 
  maxPrice,
  airlines 
}) => {
  const { t } = useTranslation();
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  const handleStopChange = (stop: number | null) => {
    onFilterChange({ ...filters, stops: stop });
  };

  const handleAirlineToggle = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const handleTimeChange = (index: 0 | 1, value: number) => {
    const newRange = [...filters.departureTimeRange] as [number, number];
    newRange[index] = value;
    onFilterChange({ ...filters, departureTimeRange: newRange });
  };

  const handleCabinToggle = (cabin: string) => {
    const newCabins = filters.cabinClasses.includes(cabin)
      ? filters.cabinClasses.filter(c => c !== cabin)
      : [...filters.cabinClasses, cabin];
    onFilterChange({ ...filters, cabinClasses: newCabins });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status];
    onFilterChange({ ...filters, statuses: newStatuses });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">{t.filters.title}</h3>

      {/* Price Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {t.filters.maxPrice}: ${filters.maxPrice}
        </label>
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>${Math.floor(minPrice)}</span>
          <span>${Math.floor(maxPrice)}</span>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-700 mb-3">{t.filters.departureTime}</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">{t.filters.after}</label>
            <select 
              value={filters.departureTimeRange[0]} 
              onChange={(e) => handleTimeChange(0, Number(e.target.value))}
              className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 mb-1 block">{t.filters.before}</label>
            <select 
              value={filters.departureTimeRange[1]} 
              onChange={(e) => handleTimeChange(1, Number(e.target.value))}
              className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-700 mb-3">{t.filters.stops}</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stops"
              checked={filters.stops === null}
              onChange={() => handleStopChange(null)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm text-slate-600">{t.filters.any}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stops"
              checked={filters.stops === 0}
              onChange={() => handleStopChange(0)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm text-slate-600">{t.filters.directOnly}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stops"
              checked={filters.stops === 1}
              onChange={() => handleStopChange(1)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-sm text-slate-600">{t.filters.oneStop}</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-700 mb-3">{t.filters.cabinClass}</h4>
        <div className="space-y-2">
          {['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'].map((cabin) => (
            <label key={cabin} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.cabinClasses.includes(cabin)}
                onChange={() => handleCabinToggle(cabin)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm text-slate-600">{cabin.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="text-sm font-medium text-slate-700 mb-3">{t.filters.flightStatus}</h4>
        <div className="space-y-2">
          {['On Time', 'Delayed', 'Scheduled', 'Cancelled'].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => handleStatusToggle(status)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm text-slate-600">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">{t.filters.airlines}</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {airlines.map((airline) => (
            <label key={airline} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => handleAirlineToggle(airline)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
              />
              <span className="text-sm text-slate-600">{airline}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};