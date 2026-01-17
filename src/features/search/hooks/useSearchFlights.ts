import { useQuery } from '@tanstack/react-query';
import { searchFlights } from '../../../services/api';
import { SearchParams } from '../../../types';

export const useSearchFlights = (params: SearchParams, enabled: boolean) => {
  return useQuery({
    queryKey: ['flights', params],
    queryFn: () => searchFlights(params),
    enabled, // Only run query if enabled (e.g. user has clicked search or params are valid)
  });
};
