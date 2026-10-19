import React from 'react';
import { StayListing, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, Star, Check, ArrowRight, Bed, Bath, Users, ShieldCheck, MapPin } from 'lucide-react';

interface CompareStaysModalProps {
  isOpen: boolean;
  stays: StayListing[];
  currency: Currency;
  onClose: () => void;
  onRemoveStay: (stayId: string) => void;
  onSelectStay: (stay: StayListing) => void;
}

export const CompareStaysModal: React.FC<CompareStaysModalProps> = ({
  isOpen,
  stays,
  currency,
  onClose,
  onRemoveStay,
  onSelectStay,
}) => {
  if (!isOpen || stays.length === 0) return null;

  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  // Aggregate all unique amenities across these stays
  const allAmenities = Array.from(new Set(stays.flatMap((s) => s.amenities))).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Sanctuary Comparison ({stays.length} properties)
            </h2>
            <div className="text-xs text-stone-500">
              Side-by-side architectural and amenity evaluation
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6 flex-1">
          <div
            className="grid gap-6 min-w-[640px]"
            style={{ gridTemplateColumns: `repeat(${stays.length}, minmax(0, 1fr))` }}
          >
            {stays.map((stay) => {
              const convertedPrice = Math.round(stay.pricePerNight * currencyInfo.rate);

              return (
                <div
                  key={stay.id}
                  className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
                    <img
                      src={stay.images[0]}
                      alt={stay.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveStay(stay.id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-800" />
                        <span>{stay.destination}, {stay.country}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1 mt-1">
                        {stay.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 font-mono text-xs text-stone-700">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-bold">{stay.rating.toFixed(2)}</span>
                        <span className="text-stone-400">({stay.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-stone-200">
                      <div className="font-mono text-lg font-bold text-stone-900 tabular-nums">
                        {currencyInfo.symbol}{convertedPrice.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-stone-500 font-sans">/ night</span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-stone-200 text-[11px] text-stone-600 text-center">
                      <div>
                        <div className="font-bold text-stone-900">{stay.bedrooms}</div>
                        <div className="text-[10px] text-stone-400">Bedrooms</div>
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{stay.bathrooms}</div>
                        <div className="text-[10px] text-stone-400">Baths</div>
                      </div>
                      <div>
                        <div className="font-bold text-stone-900">{stay.maxGuests}</div>
                        <div className="text-[10px] text-stone-400">Guests</div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="space-y-1.5 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        Curated Highlights
                      </div>
                      {stay.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="text-stone-600 flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Amenities Checklist */}
                    <div className="space-y-1 pt-2 border-t border-stone-200 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Amenities
                      </div>
                      {allAmenities.map((amenity) => {
                        const hasIt = stay.amenities.includes(amenity);
                        return (
                          <div
                            key={amenity}
                            className={`flex items-center justify-between text-[11px] ${
                              hasIt ? 'text-stone-800' : 'text-stone-300 line-through'
                            }`}
                          >
                            <span>{amenity}</span>
                            {hasIt && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <div className="pt-3 border-t border-stone-200">
                      <button
                        onClick={() => {
                          onSelectStay(stay);
                          onClose();
                        }}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Select Property</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
