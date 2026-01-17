import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { MapPin, Loader2, Check } from 'lucide-react';
import { searchLocations } from '../../../services/api';
import { Location } from '../../../types';

interface LocationInputProps {
  label: string;
  value: string; // The IATA code
  onChange: (code: string) => void;
  placeholder: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({ label, value, onChange, placeholder }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Initialize display
  useEffect(() => {
    const hydrateLocation = async () => {
      if (value && !selectedLocation) {
        // If we have a value but no object, try to fetch it or create a placeholder
        try {
          // Ideally we fetch full details, here we fallback to just showing the code if needed
          // Or we can assume if the user passed 'NYC', we want to show 'NYC' until they search again
           const locs = await searchLocations(value);
           const match = locs.find(l => l.iataCode === value);
           if (match) setSelectedLocation(match);
           else setSelectedLocation({ name: value, iataCode: value, cityName: value });
        } catch {
           setSelectedLocation({ name: value, iataCode: value, cityName: value });
        }
      }
    };
    hydrateLocation();
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const locations = await searchLocations(query);
          setResults(locations);
        } catch (e) {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative group text-left">
      <Combobox 
        value={selectedLocation} 
        onChange={(loc) => {
          setSelectedLocation(loc);
          if (loc) onChange(loc.iataCode);
        }}
        nullable
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
            )}
          </div>
          <Combobox.Input
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
            displayValue={(loc: Location) => loc ? `${loc.cityName} (${loc.iataCode})` : ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Label className="absolute -top-2 left-2 bg-white px-1 text-xs font-medium text-slate-500">
            {label}
          </Combobox.Label>
        </div>
        
        <Combobox.Options className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
          {results.length === 0 && query !== '' && !isLoading ? (
             <div className="relative cursor-default select-none py-2 px-4 text-slate-700">
               Nothing found.
             </div>
          ) : (
            results.map((loc) => (
              <Combobox.Option
                key={loc.iataCode}
                value={loc}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-4 ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {loc.cityName}
                      </span>
                      <span className={`block truncate text-xs ${active ? 'text-blue-200' : 'text-slate-500'}`}>
                        {loc.name}
                      </span>
                    </div>
                    {selected ? (
                      <span className={`flex items-center pl-3 ${active ? 'text-white' : 'text-blue-600'}`}>
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : (
                       <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${active ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {loc.iataCode}
                       </span>
                    )}
                  </div>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};
