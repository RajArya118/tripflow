import React, { useState } from 'react';
import { StayListing, ExpeditionListing, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, Star, MapPin, Check, ShieldCheck, Heart, Users, Bed, Bath, Sparkles, Calendar } from 'lucide-react';

interface ListingDetailModalProps {
  item: StayListing | ExpeditionListing | null;
  type: 'stay' | 'expedition';
  currency: Currency;
  isSaved: boolean;
  onToggleSave: (item: any) => void;
  onClose: () => void;
  onStartBooking: (bookingData: {
    item: StayListing | ExpeditionListing;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalAmount: number;
    baseAmount: number;
    cleaningFee: number;
    serviceFee: number;
    nights: number;
  }) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  item,
  type,
  currency,
  isSaved,
  onToggleSave,
  onClose,
  onStartBooking,
}) => {
  if (!item) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('2026-11-12');
  const [checkOut, setCheckOut] = useState('2026-11-16');
  const [guests, setGuests] = useState(2);

  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  // Nights calculation
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const diffTime = Math.max(1, d2.getTime() - d1.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const isStay = type === 'stay';
  const stay = isStay ? (item as StayListing) : null;
  const exp = !isStay ? (item as ExpeditionListing) : null;

  // Price calculations
  const pricePerUnit = isStay ? stay!.pricePerNight : exp!.priceTotal;
  const convertedUnit = Math.round(pricePerUnit * currencyInfo.rate);

  const baseTotal = isStay ? convertedUnit * nights : convertedUnit * guests;
  const cleaningFee = isStay ? Math.round(stay!.cleaningFee * currencyInfo.rate) : 0;
  const serviceFee = isStay ? Math.round(baseTotal * (stay!.serviceFeePercent || 0.12)) : Math.round(baseTotal * 0.08);
  const grandTotal = baseTotal + cleaningFee + serviceFee;

  const handleProceed = () => {
    onStartBooking({
      item,
      checkIn,
      checkOut,
      guests,
      totalAmount: grandTotal,
      baseAmount: baseTotal,
      cleaningFee,
      serviceFee,
      nights: isStay ? nights : exp!.durationDays,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Top Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-900">{item.destination}</span>
            <span aria-hidden="true">·</span>
            <span>{item.country}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-stone-700 flex items-center gap-1 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 inline" />
              {item.rating.toFixed(2)} ({item.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(item)}
              aria-label="Wishlist toggle"
              className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              <Heart
                className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`}
              />
            </button>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-8">
          {/* Header Title */}
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight mb-2">
              {item.title}
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
              {isStay ? stay?.subtitle : exp?.description}
            </p>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl overflow-hidden">
            <div className="md:col-span-2 aspect-16/10 bg-stone-100 relative overflow-hidden rounded-lg">
              <img
                src={item.images[activeImageIndex] || item.images[0]}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex md:flex-col gap-3">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`flex-1 relative aspect-16/10 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImageIndex === idx ? 'border-amber-900 ring-2 ring-amber-900/20' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Detail & Booking Module Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Key Specs Row */}
              {isStay && stay && (
                <div className="flex flex-wrap items-center gap-6 py-4 border-y border-stone-200 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-900" />
                    <span>Up to {stay.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-amber-900" />
                    <span>{stay.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-amber-900" />
                    <span>{stay.bathrooms} private baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-900" />
                    <span>Verified Sanctuary</span>
                  </div>
                </div>
              )}

              {/* Host / Guide Profile */}
              {isStay && stay && (
                <div className="flex items-center gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <img
                    src={stay.host.avatar}
                    alt={stay.host.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <div className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      <span>Hosted by {stay.host.name}</span>
                      {stay.host.superhost && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                          Superhost
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500">
                      {stay.host.role} · Response rate: {stay.host.responseRate}
                    </div>
                  </div>
                </div>
              )}

              {/* Comprehensive Description */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">The Experience</h3>
                <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                  {isStay ? stay?.description : exp?.description}
                </p>
              </div>

              {/* Highlights */}
              {isStay && stay && stay.highlights && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">Sanctuary Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {stay.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                        <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-day Summary if Expedition */}
              {!isStay && exp && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">Daily Itinerary Outline</h3>
                  <div className="space-y-3">
                    {exp.itinerarySummary.map((s) => (
                      <div key={s.day} className="p-3.5 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 font-mono">
                          Day 0{s.day} · {s.title}
                        </div>
                        <div className="text-xs text-stone-600 leading-relaxed">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {isStay && stay && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">Curated Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {stay.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-stone-50 rounded border border-stone-200 text-xs text-stone-700 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancellation Policy */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-900 block mb-1">Peace of Mind Guarantee</span>
                {isStay ? stay?.cancellationPolicy : 'Free cancellation up to 14 days before expedition departure.'}
              </div>
            </div>

            {/* Right Contiguous Sticky Reservation Module (5 cols) */}
            <div className="lg:col-span-5 sticky top-4">
              <div className="p-6 bg-white border border-stone-200 rounded-xl shadow-lg space-y-5">
                {/* Price Display */}
                <div className="flex items-baseline justify-between border-b border-stone-200 pb-4">
                  <div>
                    <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
                      {currencyInfo.symbol}{convertedUnit.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-500 font-sans ml-1">
                      {isStay ? '/ night' : '/ traveler'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-stone-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{item.rating.toFixed(2)}</span>
                  </div>
                </div>

                {/* Date & Guest Inputs */}
                <div className="border border-stone-200 rounded-lg overflow-hidden text-xs">
                  <div className="grid grid-cols-2 border-b border-stone-200 divide-x divide-stone-200 bg-stone-50/50">
                    <div className="p-2.5">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                        {isStay ? 'Check-in' : 'Start Date'}
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent font-mono text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="p-2.5">
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                        {isStay ? 'Check-out' : 'End Date'}
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent font-mono text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-stone-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                        Travelers
                      </div>
                      <div className="font-medium text-stone-900">{guests} Guests</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center font-bold hover:bg-stone-100"
                      >
                        -
                      </button>
                      <span className="font-mono text-xs w-4 text-center">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests(guests + 1)}
                        className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center font-bold hover:bg-stone-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Cost Breakdown */}
                <div className="space-y-2 text-xs text-stone-600 border-b border-stone-200 pb-4">
                  <div className="flex justify-between">
                    <span>
                      {currencyInfo.symbol}{convertedUnit.toLocaleString()} × {isStay ? `${nights} nights` : `${guests} travelers`}
                    </span>
                    <span className="font-mono tabular-nums text-stone-900 font-medium">
                      {currencyInfo.symbol}{baseTotal.toLocaleString()}
                    </span>
                  </div>

                  {cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span>Restoration & Cleaning</span>
                      <span className="font-mono tabular-nums text-stone-900 font-medium">
                        {currencyInfo.symbol}{cleaningFee.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Aura Concierge & Insurance</span>
                    <span className="font-mono tabular-nums text-stone-900 font-medium">
                      {currencyInfo.symbol}{serviceFee.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm font-bold text-stone-900">Total Before Taxes</span>
                  <span className="font-mono text-xl font-bold text-amber-950 tabular-nums">
                    {currencyInfo.symbol}{grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Proceed Button */}
                <button
                  onClick={handleProceed}
                  className="w-full py-3 px-4 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Proceed to Reserve</span>
                </button>

                <p className="text-[11px] text-center text-stone-400">
                  Instant confirmation · No immediate card charge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
