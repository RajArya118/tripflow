import React, { useState, useEffect } from 'react';
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
import { MyBookingsModal } from './components/MyBookingsModal';
import { DestinationExplorerModal } from './components/DestinationExplorerModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { CompareStaysModal } from './components/CompareStaysModal';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  CheckCircle,
  Compass,
  Search,
  Scale,
  DollarSign,
} from 'lucide-react';

const SAVED_STAYS_STORAGE_KEY = 'auravoyage_saved_stays';
const BOOKINGS_STORAGE_KEY = 'auravoyage_bookings';

export default function App() {
  const [currency, setCurrency] = useState<Currency>('USD');

  // Wishlist with localStorage initialization
  const [savedStayIds, setSavedStayIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STAYS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['stay-kyoto-ryokan', 'stay-amalfi-cliff-villa'];
    } catch {
      return ['stay-kyoto-ryokan', 'stay-amalfi-cliff-villa'];
    }
  });

  // Confirmed bookings with localStorage initialization
  const [confirmedBookings, setConfirmedBookings] = useState<BookingDetails[]>(() => {
    try {
      const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Stays comparison selection
  const [comparedStayIds, setComparedStayIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals state
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isAtlasModalOpen, setIsAtlasModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Active Category & Filter State
  const [selectedCategory, setSelectedCategory] = useState<CategoryTheme>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceFilterMax, setPriceFilterMax] = useState<number>(2000);

  const [activeSearchFilter, setActiveSearchFilter] = useState<{
    destination?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
  } | null>(null);

  // Active listing detail modal
  const [activeModalItem, setActiveModalItem] = useState<{
    item: StayListing | ExpeditionListing;
    type: 'stay' | 'expedition';
  } | null>(null);

  // Active booking checkout modal
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

  // Sync saved stays to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STAYS_STORAGE_KEY, JSON.stringify(savedStayIds));
    } catch (e) {
      // Ignore in restricted environments
    }
  }, [savedStayIds]);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(confirmedBookings));
    } catch (e) {
      // Ignore in restricted environments
    }
  }, [confirmedBookings]);

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

  // Toggle Stay in Comparison
  const handleToggleCompareStay = (stay: StayListing) => {
    setComparedStayIds((prev) => {
      if (prev.includes(stay.id)) {
        return prev.filter((id) => id !== stay.id);
      }
      if (prev.length >= 3) {
        showToast('You can compare a maximum of 3 sanctuaries simultaneously.');
        return prev;
      }
      showToast(`Added "${stay.title}" to comparison pool.`);
      return [...prev, stay.id];
    });
  };

  // Navigation smoothly to anchor
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle booking confirmed
  const handleBookingSuccess = (newBooking: BookingDetails) => {
    setConfirmedBookings((prev) => [newBooking, ...prev]);
    showToast(`Reservation #${newBooking.bookingId} confirmed! Check your reservations pass.`);
  };

  // Handle booking cancellation
  const handleCancelBooking = (bookingId: string) => {
    setConfirmedBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    showToast(`Reservation #${bookingId} has been successfully cancelled.`);
  };

  // Stays filter logic
  const filteredStays = MOCK_STAYS.filter((stay) => {
    if (selectedCategory !== 'all' && stay.category !== selectedCategory) {
      return false;
    }
    if (stay.pricePerNight > priceFilterMax) {
      return false;
    }
    if (searchKeyword.trim()) {
      const term = searchKeyword.toLowerCase();
      const matchesKeyword =
        stay.title.toLowerCase().includes(term) ||
        stay.destination.toLowerCase().includes(term) ||
        stay.country.toLowerCase().includes(term) ||
        stay.subtitle.toLowerCase().includes(term) ||
        stay.amenities.some((a) => a.toLowerCase().includes(term));
      if (!matchesKeyword) return false;
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
  const comparedStaysList = MOCK_STAYS.filter((s) => comparedStayIds.includes(s.id));

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
        bookingCount={confirmedBookings.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenBookings={() => setIsBookingsModalOpen(true)}
        onOpenAtlas={() => setIsAtlasModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
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
        <section id="stays" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto border-t border-stone-200">
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

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4">
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

          {/* Search & Filter Bar */}
          <div className="p-3 bg-white border border-stone-200 rounded-xl mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search villas, pools, onsen, saunas..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-400"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-500 whitespace-nowrap">Max nightly:</span>
                <span className="font-mono font-bold text-stone-900">
                  ${priceFilterMax}
                </span>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="50"
                  value={priceFilterMax}
                  onChange={(e) => setPriceFilterMax(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-amber-900 cursor-pointer"
                />
              </div>

              {comparedStayIds.length > 0 && (
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare ({comparedStayIds.length})</span>
                </button>
              )}
            </div>
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
                Try expanding your guest count, adjusting the price slider, or explore other iconic regions like Kyoto or Positano.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setActiveSearchFilter(null);
                  setSearchKeyword('');
                  setPriceFilterMax(2000);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-md cursor-pointer"
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
                  isCompared={comparedStayIds.includes(stay.id)}
                  onToggleSave={handleToggleSaveStay}
                  onToggleCompare={handleToggleCompareStay}
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
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
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
          onBookingSuccess={handleBookingSuccess}
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

      {/* My Bookings / Reservations Modal */}
      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        bookings={confirmedBookings}
        currency={currency}
        onClose={() => setIsBookingsModalOpen(false)}
        onCancelBooking={handleCancelBooking}
        onExploreMore={() => handleNavigate('stays')}
      />

      {/* Destination Atlas Explorer Modal */}
      <DestinationExplorerModal
        isOpen={isAtlasModalOpen}
        currency={currency}
        onClose={() => setIsAtlasModalOpen(false)}
        onSelectDestination={(dest) => {
          setActiveSearchFilter({ destination: dest });
          handleNavigate('stays');
        }}
        onPlanDestination={(dest) => {
          setArchitectParams({ destination: dest, days: 5, style: 'Heritage & Zen Living' });
          handleNavigate('architect');
        }}
      />

      {/* Gemini AI Key Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={() => {
          showToast('Gemini AI engine configuration updated!');
        }}
      />

      {/* Compare Stays Modal */}
      <CompareStaysModal
        isOpen={isCompareModalOpen}
        stays={comparedStaysList}
        currency={currency}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveStay={(id) => setComparedStayIds((prev) => prev.filter((sId) => sId !== id))}
        onSelectStay={(stay) => {
          setActiveModalItem({ item: stay, type: 'stay' });
          setIsCompareModalOpen(false);
        }}
      />

      {/* Floating Comparison Bar if items selected */}
      {comparedStayIds.length > 0 && !isCompareModalOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 text-white backdrop-blur-md px-5 py-3 rounded-full shadow-2xl border border-stone-700 flex items-center gap-4 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>
              <strong className="text-amber-400 font-semibold">{comparedStayIds.length}</strong> of 3 Sanctuaries selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-full transition-colors cursor-pointer shadow-xs"
            >
              Compare Now
            </button>
            <button
              onClick={() => setComparedStayIds([])}
              className="p-1 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
