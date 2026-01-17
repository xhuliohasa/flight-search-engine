import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import { SearchParams } from '../../../types';
import { LocationInput } from './LocationInput';
import { useTranslation } from '../../../context/LanguageContext';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
  initialValues?: SearchParams;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, initialValues }) => {
  const { t } = useTranslation();
  const [params, setParams] = useState<SearchParams>({
    origin: 'NYC',
    destination: 'LON',
    departureDate: new Date().toISOString().split('T')[0],
    passengers: 1
  });

  useEffect(() => {
    if (initialValues) {
      setParams(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 -mt-8 relative z-10 mx-4 lg:mx-0">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Origin */}
        <LocationInput 
          label={t.search.origin}
          placeholder={t.search.originPlaceholder}
          value={params.origin}
          onChange={(val) => setParams(prev => ({ ...prev, origin: val }))}
        />

        {/* Destination */}
        <LocationInput 
          label={t.search.destination}
          placeholder={t.search.destinationPlaceholder}
          value={params.destination}
          onChange={(val) => setParams(prev => ({ ...prev, destination: val }))}
        />

        {/* Date */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
          </div>
          <input
            type="date"
            value={params.departureDate}
            onChange={(e) => setParams({ ...params, departureDate: e.target.value })}
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
           <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-500">{t.search.departure}</label>
        </div>

        {/* Passengers */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
          </div>
          <select
            value={params.passengers}
            onChange={(e) => setParams({ ...params, passengers: Number(e.target.value) })}
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} {num > 1 ? t.search.passengerUnitPlural : t.search.passengerUnit}</option>
            ))}
          </select>
           <label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-500">{t.search.passengers}</label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">{t.search.searching}</span>
          ) : (
            <span className="flex items-center gap-2"><Search className="h-5 w-5" /> {t.search.searchButton}</span>
          )}
        </button>
      </form>
    </div>
  );
};