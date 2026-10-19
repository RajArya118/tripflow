import React, { useState } from 'react';
import { FlightOffer, Currency } from '../types/travel';
import { MOCK_FLIGHTS, CURRENCY_RATES } from '../data/mockData';
import { Plane, ArrowRight, ShieldCheck, Check, Clock, Leaf } from 'lucide-react';

interface FlightSearchSectionProps {
  currency: Currency;
  onBookFlight: (flight: FlightOffer) => void;
}

export const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({
  currency,
  onBookFlight,
}) => {
  const [cabinFilter, setCabinFilter] = useState<'All' | 'Economy' | 'Premium' | 'Business'>('All');
  const [nonStopOnly, setNonStopOnly] = useState(false);
  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  const filteredFlights = MOCK_FLIGHTS.filter((flight) => {
    if (cabinFilter !== 'All' && flight.cabinClass !== cabinFilter) return false;
    if (nonStopOnly && flight.stops > 0) return false;
    return true;
  });

  return (
    <section id="flights" className="py-16 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-2">
            Global Aviation Radar
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-stone-900">
            Curated Long-Haul Routes & Fares
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-xl">
            Direct airline integrations with verified modern fleets, lie-flat business suites, and carbon footprint benchmarking.
          </p>
        </div>

        {/* Filter Controls (interactive segmented buttons conforming to 1.A) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg border border-stone-200">
            {(['All', 'Economy', 'Premium', 'Business'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCabinFilter(c)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  cabinFilter === c
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-stone-700 px-3 py-2 bg-stone-100 rounded-lg border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={nonStopOnly}
              onChange={(e) => setNonStopOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-amber-900 rounded"
            />
            <span>Non-stop only</span>
          </label>
        </div>
      </div>

      {/* Flight Cards List */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => {
          const convertedPrice = Math.round(flight.price * currencyInfo.rate);

          return (
            <div
              key={flight.id}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-800/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Airline & Aircraft details */}
              <div className="flex items-center gap-4 min-w-[220px]">
                <div className="w-12 h-12 bg-stone-900 text-amber-300 font-serif font-bold text-xs rounded-lg flex items-center justify-center shrink-0">
                  {flight.airlineLogo}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">{flight.airline}</div>
                  <div className="text-xs text-stone-500 font-mono">
                    {flight.flightNumber} · {flight.aircraft}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 mt-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>{flight.co2Kg} kg CO₂ / seat</span>
                  </div>
                </div>
              </div>

              {/* Flight Timeline & Schedule */}
              <div className="flex-1 grid grid-cols-3 items-center text-center gap-2 max-w-lg">
                <div className="text-left">
                  <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    {flight.departureTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">{flight.originCode}</div>
                  <div className="text-[11px] text-stone-500 truncate">{flight.originCity}</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-[11px] font-mono text-stone-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    {flight.duration}
                  </div>
                  <div className="relative w-full flex items-center justify-center">
                    <div className="h-[1px] w-full bg-stone-300" />
                    <Plane className="w-3.5 h-3.5 text-stone-700 absolute rotate-90" />
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    {flight.stops === 0 ? 'Direct Non-stop' : `${flight.stops} Stopover`}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    {flight.arrivalTime}
                  </div>
                  <div className="text-xs font-bold text-stone-700">{flight.destCode}</div>
                  <div className="text-[11px] text-stone-500 truncate">{flight.destCity}</div>
                </div>
              </div>

              {/* Price & Book Action */}
              <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                    {currencyInfo.symbol}{convertedPrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-stone-500">{flight.cabinClass} Class · Roundtrip</div>
                </div>

                <button
                  type="button"
                  onClick={() => onBookFlight(flight)}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                >
                  Select Flight
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
