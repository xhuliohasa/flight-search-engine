export interface Segment {
  departure: {
    iataCode: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  stops: number;
  duration: string;
  segments: Segment[]; // Added for details page
  cabinClass: string;
  status: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  passengers: number;
}

export interface Location {
  name: string;
  iataCode: string;
  cityName: string;
}

export interface FilterState {
  maxPrice: number;
  stops: number | null;
  airlines: string[];
  departureTimeRange: [number, number];
  cabinClasses: string[];
  statuses: string[];
}
