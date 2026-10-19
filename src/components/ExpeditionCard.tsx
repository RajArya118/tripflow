import React, { useState } from 'react';
import { ExpeditionListing, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { Star, Clock, Users, ArrowUpRight, Compass } from 'lucide-react';

interface ExpeditionCardProps {
  expedition: ExpeditionListing;
  currency: Currency;
  onSelect: (expedition: ExpeditionListing) => void;
}

export const ExpeditionCard: React.FC<ExpeditionCardProps> = ({
  expedition,
  currency,
  onSelect,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const convertedPrice = Math.round(expedition.priceTotal * currencyInfo.rate);

  return (
    <div
      onClick={() => onSelect(expedition)}
      className="group relative flex flex-col bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Visual Image */}
      <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
        {!imageFailed && expedition.images[0] ? (
          <img
            src={expedition.images[0]}
            alt={expedition.title}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${expedition.gradientTheme} flex flex-col items-center justify-center p-6 text-stone-100 text-center`}>
            <Compass className="w-8 h-8 text-amber-300/80 mb-2" />
            <span className="font-serif text-lg font-semibold tracking-tight">{expedition.title}</span>
            <span className="text-xs text-stone-300 font-light mt-1">{expedition.destination}</span>
          </div>
        )}

        {/* Quiet duration tag */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md rounded">
          {expedition.durationDays} Days / {expedition.durationDays - 1} Nights
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-stone-800">{expedition.destination}</span>
            <span aria-hidden="true">·</span>
            <span>{expedition.country}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-stone-800">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold">{expedition.rating.toFixed(2)}</span>
            <span className="text-stone-400">({expedition.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-1 mb-2">
          {expedition.title}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            Max {expedition.groupSizeMax} travelers
          </span>
          <span aria-hidden="true">·</span>
          <span>{expedition.difficulty} Pace</span>
        </div>

        {/* Short description */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {expedition.description}
        </p>

        {/* Bottom Price Bar */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
              {currencyInfo.symbol}{convertedPrice.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500 font-sans">/ person</span>
            </div>
            <div className="text-[11px] text-stone-400">All-inclusive itinerary & stays</div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-amber-900 group-hover:translate-x-0.5 transition-transform">
            <span>View Journey</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
