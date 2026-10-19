import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Compass, Plane, Sparkles, ChevronDown } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/mockData';

interface HeroSearchProps {
  onSearchStays: (params: { destination: string; guests: number; checkIn: string; checkOut: string }) => void;
  onSearchExpeditions: (theme: string) => void;
  onSearchFlights: (origin: string, dest: string) => void;
  onLaunchArchitect: (destination: string, days: number, style: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearchStays,
  onSearchExpeditions,
  onSearchFlights,
  onLaunchArchitect,
}) => {
  const [activeTab, setActiveTab] = useState<'stays' | 'expeditions' | 'flights' | 'architect'>('stays');

  // Stays form state
  const [destination, setDestination] = useState('Kyoto');
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [checkIn, setCheckIn] = useState('2026-11-10');
  const [checkOut, setCheckOut] = useState('2026-11-16');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);

  // Expeditions form state
  const [expeditionTheme, setExpeditionTheme] = useState('all');

  // Flight form state
  const [flightOrigin, setFlightOrigin] = useState('JFK');
  const [flightDest, setFlightDest] = useState('KIX');

  // Architect state
  const [architectDest, setArchitectDest] = useState('Kyoto');
  const [architectDays, setArchitectDays] = useState(3);
  const [architectStyle, setArchitectStyle] = useState('Heritage & Zen Living');

  const handleStaysSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchStays({
      destination,
      guests: adults + children,
      checkIn,
      checkOut,
    });
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 px-6 overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.08), rgba(245, 245, 244, 0.6) 50%, rgba(250, 249, 246, 1) 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto text-center">
        {/* Subtle unboxed metadata kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-900/80 mb-3">
          <span>Curated Global Sanctuaries</span>
          <span aria-hidden="true">·</span>
          <span>Boutique Expeditions</span>
          <span aria-hidden="true">·</span>
          <span>Bespoke Itineraries</span>
        </div>

        {/* Refined Display Headline */}
        <h1
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-[1.15] mb-5 mx-auto max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          Journeys crafted for the discerning mind.
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Handpicked private villas, historic machiyas, and tailor-made expeditions across 42 evocative landscapes.
        </p>

        {/* Search Engine Hub Card */}
        <div className="bg-white rounded-xl shadow-lg border border-stone-200/90 max-w-4xl mx-auto overflow-visible text-left">
          {/* Functional Mode Switcher Tabs */}
          <div className="flex border-b border-stone-200 px-4 pt-3 bg-stone-50/70 rounded-t-xl gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('stays')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'stays'
                  ? 'bg-white text-stone-950 border-t-2 border-amber-800 -mb-[1px] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-800" />
              <span>Stays & Villas</span>
            </button>

            <button
              onClick={() => setActiveTab('expeditions')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'expeditions'
                  ? 'bg-white text-stone-950 border-t-2 border-amber-800 -mb-[1px] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Search className="w-4 h-4 text-stone-700" />
              <span>Curated Expeditions</span>
            </button>

            <button
              onClick={() => setActiveTab('flights')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'flights'
                  ? 'bg-white text-stone-950 border-t-2 border-amber-800 -mb-[1px] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Plane className="w-4 h-4 text-stone-700" />
              <span>Flight Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('architect')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'architect'
                  ? 'bg-white text-stone-950 border-t-2 border-amber-800 -mb-[1px] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Trip Architect</span>
            </button>
          </div>

          {/* Tab 1: Stays Search Engine */}
          {activeTab === 'stays' && (
            <form onSubmit={handleStaysSubmit} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Destination Column */}
              <div className="md:col-span-4 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <div
                    onClick={() => setShowDestDropdown(!showDestDropdown)}
                    className="flex items-center gap-2 px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 hover:bg-stone-50 cursor-pointer text-sm font-medium text-stone-900"
                  >
                    <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                    <span className="truncate">{destination}</span>
                    <ChevronDown className="w-3.5 h-3.5 ml-auto text-stone-400" />
                  </div>

                  {showDestDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-stone-200 rounded-lg shadow-xl z-30 py-2">
                      <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Featured Regions
                      </div>
                      {POPULAR_DESTINATIONS.map((d) => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() => {
                            setDestination(d.name);
                            setShowDestDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-stone-100 flex items-center justify-between text-stone-800"
                        >
                          <span>{d.name}, {d.country}</span>
                          <span className="text-[10px] text-stone-500 font-mono">{d.airport}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Check-In / Check-Out */}
              <div className="md:col-span-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-2.5 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-2.5 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                    />
                  </div>
                </div>
              </div>

              {/* Guests Selector */}
              <div className="md:col-span-2 relative">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Travelers
                </label>
                <button
                  type="button"
                  onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 hover:bg-stone-50 text-xs font-medium text-stone-900 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Users className="w-3.5 h-3.5 text-stone-600" />
                    <span>{adults + children} Guests</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {showGuestsDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-stone-200 rounded-lg shadow-xl z-30 p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-semibold text-stone-900">Adults</div>
                        <div className="text-[10px] text-stone-500">Ages 13+</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs w-4 text-center">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-stone-900">Children</div>
                        <div className="text-[10px] text-stone-500">Ages 0–12</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs w-4 text-center">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(children + 1)}
                          className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-transparent mb-1 select-none">
                  Action
                </label>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Expeditions Search */}
          {activeTab === 'expeditions' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Expedition Theme
                </label>
                <select
                  value={expeditionTheme}
                  onChange={(e) => setExpeditionTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-medium text-stone-900"
                >
                  <option value="all">All Disciplines & Themes</option>
                  <option value="cultural">Cultural & Zen Heritage</option>
                  <option value="coastal">Coastal & Private Yachting</option>
                  <option value="safari">Wildlife & African Safari</option>
                  <option value="alpine">Alpine High Altitudes</option>
                  <option value="nordic">Nordic & Arctic Glaciers</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Group Style
                </label>
                <div className="text-xs text-stone-700 bg-stone-50 border border-stone-200 rounded-md px-3 py-2">
                  Private & Small Cohorts (Max 8 travelers)
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-transparent mb-1 select-none">
                  Action
                </label>
                <button
                  type="button"
                  onClick={() => onSearchExpeditions(expeditionTheme)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View Expeditions</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Flight Radar Search */}
          {activeTab === 'flights' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Origin Hub
                </label>
                <select
                  value={flightOrigin}
                  onChange={(e) => setFlightOrigin(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-mono text-stone-900"
                >
                  <option value="JFK">JFK · New York John F. Kennedy</option>
                  <option value="EWR">EWR · Newark Liberty Intl</option>
                  <option value="LHR">LHR · London Heathrow</option>
                  <option value="BOS">BOS · Boston Logan Intl</option>
                  <option value="SFO">SFO · San Francisco Intl</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Destination Airport
                </label>
                <select
                  value={flightDest}
                  onChange={(e) => setFlightDest(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-mono text-stone-900"
                >
                  <option value="KIX">KIX · Kansai / Kyoto, Japan</option>
                  <option value="NAP">NAP · Naples / Amalfi, Italy</option>
                  <option value="ZRH">ZRH · Zurich / Zermatt, Switzerland</option>
                  <option value="JRO">JRO · Kilimanjaro / Serengeti</option>
                  <option value="KEF">KEF · Reykjavik Keflavik, Iceland</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-transparent mb-1 select-none">
                  Action
                </label>
                <button
                  type="button"
                  onClick={() => onSearchFlights(flightOrigin, flightDest)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Scan Live Routes</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Trip Architect Quick Start */}
          {activeTab === 'architect' && (
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Dream Destination
                </label>
                <input
                  type="text"
                  value={architectDest}
                  onChange={(e) => setArchitectDest(e.target.value)}
                  placeholder="e.g. Kyoto, Amalfi, Iceland..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Duration
                </label>
                <select
                  value={architectDays}
                  onChange={(e) => setArchitectDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-medium text-stone-900"
                >
                  <option value={3}>3 Days (Long Weekend)</option>
                  <option value={5}>5 Days (Immersive)</option>
                  <option value={7}>7 Days (Grand Tour)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Pace & Style
                </label>
                <select
                  value={architectStyle}
                  onChange={(e) => setArchitectStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md bg-stone-50/50 text-xs font-medium text-stone-900"
                >
                  <option value="Heritage & Zen Living">Heritage & Zen Living</option>
                  <option value="Epicurean & Wine Trail">Epicurean & Wine Trail</option>
                  <option value="High Alpine Adventure">High Alpine Adventure</option>
                  <option value="Coastal Relaxation">Coastal Relaxation</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-transparent mb-1 select-none">
                  Action
                </label>
                <button
                  type="button"
                  onClick={() => onLaunchArchitect(architectDest, architectDays, architectStyle)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-md transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Architect</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills underneath */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs text-stone-600">
          <span className="font-medium text-stone-400">Popular right now:</span>
          {['Kyoto Machiyas', 'Positano Cliff Villas', 'Zermatt Chalets', 'Oia Cave Suites'].map((item) => (
            <button
              key={item}
              onClick={() => {
                const dest = item.split(' ')[0];
                setDestination(dest);
                onSearchStays({ destination: dest, guests: 2, checkIn: '2026-11-10', checkOut: '2026-11-16' });
              }}
              className="text-stone-700 hover:text-amber-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-800 transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
