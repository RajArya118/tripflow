import React, { useState } from 'react';
import { StayListing, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { Star, Heart, MapPin, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface StayCardProps {
  stay: StayListing;
  currency: Currency;
  isSaved: boolean;
  isCompared?: boolean;
  onToggleSave: (stay: StayListing) => void;
  onToggleCompare?: (stay: StayListing) => void;
  onSelect: (stay: StayListing) => void;
}

export const StayCard: React.FC<StayCardProps> = ({
  stay,
  currency,
  isSaved,
  isCompared = false,
  onToggleSave,
  onToggleCompare,
  onSelect,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const convertedPrice = Math.round(stay.pricePerNight * currencyInfo.rate);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stay.images && stay.images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % stay.images.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stay.images && stay.images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + stay.images.length) % stay.images.length);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300">
      {/* Visual Image Container with Interactive Image Switcher */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imageFailed && stay.images[activeImageIndex] ? (
          <img
            src={stay.images[activeImageIndex]}
            alt={stay.title}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${stay.gradientTheme} flex flex-col items-center justify-center p-6 text-stone-100 text-center`}>
            <MapPin className="w-8 h-8 text-amber-300/80 mb-2" />
            <span className="font-serif text-lg font-semibold tracking-tight">{stay.destination}</span>
            <span className="text-xs text-stone-300 font-light mt-1">{stay.country}</span>
          </div>
        )}

        {/* Image pagination dots */}
        {stay.images && stay.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
              {stay.images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(stay);
          }}
          aria-label={isSaved ? 'Remove from saved' : 'Save to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* Compare Property Button */}
        {onToggleCompare && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(stay);
            }}
            title={isCompared ? 'Remove from comparison' : 'Compare property'}
            className={`absolute top-3 left-3 p-1.5 px-2 rounded-md text-[10px] font-semibold tracking-wide backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1 ${
              isCompared
                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                : 'bg-black/40 hover:bg-black/60 text-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>
        )}

        {/* Quiet Kicker Tag if featured/badge */}
        {stay.badge && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-md rounded">
            {stay.badge}
          </div>
        )}
      </div>

      {/* Card Content with Zero-Pill Unboxed Metadata */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Location and Ratings Header */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-stone-800">{stay.destination}</span>
            <span aria-hidden="true">·</span>
            <span>{stay.region}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-stone-800">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-semibold">{stay.rating.toFixed(2)}</span>
            <span className="text-stone-400">({stay.reviewCount})</span>
          </div>
        </div>

        {/* Card Title */}
        <h3
          onClick={() => onSelect(stay)}
          className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-900 transition-colors cursor-pointer line-clamp-1 mb-1.5"
        >
          {stay.title}
        </h3>

        {/* Unboxed Features Line */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2.5">
          <span>{stay.bedrooms} {stay.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          <span aria-hidden="true">·</span>
          <span>{stay.bathrooms} {stay.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          <span aria-hidden="true">·</span>
          <span>Up to {stay.maxGuests} Guests</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {stay.subtitle}
        </p>

        {/* Price & Primary CTA */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-base font-bold font-mono text-stone-900 tabular-nums">
              {currencyInfo.symbol}{convertedPrice.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500 font-sans">/ night</span>
            </div>
            <div className="text-[11px] text-stone-400">Includes all taxes & fees</div>
          </div>

          <button
            onClick={() => onSelect(stay)}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};
