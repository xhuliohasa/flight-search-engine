import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Flight } from '../types';
import { Header } from '../components/ui/Header';
import { ArrowLeft, Clock, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '../context/LanguageContext';

export const FlightDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight as Flight;

  if (!flight) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
            <ArrowLeft className="h-4 w-4 mr-2" /> {t.details.backToSearch}
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{t.details.flightTo} {flight.destination}</h1>
                        <div className="flex items-center gap-3">
                            <p className="text-blue-100 flex items-center gap-2">
                                <span className="font-semibold">{flight.airline}</span> • {flight.flightNumber}
                            </p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm ${
                                flight.status === 'On Time' ? 'bg-green-500 text-white' :
                                flight.status === 'Delayed' ? 'bg-amber-500 text-white' :
                                flight.status === 'Cancelled' ? 'bg-red-500 text-white' :
                                'bg-slate-400 text-white'
                            }`}>
                                {flight.status}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-bold">${flight.price}</p>
                        <p className="text-sm text-blue-100">{t.details.totalPrice}</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">{t.details.itinerary}</h2>
                
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 pb-2">
                    {flight.segments.map((segment, index) => {
                        const isLast = index === flight.segments.length - 1;
                        
                        return (
                            <React.Fragment key={index}>
                                {/* Departure Node */}
                                <div className="relative">
                                    <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-600 shadow-sm"></div>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-900">{format(new Date(segment.departure.at), 'HH:mm')}</span>
                                        <span className="text-slate-500 text-sm">{format(new Date(segment.departure.at), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="text-slate-900 font-medium mb-1">
                                        {segment.departure.iataCode} <span className="text-slate-400 font-normal">{t.details.airport}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 my-4 border border-slate-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Plane className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm font-medium text-slate-700">{segment.carrierCode} {segment.number}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-500">
                                        <Clock className="h-4 w-4" />
                                        <span>{t.details.duration}: {segment.duration}</span>
                                    </div>
                                </div>

                                <div className="relative">
                                     <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-white bg-slate-900 shadow-sm"></div>
                                     <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-900">{format(new Date(segment.arrival.at), 'HH:mm')}</span>
                                        <span className="text-slate-500 text-sm">{format(new Date(segment.arrival.at), 'MMM d, yyyy')}</span>
                                    </div>
                                    <div className="text-slate-900 font-medium">
                                        {segment.arrival.iataCode} <span className="text-slate-400 font-normal">{t.details.airport}</span>
                                    </div>
                                </div>

                                {!isLast && (
                                    <div className="py-4">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium border border-orange-200">
                                            <Clock className="h-3 w-3 mr-1" /> {t.details.layover}
                                        </div>
                                    </div>
                                )}

                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
            
            <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end">
                <button 
                    onClick={() => alert(t.details.comingSoon)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    {t.details.bookNow}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};