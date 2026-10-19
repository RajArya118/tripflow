import React from 'react';
import { BookingDetails } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, Printer, ShieldCheck, Calendar, Users, MapPin, Sparkles } from 'lucide-react';

interface BookingVoucherModalProps {
  booking: BookingDetails;
  onClose: () => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({ booking, onClose }) => {
  const currencyInfo = CURRENCY_RATES[booking.currency] || CURRENCY_RATES.USD;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col">
        {/* Top Controls Bar (hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/90 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-serif text-sm font-bold text-stone-900">
              Official Travel Voucher & Pass
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Document Printable Card */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-stone-900">
          {/* Header Ticket Brand */}
          <div className="flex items-start justify-between border-b border-stone-200 pb-6">
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                AuraVoyage
              </div>
              <div className="text-[11px] font-semibold tracking-wider uppercase text-amber-900 mt-0.5">
                Confirmed Reservation Pass
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-stone-500 font-mono">Reference Code</div>
              <div className="font-mono text-base font-bold text-stone-900 tracking-wider">
                {booking.bookingId}
              </div>
              <div className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
                {booking.status}
              </div>
            </div>
          </div>

          {/* Property / Journey Details Banner */}
          <div className="flex flex-col sm:flex-row gap-5 p-4 bg-stone-50 rounded-xl border border-stone-200">
            <img
              src={booking.listingImage}
              alt={booking.listingTitle}
              referrerPolicy="no-referrer"
              className="w-full sm:w-28 h-28 object-cover rounded-lg shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs font-medium text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-900" />
                  <span>{booking.listingLocation}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mt-1">
                  {booking.listingTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-stone-200/80 text-xs text-stone-600 mt-2">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Check-In</div>
                  <div className="font-semibold text-stone-900">{booking.checkInDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Check-Out</div>
                  <div className="font-semibold text-stone-900">{booking.checkOutDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Stay</div>
                  <div className="font-semibold text-stone-900">{booking.nights} Nights · {booking.guests} Guests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest and Verification Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Primary Traveler
              </div>
              <div className="text-sm">
                <div className="font-bold text-stone-900">{booking.primaryGuestName}</div>
                <div className="text-xs text-stone-600">{booking.primaryGuestEmail}</div>
                <div className="text-xs text-stone-600">{booking.primaryGuestPhone}</div>
              </div>

              {booking.specialRequests && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-stone-500 uppercase">Special Notes</div>
                  <div className="text-xs text-stone-600 italic bg-amber-50/60 p-2.5 rounded border border-amber-200/70 mt-1">
                    "{booking.specialRequests}"
                  </div>
                </div>
              )}
            </div>

            {/* QR Code Simulation & Check-in instructions */}
            <div className="flex flex-col items-center justify-center p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
              {/* Scalable vector QR pattern simulation */}
              <div className="w-24 h-24 bg-white p-2 rounded-lg border border-stone-300 shadow-2xs mb-2 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" />
                  
                  <rect x="70" y="0" width="30" height="30" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" />

                  <rect x="0" y="70" width="30" height="30" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" />

                  <rect x="40" y="10" width="15" height="10" />
                  <rect x="45" y="30" width="20" height="15" />
                  <rect x="20" y="45" width="15" height="15" />
                  <rect x="65" y="45" width="25" height="10" />
                  <rect x="40" y="65" width="15" height="25" />
                  <rect x="65" y="65" width="15" height="15" />
                  <rect x="85" y="75" width="10" height="20" />
                </svg>
              </div>
              <div className="font-mono text-[11px] font-bold text-stone-800">
                Scan for Express Check-in
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">
                Present on arrival to your designated host
              </div>
            </div>
          </div>

          {/* Pricing Ledger Breakdown */}
          <div className="border-t border-stone-200 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Base Accommodation ({booking.nights} nights)</span>
              <span className="font-mono">{currencyInfo.symbol}{booking.baseAmount.toLocaleString()}</span>
            </div>
            {booking.cleaningFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Sanitization & Estate Preparation</span>
                <span className="font-mono">{currencyInfo.symbol}{booking.cleaningFee.toLocaleString()}</span>
              </div>
            )}
            {booking.serviceFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Concierge & Guest Support</span>
                <span className="font-mono">{currencyInfo.symbol}{booking.serviceFee.toLocaleString()}</span>
              </div>
            )}
            {booking.addonsAmount > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Selected Add-ons & Experiences</span>
                <span className="font-mono">{currencyInfo.symbol}{booking.addonsAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-200 pt-2 mt-2">
              <span>Total Paid ({booking.currency})</span>
              <span className="font-mono text-base text-amber-950">
                {currencyInfo.symbol}{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-stone-400 text-center border-t border-stone-100 pt-4">
            AuraVoyage Journeys Ltd · 24/7 Global Concierge: +1 (800) 555-0199 · concierge@auravoyage.com
          </div>
        </div>
      </div>
    </div>
  );
};
