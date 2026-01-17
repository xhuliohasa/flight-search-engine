import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { SearchForm } from '../features/search/components/SearchForm';
import { FlightList } from '../features/search/components/FlightList';
import { FilterSidebar } from '../features/search/components/FilterSidebar';
import { PriceGraph } from '../features/analytics/components/PriceGraph';
import { SearchParams, FilterState } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { useSearchFlights } from '../features/search/hooks/useSearchFlights';

export const SearchPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentParams: SearchParams = useMemo(() => ({
    origin: searchParams.get('origin') || 'NYC',
    destination: searchParams.get('destination') || 'LON',
    departureDate: searchParams.get('date') || new Date().toISOString().split('T')[0],
    passengers: Number(searchParams.get('passengers')) || 1
  }), [searchParams]);

  const hasSearched = searchParams.has('origin');

  const { data: flights = [], isLoading, error } = useSearchFlights(currentParams, hasSearched);

  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 3000,
    stops: null,
    airlines: [],
    departureTimeRange: [0, 24],
    cabinClasses: [],
    statuses: []
  });

  useEffect(() => {
    if (flights.length > 0) {
      const newMax = Math.ceil(Math.max(...flights.map(f => f.price)));
      setFilters(prev => ({ ...prev, maxPrice: newMax }));
    }
  }, [flights]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.departureDate,
      passengers: String(params.passengers)
    });
  };

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      if (flight.price > filters.maxPrice) return false;
      if (filters.stops !== null && flight.stops !== filters.stops) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;
      
      if (filters.cabinClasses.length > 0 && !filters.cabinClasses.includes(flight.cabinClass)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(flight.status)) return false;
      
      const flightHour = new Date(flight.departureTime).getHours();
      if (flightHour < filters.departureTimeRange[0] || flightHour >= filters.departureTimeRange[1]) return false;

      return true;
    });
  }, [flights, filters]);

  const uniqueAirlines = useMemo(() => {
    return Array.from(new Set(flights.map(f => f.airline))).sort();
  }, [flights]);

  const minPrice = useMemo(() => {
    return flights.length > 0 ? Math.min(...flights.map(f => f.price)) : 0;
  }, [flights]);

  const maxPrice = useMemo(() => {
    return flights.length > 0 ? Math.max(...flights.map(f => f.price)) : 3000;
  }, [flights]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <div className="bg-blue-600 pb-32 pt-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <SearchForm 
          onSearch={handleSearch} 
          isLoading={isLoading} 
          initialValues={currentParams}
        />

        {error && (
            <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center">
                Failed to fetch flights. Please check your inputs or try again.
            </div>
        )}

        {hasSearched && !error && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={setFilters}
                minPrice={minPrice}
                maxPrice={maxPrice}
                airlines={uniqueAirlines}
              />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {flights.length > 0 && (
                <PriceGraph flights={filteredFlights} />
              )}

              <div>
                {!isLoading && (
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {filteredFlights.length} {filteredFlights.length === 1 ? t.results.flightFound : t.results.flightsFound}
                    </h2>
                  </div>
                )}
                <FlightList flights={filteredFlights} isLoading={isLoading} />
              </div>
            </div>
          </div>
        )}

        {!hasSearched && (
          <div className="mt-20 text-center">
            <div className="text-slate-400 mb-4">
              {t.results.startSearch}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
