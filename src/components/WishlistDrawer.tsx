import React from 'react';
import { StayListing, ExpeditionListing, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, Trash2, ArrowRight, BookmarkCheck, Calendar, Sparkles } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  savedStays: StayListing[];
  currency: Currency;
  onClose: () => void;
  onRemoveStay: (stayId: string) => void;
  onSelectStay: (stay: StayListing) => void;
  onBundleTrip: (stays: StayListing[]) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  savedStays,
  currency,
  onClose,
  onRemoveStay,
  onSelectStay,
  onBundleTrip,
}) => {
  if (!isOpen) return null;

  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const totalEstimatedCost = savedStays.reduce((acc, s) => acc + s.pricePerNight * 3, 0); // 3 nights estimate
  const convertedTotal = Math.round(totalEstimatedCost * currencyInfo.rate);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-900" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Saved Sanctuaries ({savedStays.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist drawer"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {savedStays.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <BookmarkCheck className="w-10 h-10 text-stone-300 mx-auto" />
              <div className="font-serif text-base text-stone-700 font-semibold">Your wishlist is empty</div>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our curated stays and click the heart icon on any villa or machiya to curate your bespoke journey.
              </p>
            </div>
          ) : (
            savedStays.map((stay) => {
              const convertedPrice = Math.round(stay.pricePerNight * currencyInfo.rate);

              return (
                <div
                  key={stay.id}
                  className="flex gap-4 p-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-stone-300 transition-colors"
                >
                  <img
                    src={stay.images[0]}
                    alt={stay.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-stone-500 truncate">
                        {stay.destination}, {stay.country}
                      </div>
                      <h4
                        onClick={() => {
                          onSelectStay(stay);
                          onClose();
                        }}
                        className="text-xs font-bold text-stone-900 truncate cursor-pointer hover:text-amber-900 transition-colors"
                      >
                        {stay.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-xs font-bold text-stone-900 tabular-nums">
                        {currencyInfo.symbol}{convertedPrice.toLocaleString()}{' '}
                        <span className="text-[10px] text-stone-500 font-normal">/ night</span>
                      </span>

                      <button
                        onClick={() => onRemoveStay(stay.id)}
                        aria-label="Remove item"
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Bundle Action */}
        {savedStays.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-stone-600">Est. Combined 3-Night Stay:</span>
              <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                {currencyInfo.symbol}{convertedTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                onBundleTrip(savedStays);
                onClose();
              }}
              className="w-full py-3 px-4 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Architect Itinerary From Wishlist</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
