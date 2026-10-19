import React, { useState } from 'react';
import { Currency, StayListing, ExpeditionListing, FlightOffer, BookingDetails, CategoryTheme } from './types/travel';
import { MOCK_STAYS, MOCK_EXPEDITIONS, POPULAR_DESTINATIONS, CURRENCY_RATES } from './data/mockData';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { StayCard } from './components/StayCard';
import { ExpeditionCard } from './components/ExpeditionCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BookingCheckoutModal } from './components/BookingCheckoutModal';
import { TripArchitect } from './components/TripArchitect';
import { FlightSearchSection } from './components/FlightSearchSection';
import { WishlistDrawer } from './components/WishlistDrawer';
import { EditorialSection } from './components/EditorialSection';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, ArrowUpDown, X, CheckCircle, Compass } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [savedStayIds, setSavedStayIds] = useState<string[]>(['stay-kyoto-ryokan', 'stay-amalfi-cliff-villa']);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Active Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<CategoryTheme>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [activeSearchFilter, setActiveSearchFilter] = useState<{
    destination?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
  } | null>(null);

  // Modal States
  const [activeModalItem, setActiveModalItem] = useState<{
    item: StayListing | ExpeditionListing;
    type: 'stay' | 'expedition';
  } | null>(null);

  const [activeBookingPayload, setActiveBookingPayload] = useState<{
    item: any;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalAmount: number;
    baseAmount: number;
    cleaningFee: number;
    serviceFee: number;
    nights: number;
  } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trip Architect initial props passed from Search
  const [architectParams, setArchitectParams] = useState<{
    destination: string;
    days: number;
    style: string;
  }>({
    destination: 'Kyoto',
    days: 3,
    style: 'Heritage & Zen Living',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Toggle Save to Wishlist
  const handleToggleSaveStay = (stay: StayListing) => {
    setSavedStayIds((prev) => {
      const exists = prev.includes(stay.id);
      if (exists) {
        showToast(`Removed "${stay.title}" from saved list.`);
        return prev.filter((id) => id !== stay.id);
      } else {
        showToast(`Saved "${stay.title}" to your private wishlist!`);
        return [...prev, stay.id];
      }
    });
  };

  const handleRemoveSavedStay = (stayId: string) => {
    setSavedStayIds((prev) => prev.filter((id) => id !== stayId));
  };

  // Navigation smoothly to anchor
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Stays filter logic
  const filteredStays = MOCK_STAYS.filter((stay) => {
    if (selectedCategory !== 'all' && stay.category !== selectedCategory) {
      return false;
    }
    if (activeSearchFilter?.destination) {
      const q = activeSearchFilter.destination.toLowerCase();
      const match =
        stay.destination.toLowerCase().includes(q) ||
        stay.country.toLowerCase().includes(q) ||
        stay.region.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (activeSearchFilter?.guests && stay.maxGuests < activeSearchFilter.guests) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  // Expeditions filter logic
  const filteredExpeditions = MOCK_EXPEDITIONS.filter((exp) => {
    if (selectedCategory !== 'all' && exp.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const savedStaysList = MOCK_STAYS.filter((s) => savedStayIds.includes(s.id));

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        savedCount={savedStayIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onNavigate={handleNavigate}
        onOpenPlanner={() => handleNavigate('architect')}
      />

      <main className="flex-1">
        {/* Hero Section & Tabbed Booking Engine */}
        <HeroSearch
          onSearchStays={(params) => {
            setActiveSearchFilter(params);
            setSelectedCategory('all');
            handleNavigate('stays');
            showToast(`Displaying available stays for ${params.destination}`);
          }}
          onSearchExpeditions={(theme) => {
            setSelectedCategory(theme as CategoryTheme);
            handleNavigate('expeditions');
          }}
          onSearchFlights={(origin, dest) => {
            handleNavigate('flights');
            showToast(`Filtering routes between ${origin} and ${dest}`);
          }}
          onLaunchArchitect={(dest, days, style) => {
            setArchitectParams({ destination: dest, days, style });
            handleNavigate('architect');
          }}
        />

        {/* Categories Bar / Segmented Controls */}
        <section id="stays" className="py-8 px-6 max-w-6xl mx-auto border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                Sanctuary Collection
              </div>
              <h2 className="font-serif text-3xl font-semibold text-stone-900">
                Exceptional Stays & Private Villas
              </h2>
            </div>

            {/* Price / Rating Sort */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-300 rounded-md text-xs font-medium px-2.5 py-1.5 text-stone-800 focus:outline-none"
              >
                <option value="featured">Curator's Choice</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Tabs (Conforming to 1.A interactive buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
            {[
              { id: 'all', label: 'All Highlights' },
              { id: 'cultural', label: 'Cultural & Historic' },
              { id: 'coastal', label: 'Coastal & Island' },
              { id: 'alpine', label: 'Alpine Lodges' },
              { id: 'safari', label: 'Wildlife & Safari' },
              { id: 'nordic', label: 'Nordic Aurora' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as CategoryTheme)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-950 hover:bg-stone-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Search Filter Badge */}
          {activeSearchFilter?.destination && (
            <div className="mb-6 flex items-center justify-between p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-900" />
                <span>
                  Showing results filtered for <strong className="font-semibold">{activeSearchFilter.destination}</strong> (Dates: {activeSearchFilter.checkIn} to {activeSearchFilter.checkOut}, {activeSearchFilter.guests} Guests)
                </span>
              </div>
              <button
                onClick={() => setActiveSearchFilter(null)}
                className="text-amber-900 hover:text-amber-950 font-bold flex items-center gap-1 underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filter</span>
              </button>
            </div>
          )}

          {/* Stays Grid */}
          {filteredStays.length === 0 ? (
            <div className="text-center py-16 bg-white border border-stone-200 rounded-xl space-y-3">
              <Compass className="w-8 h-8 text-stone-400 mx-auto" />
              <div className="font-serif text-lg text-stone-800">No properties matched this exact filter</div>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try expanding your guest count or explore other iconic regions like Kyoto or Positano.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveSearchFilter(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredStays.map((stay) => (
                <StayCard
                  key={stay.id}
                  stay={stay}
                  currency={currency}
                  isSaved={savedStayIds.includes(stay.id)}
                  onToggleSave={handleToggleSaveStay}
                  onSelect={(selected) => setActiveModalItem({ item: selected, type: 'stay' })}
                />
              ))}
            </div>
          )}
        </section>

        {/* Curated Expeditions Section */}
        <section id="expeditions" className="py-16 px-6 bg-stone-100/70 border-t border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-900 mb-1">
                  Guided Field Expeditions
                </div>
                <h2 className="font-serif text-3xl font-semibold text-stone-900">
                  Small Cohort & Private Journeys
                </h2>
              </div>
              <p className="text-xs text-stone-600 max-w-md">
                Led by resident master naturalists, art historians, and private skippers with unprecedented behind-the-scenes access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {filteredExpeditions.map((exp) => (
                <ExpeditionCard
                  key={exp.id}
                  expedition={exp}
                  currency={currency}
                  onSelect={(selected) => setActiveModalItem({ item: selected, type: 'expedition' })}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Flight Radar Section */}
        <FlightSearchSection
          currency={currency}
          onBookFlight={(flight) => {
            const currencyInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
            const flightTotal = Math.round(flight.price * currencyInfo.rate);

            setActiveBookingPayload({
              item: {
                id: flight.id,
                title: `${flight.airline} ${flight.flightNumber} (${flight.cabinClass})`,
                destination: flight.destCity,
                country: flight.destCode,
                images: [
                  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
                ],
              },
              checkIn: '2026-11-10',
              checkOut: '2026-11-18',
              guests: 1,
              totalAmount: flightTotal,
              baseAmount: flightTotal,
              cleaningFee: 0,
              serviceFee: 0,
              nights: 8,
            });
          }}
        />

        {/* Bespoke AI Trip Architect Section */}
        <TripArchitect
          initialDestination={architectParams.destination}
          initialDays={architectParams.days}
          initialStyle={architectParams.style}
          onExploreStaysForDest={(dest) => {
            setActiveSearchFilter({ destination: dest });
            handleNavigate('stays');
          }}
        />

        {/* Editorial Journal & Craftsmanship Stories */}
        <EditorialSection />
      </main>

      {/* Footer */}
      <Footer
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        onNavigate={handleNavigate}
      />

      {/* Listing Detail Modal */}
      {activeModalItem && (
        <ListingDetailModal
          item={activeModalItem.item}
          type={activeModalItem.type}
          currency={currency}
          isSaved={savedStayIds.includes(activeModalItem.item.id)}
          onToggleSave={(item) => handleToggleSaveStay(item)}
          onClose={() => setActiveModalItem(null)}
          onStartBooking={(data) => {
            setActiveBookingPayload(data);
            setActiveModalItem(null);
          }}
        />
      )}

      {/* Booking Checkout Modal */}
      {activeBookingPayload && (
        <BookingCheckoutModal
          bookingData={activeBookingPayload}
          currency={currency}
          onClose={() => setActiveBookingPayload(null)}
          onBookingSuccess={(booking) => {
            showToast(`Reservation #${booking.bookingId} confirmed! Check your inbox.`);
          }}
        />
      )}

      {/* Saved / Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        savedStays={savedStaysList}
        currency={currency}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveStay={handleRemoveSavedStay}
        onSelectStay={(stay) => setActiveModalItem({ item: stay, type: 'stay' })}
        onBundleTrip={(stays) => {
          if (stays.length > 0) {
            setArchitectParams({
              destination: stays[0].destination,
              days: 5,
              style: 'Heritage & Zen Living',
            });
            handleNavigate('architect');
            showToast(`Configured Trip Architect around your ${stays[0].destination} saved stays!`);
          }
        }}
      />
    </div>
  );
}
