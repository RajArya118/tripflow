import React, { useState } from 'react';
import { BookingDetails, Currency } from '../types/travel';
import { CURRENCY_RATES } from '../data/mockData';
import { X, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Download, Calendar, ArrowRight, UserCheck } from 'lucide-react';

interface BookingCheckoutModalProps {
  bookingData: {
    item: any;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalAmount: number;
    baseAmount: number;
    cleaningFee: number;
    serviceFee: number;
    nights: number;
  };
  currency: Currency;
  onClose: () => void;
  onBookingSuccess: (booking: BookingDetails) => void;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  bookingData,
  currency,
  onClose,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'confirmed'>('details');

  // Form fields
  const [fullName, setFullName] = useState('Alexander Wright');
  const [email, setEmail] = useState('alex.wright@example.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [specialRequests, setSpecialRequests] = useState('Late check-in anticipated around 7 PM. Dietary note: vegetarian breakfast.');

  // Add-ons
  const [addChauffeur, setAddChauffeur] = useState(true);
  const [addSommelier, setAddSommelier] = useState(false);
  const [addCarbonOffset, setAddCarbonOffset] = useState(true);

  // Payment mock
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('888');

  // Confirmation payload
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const chauffeurCost = addChauffeur ? Math.round(95 * currencyInfo.rate) : 0;
  const sommelierCost = addSommelier ? Math.round(150 * currencyInfo.rate) : 0;
  const carbonOffsetCost = addCarbonOffset ? Math.round(18 * currencyInfo.rate) : 0;
  const finalTotal = bookingData.totalAmount + chauffeurCost + sommelierCost + carbonOffsetCost;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const bookingId = `AV-${Math.floor(10000 + Math.random() * 90000)}-${bookingData.item.destination.substring(0, 3).toUpperCase()}`;

    const newBooking: BookingDetails = {
      bookingId,
      listingId: bookingData.item.id,
      listingTitle: bookingData.item.title,
      listingLocation: `${bookingData.item.destination}, ${bookingData.item.country}`,
      listingImage: bookingData.item.images[0],
      checkInDate: bookingData.checkIn,
      checkOutDate: bookingData.checkOut,
      nights: bookingData.nights,
      guests: bookingData.guests,
      primaryGuestName: fullName,
      primaryGuestEmail: email,
      primaryGuestPhone: phone,
      specialRequests,
      baseAmount: bookingData.baseAmount,
      cleaningFee: bookingData.cleaningFee,
      serviceFee: bookingData.serviceFee,
      addonsAmount: chauffeurCost + sommelierCost + carbonOffsetCost,
      totalAmount: finalTotal,
      currency,
      status: 'Confirmed',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setConfirmedBooking(newBooking);
    onBookingSuccess(newBooking);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col my-auto">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div>
            <span className="font-serif text-lg font-bold text-stone-900">
              {step === 'details' ? 'Complete Your Reservation' : 'Reservation Confirmed'}
            </span>
            <div className="text-xs text-stone-500">
              {bookingData.item.title} · {bookingData.item.destination}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {step === 'details' ? (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Summary Banner */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Dates & Duration
                  </div>
                  <div className="text-sm font-bold text-stone-900">
                    {bookingData.checkIn} to {bookingData.checkOut} ({bookingData.nights} nights, {bookingData.guests} guests)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Total
                  </div>
                  <div className="font-mono text-lg font-bold text-amber-950 tabular-nums">
                    {currencyInfo.symbol}{finalTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-900" />
                  <span>Primary Traveler Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Email for Confirmation
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Phone (with country code)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Special Requests / Dietary Notes
                    </label>
                    <input
                      type="text"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Late check-in, feather pillows"
                      className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-900"
                    />
                  </div>
                </div>
              </div>

              {/* Bespoke Add-ons */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-900" />
                  <span>Bespoke Concierge Add-ons</span>
                </h3>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addChauffeur}
                        onChange={(e) => setAddChauffeur(e.target.checked)}
                        className="w-4 h-4 text-amber-900 rounded focus:ring-amber-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Private Airport Chauffeur & Baggage Porter</div>
                        <div className="text-[11px] text-stone-500">VIP greeting at arrival terminal with luxury vehicle transfer</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-stone-800 tabular-nums">
                      +{currencyInfo.symbol}{Math.round(95 * currencyInfo.rate)}
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addSommelier}
                        onChange={(e) => setAddSommelier(e.target.checked)}
                        className="w-4 h-4 text-amber-900 rounded focus:ring-amber-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Sommelier Cellar Welcome Experience</div>
                        <div className="text-[11px] text-stone-500">Hand-selected rare vintage bottle and artisanal pairings upon arrival</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-stone-800 tabular-nums">
                      +{currencyInfo.symbol}{Math.round(150 * currencyInfo.rate)}
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-3 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={addCarbonOffset}
                        onChange={(e) => setAddCarbonOffset(e.target.checked)}
                        className="w-4 h-4 text-amber-900 rounded focus:ring-amber-900"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900">Certified Gold Standard Carbon Offset</div>
                        <div className="text-[11px] text-stone-500">Neutralizes estimated flight and lodging carbon emissions</div>
                      </div>
                    </div>
                    <div className="font-mono text-xs font-bold text-stone-800 tabular-nums">
                      +{currencyInfo.symbol}{Math.round(18 * currencyInfo.rate)}
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-900" />
                  <span>Payment Method (Test Simulation)</span>
                </h3>
                <div className="p-4 border border-stone-200 rounded-lg bg-stone-50/50 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                    <span>Credit / Debit Card</span>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      SSL 256-bit Encrypted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded bg-white font-mono text-xs text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-2 py-2 border border-stone-300 rounded bg-white font-mono text-xs text-stone-900 text-center focus:outline-none"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-2 py-2 border border-stone-300 rounded bg-white font-mono text-xs text-stone-900 text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Authorize & Confirm Reservation ({currencyInfo.symbol}{finalTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] text-stone-400 text-center mt-2">
                  Complimentary free cancellation up to 7 days before travel date
                </div>
              </div>
            </form>
          ) : (
            /* Confirmation View */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-900 block mb-1 font-mono">
                  Booking Reference: {confirmedBooking?.bookingId}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  You are all set for {confirmedBooking?.listingLocation}!
                </h3>
                <p className="text-stone-600 text-xs mt-1">
                  A comprehensive itinerary and voucher have been dispatched to {confirmedBooking?.primaryGuestEmail}.
                </p>
              </div>

              {/* Travel Card Pass */}
              <div className="bg-stone-50 border border-stone-300 rounded-2xl p-6 text-left max-w-md mx-auto shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                  <div>
                    <div className="font-serif font-bold text-stone-900">AuraVoyage Digital Pass</div>
                    <div className="text-[11px] text-stone-500 font-mono">Status: Confirmed & Paid</div>
                  </div>
                  {/* Decorative QR code mockup */}
                  <div className="w-12 h-12 bg-white border border-stone-300 p-1 rounded flex items-center justify-center">
                    <div className="w-full h-full bg-stone-900 flex items-center justify-center text-[8px] font-mono text-white text-center leading-none">
                      QR PASS
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-stone-700 mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Property:</span>
                    <span className="font-medium text-stone-900">{confirmedBooking?.listingTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Check-in:</span>
                    <span className="font-mono text-stone-900">{confirmedBooking?.checkInDate} (From 3:00 PM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Check-out:</span>
                    <span className="font-mono text-stone-900">{confirmedBooking?.checkOutDate} (Until 11:00 AM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Traveler:</span>
                    <span className="font-medium text-stone-900">{confirmedBooking?.primaryGuestName}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 font-bold">
                    <span>Total Paid:</span>
                    <span className="font-mono text-amber-950 tabular-nums">
                      {currencyInfo.symbol}{confirmedBooking?.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => alert(`Digital Pass ${confirmedBooking?.bookingId} saved to your device.`)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-stone-300 hover:bg-stone-100 rounded text-xs font-semibold text-stone-800 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Pass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert(`Calendar invite exported for ${confirmedBooking?.checkInDate} to ${confirmedBooking?.checkOutDate}.`)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-stone-900 hover:bg-stone-800 rounded text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Add to Cal</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Return to Exploration
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
