import React, { useState, useEffect } from 'react';
import { TripPlan, ItineraryDay } from '../types/travel';
import { generateBespokeItinerary } from '../services/aiTripPlanner';
import { Sparkles, Compass, CheckCircle, Clock, Utensils, Lightbulb, Backpack, Plus, RefreshCw, Printer, Download } from 'lucide-react';

interface TripArchitectProps {
  initialDestination?: string;
  initialDays?: number;
  initialStyle?: string;
  onExploreStaysForDest: (dest: string) => void;
}

export const TripArchitect: React.FC<TripArchitectProps> = ({
  initialDestination = 'Kyoto',
  initialDays = 3,
  initialStyle = 'Heritage & Zen Living',
  onExploreStaysForDest,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [daysCount, setDaysCount] = useState(initialDays);
  const [style, setStyle] = useState(initialStyle);
  const [budget, setBudget] = useState<'Comfort' | 'Boutique Luxury' | 'Ultra Luxury'>('Boutique Luxury');
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Completed items toggle tracking
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Custom added notes/activities
  const [newActivityText, setNewActivityText] = useState('');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (initialDestination) setDestination(initialDestination);
    if (initialDays) setDaysCount(initialDays);
    if (initialStyle) setStyle(initialStyle);
  }, [initialDestination, initialDays, initialStyle]);

  // Generate on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generateBespokeItinerary(destination, daysCount, style, budget);
      setTripPlan(plan);
      setActiveDayIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (key: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim() || !tripPlan) return;

    const updated = { ...tripPlan };
    const currentDay = updated.days[activeDayIndex];
    if (currentDay) {
      currentDay.evening = {
        activity: newActivityText,
        location: `${destination} Custom Note`,
        notes: 'Personal customized itinerary item',
      };
      setTripPlan(updated);
    }
    setNewActivityText('');
    setShowAddActivityModal(false);
  };

  return (
    <section id="architect" className="py-16 px-6 bg-stone-900 text-stone-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Trip Architect & Daily Planner</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Bespoke Day-by-Day Curations
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl">
              Architect an hour-by-hour tailored journey customized to your travel rhythm, culinary affinities, and preferred pacing.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onExploreStaysForDest(destination)}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer"
            >
              Browse Stays in {destination}
            </button>
          </div>
        </div>

        {/* Generator Controls Bar */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-5 mb-10 shadow-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Amalfi, Iceland..."
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Days
              </label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value={3}>3 Days (Long Weekend)</option>
                <option value={5}>5 Days (Immersive)</option>
                <option value={7}>7 Days (Full Grand Tour)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Pace & Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Heritage & Zen Living">Heritage & Zen Living</option>
                <option value="Epicurean & Wine Trail">Epicurean & Wine Trail</option>
                <option value="High Alpine Adventure">High Alpine Adventure</option>
                <option value="Coastal Relaxation">Coastal Relaxation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Budget Tier
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-md text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Boutique Luxury">Boutique Luxury</option>
                <option value="Comfort">Curated Comfort</option>
                <option value="Ultra Luxury">Ultra Luxury / Private</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-700 disabled:opacity-50 rounded-md transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Curating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Itinerary Display */}
        {loading ? (
          <div className="text-center py-20 bg-stone-800/40 border border-stone-800 rounded-xl">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-4" />
            <div className="font-serif text-lg text-stone-200">Architecting your bespoke {destination} itinerary...</div>
            <div className="text-xs text-stone-500 mt-1">Cross-referencing seasonal timing, regional artisans, and culinary reservations</div>
          </div>
        ) : tripPlan ? (
          <div className="space-y-8">
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800">
              {tripPlan.days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeDayIndex === idx
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  Day 0{day.dayNumber}: {day.theme.substring(0, 20)}...
                </button>
              ))}
            </div>

            {/* Active Day Detail Card */}
            {tripPlan.days[activeDayIndex] && (
              <div className="bg-stone-800 border border-stone-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700/80 pb-4">
                  <div>
                    <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                      Day 0{tripPlan.days[activeDayIndex].dayNumber} · {tripPlan.days[activeDayIndex].theme}
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1">
                      {tripPlan.days[activeDayIndex].title}
                    </h3>
                  </div>

                  <button
                    onClick={() => setShowAddActivityModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-md transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Note</span>
                  </button>
                </div>

                {/* Morning, Afternoon, Evening Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Morning */}
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Morning (08:30 – 12:00)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-m`)}
                          className="text-stone-400 hover:text-amber-400"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-m`] ? 'text-emerald-400 fill-emerald-950' : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                        {tripPlan.days[activeDayIndex].morning.activity}
                      </h4>
                      <div className="text-xs text-stone-400 mb-3">
                        Location: {tripPlan.days[activeDayIndex].morning.location}
                      </div>
                    </div>
                    <div className="p-2.5 bg-stone-800/70 rounded text-[11px] text-stone-300 font-light italic">
                      Tip: {tripPlan.days[activeDayIndex].morning.notes}
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Afternoon (13:30 – 17:00)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-a`)}
                          className="text-stone-400 hover:text-amber-400"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-a`] ? 'text-emerald-400 fill-emerald-950' : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                        {tripPlan.days[activeDayIndex].afternoon.activity}
                      </h4>
                      <div className="text-xs text-stone-400 mb-3">
                        Location: {tripPlan.days[activeDayIndex].afternoon.location}
                      </div>
                    </div>
                    <div className="p-2.5 bg-stone-800/70 rounded text-[11px] text-stone-300 font-light italic">
                      Tip: {tripPlan.days[activeDayIndex].afternoon.notes}
                    </div>
                  </div>

                  {/* Evening */}
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Evening (18:30 – 22:00)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-e`)}
                          className="text-stone-400 hover:text-amber-400"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-e`] ? 'text-emerald-400 fill-emerald-950' : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                        {tripPlan.days[activeDayIndex].evening.activity}
                      </h4>
                      <div className="text-xs text-stone-400 mb-3">
                        Location: {tripPlan.days[activeDayIndex].evening.location}
                      </div>
                    </div>
                    <div className="p-2.5 bg-stone-800/70 rounded text-[11px] text-stone-300 font-light italic">
                      Tip: {tripPlan.days[activeDayIndex].evening.notes}
                    </div>
                  </div>
                </div>

                {/* Culinary Highlight Bar */}
                <div className="p-4 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-center gap-3 text-xs text-amber-200">
                  <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-300">Featured Culinary Experience: </span>
                    <span>{tripPlan.days[activeDayIndex].culinaryHighlight}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Insider Tips & Packing Advice 2-column strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-stone-800/60 border border-stone-700/60 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Curator Insider Secrets</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300">
                  {tripPlan.localInsiderTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-stone-800/60 border border-stone-700/60 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Backpack className="w-4 h-4" />
                  <span>Essential Packing Notes</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300">
                  {tripPlan.packingAdvice.map((pack, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">·</span>
                      <span>{pack}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal for adding custom note */}
        {showAddActivityModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-700 rounded-xl p-6 max-w-md w-full space-y-4">
              <h4 className="font-serif text-lg font-bold text-white">Add Custom Activity to Day 0{activeDayIndex + 1}</h4>
              <textarea
                value={newActivityText}
                onChange={(e) => setNewActivityText(e.target.value)}
                placeholder="e.g. Visit secret coffee shop in Gion alley or private dinner reservation at 8 PM..."
                className="w-full h-24 p-3 bg-stone-800 border border-stone-700 rounded text-xs text-white focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomActivity}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-400 text-stone-950 rounded hover:bg-amber-300"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
