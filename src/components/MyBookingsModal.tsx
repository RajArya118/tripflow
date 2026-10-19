import React, { useState } from 'react';
import { BookingDetails, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, Calendar, MapPin, Ticket, Trash2, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { BookingVoucherModal } from './BookingVoucherModal';

interface MyBookingsModalProps {
  isOpen: boolean;
  bookings: BookingDetails[];
  currency: Currency;
  onClose: () => void;
  onCancelBooking: (bookingId: string) => void;
  onExploreMore: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  bookings,
  currency,
  onClose,
  onCancelBooking,
  onExploreMore,
}) => {
  const [activeVoucherBooking, setActiveVoucherBooking] = useState<BookingDetails | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-900" />
              <div>
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  My Reservations ({bookings.length})
                </h2>
                <div className="text-xs text-stone-500">
                  Verified itineraries and confirmed estate passes
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookings List */}
          <div className="overflow-y-auto p-6 space-y-4 flex-1">
            {bookings.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Compass className="w-12 h-12 text-stone-300 mx-auto" />
                <div className="font-serif text-lg text-stone-800 font-semibold">
                  No Confirmed Reservations Yet
                </div>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Ready to embark on an unforgettable journey? Explore our handpicked private villas, boutique expeditions, and flight connections.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreMore();
                  }}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Explore Sanctuaries
                </button>
              </div>
            ) : (
              bookings.map((booking) => {
                const currencyInfo = CURRENCY_RATES[booking.currency] || CURRENCY_RATES.USD;

                return (
                  <div
                    key={booking.bookingId}
                    className="p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-xl hover:border-stone-300 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={booking.listingImage}
                        alt={booking.listingTitle}
                        referrerPolicy="no-referrer"
                        className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                            {booking.bookingId}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                            {booking.status}
                          </span>
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1">
                          {booking.listingTitle}
                        </h4>
                        <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{booking.listingLocation}</span>
                          <span aria-hidden="true">·</span>
                          <span>{booking.checkInDate} to {booking.checkOutDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200">
                      <div className="text-left sm:text-right">
                        <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                          {currencyInfo.symbol}{booking.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {booking.nights} nights · {booking.guests} guests
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setActiveVoucherBooking(booking)}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Pass</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel reservation ${booking.bookingId}?`)) {
                              onCancelBooking(booking.bookingId);
                            }
                          }}
                          title="Cancel reservation"
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {activeVoucherBooking && (
        <BookingVoucherModal
          booking={activeVoucherBooking}
          onClose={() => setActiveVoucherBooking(null)}
        />
      )}
    </>
  );
};
