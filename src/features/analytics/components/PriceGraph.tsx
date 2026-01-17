import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { Flight } from '../../../types';
import { format } from 'date-fns';
import { useTranslation } from '../../../context/LanguageContext';

interface PriceGraphProps {
  flights: Flight[];
}

export const PriceGraph: React.FC<PriceGraphProps> = ({ flights }) => {
  const { t } = useTranslation();

  if (flights.length === 0) return null;

  const data = flights.map(flight => ({
    time: new Date(flight.departureTime).getHours() + new Date(flight.departureTime).getMinutes() / 60,
    price: flight.price,
    airline: flight.airline,
    formattedTime: format(new Date(flight.departureTime), 'HH:mm')
  })).sort((a, b) => a.time - b.time);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 h-80">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{t.graph.title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="time" 
              name={t.graph.time} 
              domain={[0, 24]} 
              tickCount={12}
              tickFormatter={(hour) => `${Math.floor(hour)}:00`}
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              type="number" 
              dataKey="price" 
              name={t.graph.price} 
              unit="$" 
              stroke="#64748b"
              fontSize={12}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border border-slate-200 shadow-md rounded text-sm">
                      <p className="font-semibold">{data.airline}</p>
                      <p>{t.graph.time}: {data.formattedTime}</p>
                      <p className="text-blue-600 font-bold">${data.price}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Flights" data={data} fill="#3b82f6" fillOpacity={0.6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
