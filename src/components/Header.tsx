import React, { useState } from 'react';
import { Currency } from '../types/travel';
import { Bookmark, Sparkles, Globe2, Ticket, Compass, Settings, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  savedCount: number;
  bookingCount: number;
  onOpenWishlist: () => void;
  onOpenBookings: () => void;
  onOpenAtlas: () => void;
  onOpenApiKeyModal: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenPlanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  savedCount,
  bookingCount,
  onOpenWishlist,
  onOpenBookings,
  onOpenAtlas,
  onOpenApiKeyModal,
  onNavigate,
  onOpenPlanner,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNavClick('hero')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">
            AuraVoyage
          </span>
        </button>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-600">
          <button
            onClick={() => handleNavClick('stays')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Stays & Villas
          </button>
          <button
            onClick={() => handleNavClick('expeditions')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Expeditions
          </button>
          <button
            onClick={() => handleNavClick('flights')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Flight Radar
          </button>
          <button
            onClick={() => handleNavClick('architect')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-stone-900 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Trip Architect</span>
          </button>
          <button
            onClick={onOpenAtlas}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-stone-500" />
            <span>Atlas</span>
          </button>
          <button
            onClick={() => handleNavClick('journal')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Journal
          </button>
        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="relative hidden sm:flex items-center text-xs font-semibold text-stone-700 bg-stone-100 rounded-md px-2 py-1.5 border border-stone-200/80">
            <Globe2 className="w-3.5 h-3.5 mr-1 text-stone-500" />
            <select
              value={currentCurrency}
              aria-label="Currency Selector"
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="bg-transparent text-stone-900 cursor-pointer focus:outline-none pr-1 font-mono text-xs"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          {/* AI Settings Toggle */}
          <button
            onClick={onOpenApiKeyModal}
            title="Configure Gemini AI Concierge"
            aria-label="Configure Gemini AI Concierge"
            className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* My Reservations Button */}
          <button
            onClick={onOpenBookings}
            aria-label="View My Bookings"
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Reservations</span>
            {bookingCount > 0 && (
              <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-100 px-1.5 rounded">
                {bookingCount}
              </span>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Saved Stays and Trips"
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-1.5 rounded">
                {savedCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenPlanner}
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            Plan Journey
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 lg:hidden text-stone-700 hover:bg-stone-100 rounded-md cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3 text-sm font-medium text-stone-700">
            <button
              onClick={() => handleNavClick('stays')}
              className="text-left py-1 hover:text-stone-950"
            >
              Stays & Private Villas
            </button>
            <button
              onClick={() => handleNavClick('expeditions')}
              className="text-left py-1 hover:text-stone-950"
            >
              Curated Expeditions
            </button>
            <button
              onClick={() => handleNavClick('flights')}
              className="text-left py-1 hover:text-stone-950"
            >
              Flight Radar & Fares
            </button>
            <button
              onClick={() => handleNavClick('architect')}
              className="text-left py-1 hover:text-stone-950 flex items-center gap-2 text-amber-950 font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>AI Trip Architect</span>
            </button>
            <button
              onClick={() => {
                onOpenAtlas();
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 hover:text-stone-950 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-stone-500" />
              <span>Global Sanctuaries Atlas</span>
            </button>
            <button
              onClick={() => handleNavClick('journal')}
              className="text-left py-1 hover:text-stone-950"
            >
              Editorial Journal
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Currency:</span>
              <select
                value={currentCurrency}
                aria-label="Currency Selector Mobile"
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-stone-100 border border-stone-200 text-stone-900 rounded px-2 py-1 text-xs font-mono"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <button
              onClick={() => {
                onOpenPlanner();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-md"
            >
              Plan Journey
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
