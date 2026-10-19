import React from 'react';
import { Currency } from '../types/travel';
import { Bookmark, Sparkles, Globe2 } from 'lucide-react';

interface HeaderProps {
  currentCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  savedCount: number;
  onOpenWishlist: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenPlanner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCurrency,
  onCurrencyChange,
  savedCount,
  onOpenWishlist,
  onNavigate,
  onOpenPlanner,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">
            AuraVoyage
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onNavigate('stays')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Stays & Villas
          </button>
          <button
            onClick={() => onNavigate('expeditions')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Expeditions
          </button>
          <button
            onClick={() => onNavigate('flights')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Flight Radar
          </button>
          <button
            onClick={() => onNavigate('architect')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-stone-900 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Trip Architect</span>
          </button>
          <button
            onClick={() => onNavigate('journal')}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Journal
          </button>
        </nav>

        {/* Zone 3: Primary Action & Compact Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="relative flex items-center text-xs font-semibold text-stone-700 bg-stone-100 rounded-md px-2 py-1.5 border border-stone-200/80">
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

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Saved Stays and Trips"
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-1.5 rounded">
                {savedCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenPlanner}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            Plan Journey
          </button>
        </div>
      </div>
    </header>
  );
};
