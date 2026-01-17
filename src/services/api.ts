import axios from 'axios';
import { Flight, Location, SearchParams } from '../types';

const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
const BASE_URL = 'https://test.api.amadeus.com';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async () => {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await axios.post(`${BASE_URL}/v1/security/oauth2/token`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to authenticate with Amadeus');
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const formatDuration = (ptDuration: string): string => {
  const match = ptDuration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return ptDuration;
  const hours = match[1] ? match[1].replace('H', 'h') : '';
  const minutes = match[2] ? match[2].replace('M', 'm') : '';
  return `${hours} ${minutes}`.trim();
};

export const searchLocations = async (keyword: string): Promise<Location[]> => {
  if (!keyword || keyword.length < 2) return [];
  try {
    const response = await apiClient.get('/v1/reference-data/locations', {
      params: {
        keyword,
        subType: 'CITY,AIRPORT',
        'page[limit]': 5,
      },
    });
    
    return response.data.data.map((loc: any) => ({
      name: loc.name,
      iataCode: loc.iataCode,
      cityName: loc.address.cityName,
    }));
  } catch (error) {
    console.error('Location search failed:', error);
    return [];
  }
};

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    const response = await apiClient.get('/v2/shopping/flight-offers', {
      params: {
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.passengers,
        currencyCode: 'USD',
        max: 20,
      },
    });

    if (!response.data || !response.data.data) return [];

    const carriers = response.data.dictionaries?.carriers || {};

    return response.data.data.map((offer: any) => {
      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      const firstSegment = segments[0];
      const lastSegment = segments[segments.length - 1];
      const airlineCode = firstSegment.carrierCode;

      const mappedSegments = segments.map((seg: any) => ({
        departure: {
          iataCode: seg.departure.iataCode,
          at: seg.departure.at,
        },
        arrival: {
          iataCode: seg.arrival.iataCode,
          at: seg.arrival.at,
        },
        carrierCode: seg.carrierCode,
        number: seg.number,
        duration: formatDuration(seg.duration),
      }));

      const cabinClass = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY';

      const statuses = ['On Time', 'Delayed', 'Scheduled'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        id: offer.id,
        airline: carriers[airlineCode] || airlineCode,
        flightNumber: `${airlineCode}${firstSegment.number}`,
        origin: firstSegment.departure.iataCode,
        destination: lastSegment.arrival.iataCode,
        departureTime: firstSegment.departure.at,
        arrivalTime: lastSegment.arrival.at,
        price: parseFloat(offer.price.total),
        stops: segments.length - 1,
        duration: formatDuration(itinerary.duration),
        segments: mappedSegments,
        cabinClass,
        status,
      };
    });
  } catch (error) {
    console.error('Flight search failed:', error);
    // Fallback to empty array or re-throw depending on desired behavior
    throw error;
  }
};