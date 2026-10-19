import React, { useState, useEffect } from 'react';
import { TripPlan, ItineraryDay } from '../types/travel';
import {
  generateBespokeItinerary,
  regenerateSingleDay,
  exportItineraryAsICal,
  exportItineraryAsMarkdown,
  getEffectiveApiKey,
} from '../services/aiTripPlanner';
import {
  Sparkles,
  Compass,
  CheckCircle,
  Clock,
  Utensils,
  Lightbulb,
  Backpack,
  Plus,
  RefreshCw,
  Printer,
  Download,
  Copy,
  Check,
  Calendar,
  Settings,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

interface TripArchitectProps {
  initialDestination?: string;
  initialDays?: number;
  initialStyle?: string;
  onExploreStaysForDest: (dest: string) => void;
  onOpenApiKeyModal?: () => void;
}

const INTEREST_TAGS = [
  'Michelin & Artisan Dining',
  'Art & Architecture',
  'Slow Living & Nature',
  'Private Access & History',
  'Scenic Views & Golden Hour',
  'Thermal Spas & Wellness',
  'Wine & Vineyard Terroir',
];

export const TripArchitect: React.FC<TripArchitectProps> = ({
  initialDestination = 'Kyoto',
  initialDays = 3,
  initialStyle = 'Heritage & Zen Living',
  onExploreStaysForDest,
  onOpenApiKeyModal,
}) => {
  const [destination, setDestination] = useState(initialDestination);
  const [daysCount, setDaysCount] = useState(initialDays);
  const [style, setStyle] = useState(initialStyle);
  const [budget, setBudget] = useState<'Comfort' | 'Boutique Luxury' | 'Ultra Luxury'>('Boutique Luxury');
  const [pacing, setPacing] = useState<'Relaxed' | 'Balanced' | 'Intensive'>('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Michelin & Artisan Dining', 'Art & Architecture']);

  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Completed items toggle tracking
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  // Single Day Regeneration modal state
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [regenCustomPrompt, setRegenCustomPrompt] = useState('');
  const [regenLoading, setRegenLoading] = useState(false);

  // Custom added notes/activities
  const [newActivityText, setNewActivityText] = useState('');
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);

  // Feedback states
  const [copySuccess, setCopySuccess] = useState(false);

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
      const plan = await generateBespokeItinerary(destination, daysCount, style, budget, {
        interests: selectedInterests,
        pacing,
      });
      setTripPlan(plan);
      setActiveDayIndex(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateActiveDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripPlan || !regenCustomPrompt.trim()) return;

    setRegenLoading(true);
    try {
      const currentDay = tripPlan.days[activeDayIndex];
      const regenerated = await regenerateSingleDay(
        destination,
        currentDay.dayNumber,
        regenCustomPrompt,
        budget
      );

      const updated = { ...tripPlan };
      updated.days[activeDayIndex] = regenerated;
      setTripPlan(updated);
      setShowRegenModal(false);
      setRegenCustomPrompt('');
    } catch (err) {
      console.error('Day regen failed:', err);
    } finally {
      setRegenLoading(false);
    }
  };

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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

  const handleExportICal = () => {
    if (!tripPlan) return;
    const icsContent = exportItineraryAsICal(tripPlan);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tripPlan.destination.toLowerCase()}-bespoke-itinerary.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    if (!tripPlan) return;
    const md = exportItineraryAsMarkdown(tripPlan);
    navigator.clipboard.writeText(md);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Completion calculation for active day
  const activeDayKeyPrefix = `d${activeDayIndex}`;
  const totalSlots = 3; // morning, afternoon, evening
  const completedSlots = ['m', 'a', 'e'].filter((s) => completedItems[`${activeDayKeyPrefix}-${s}`]).length;
  const progressPercent = Math.round((completedSlots / totalSlots) * 100);

  const isLiveAiActive = Boolean(getEffectiveApiKey());

  return (
    <section id="architect" className="py-16 px-6 bg-stone-900 text-stone-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Trip Architect & Concierge Planner</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-white">
              Bespoke Day-by-Day Curations
            </h2>
            <p className="text-stone-400 text-sm mt-2 max-w-xl">
              Architect an hour-by-hour tailored journey customized to your travel rhythm, culinary affinities, and preferred pacing.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenApiKeyModal && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="px-3 py-2 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>{isLiveAiActive ? 'Gemini 2.5 Flash' : 'Configure AI Key'}</span>
              </button>
            )}

            <button
              onClick={() => onExploreStaysForDest(destination)}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Stays in {destination}
            </button>
          </div>
        </div>

        {/* Generator Controls Hub */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-5 sm:p-6 mb-10 shadow-xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Kyoto, Amalfi, Zermatt..."
                className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Duration
              </label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-amber-400"
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
                className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Heritage & Zen Living">Heritage & Zen Living</option>
                <option value="Epicurean & Wine Trail">Epicurean & Wine Trail</option>
                <option value="High Alpine Adventure">High Alpine Adventure</option>
                <option value="Coastal Relaxation">Coastal Relaxation</option>
                <option value="Wilderness & Dark Skies">Wilderness & Dark Skies</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Budget Tier
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-amber-400"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Curating Plan...' : 'Generate Plan'}</span>
              </button>
            </div>
          </div>

          {/* Interests & Themes Multi-Pills */}
          <div className="pt-3 border-t border-stone-700/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Tailor Traveler Passions & Rhythms:
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {INTEREST_TAGS.map((tag) => {
                const active = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                        : 'bg-stone-900 text-stone-400 border border-stone-700 hover:text-stone-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Itinerary Display */}
        {loading ? (
          <div className="text-center py-24 bg-stone-800/40 border border-stone-800 rounded-2xl">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto mb-4" />
            <div className="font-serif text-xl text-stone-200 font-semibold">
              Architecting your bespoke {destination} itinerary...
            </div>
            <div className="text-xs text-stone-400 mt-2 max-w-md mx-auto">
              Synthesizing regional micro-climates, master artisans, and culinary reservations for {daysCount} tailored days.
            </div>
          </div>
        ) : tripPlan ? (
          <div className="space-y-8">
            {/* Top Toolbar: Day Selector & Export Tools */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-stone-800">
              {/* Day Selector Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {tripPlan.days.map((day, idx) => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                      activeDayIndex === idx
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <span>Day 0{day.dayNumber}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">({day.theme.substring(0, 14)}...)</span>
                  </button>
                ))}
              </div>

              {/* Itinerary Action Utilities */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={handleExportICal}
                  title="Export to Calendar (.ics)"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Calendar (.ics)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdown}
                  title="Copy formatted Markdown brief"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors cursor-pointer"
                >
                  {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copySuccess ? 'Copied!' : 'Copy Brief'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  title="Print or Save as PDF"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
              </div>
            </div>

            {/* Active Day Detail Card */}
            {tripPlan.days[activeDayIndex] && (
              <div className="bg-stone-800 border border-stone-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                {/* Day Header & Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-700/80 pb-5">
                  <div>
                    <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                      <span>Day 0{tripPlan.days[activeDayIndex].dayNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{tripPlan.days[activeDayIndex].theme}</span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                      {tripPlan.days[activeDayIndex].title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Day Progress Tracker */}
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-stone-400 font-mono">
                        {completedSlots} of {totalSlots} Done
                      </div>
                      <div className="w-20 bg-stone-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-amber-400 h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Day Customization Buttons */}
                    <button
                      type="button"
                      onClick={() => setShowRegenModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-amber-300 rounded-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Regenerate Day</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddActivityModal(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-md transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>

                {/* Morning, Afternoon, Evening Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Morning */}
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Morning (08:30 – 12:00)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-m`)}
                          aria-label="Toggle morning complete"
                          className="text-stone-400 hover:text-amber-400 cursor-pointer"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-m`]
                                ? 'text-emerald-400 fill-emerald-950'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4
                        className={`text-sm font-bold text-white mb-1.5 leading-snug ${
                          completedItems[`d${activeDayIndex}-m`] ? 'line-through text-stone-400' : ''
                        }`}
                      >
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
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Afternoon (13:30 – 17:00)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-a`)}
                          aria-label="Toggle afternoon complete"
                          className="text-stone-400 hover:text-amber-400 cursor-pointer"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-a`]
                                ? 'text-emerald-400 fill-emerald-950'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4
                        className={`text-sm font-bold text-white mb-1.5 leading-snug ${
                          completedItems[`d${activeDayIndex}-a`] ? 'line-through text-stone-400' : ''
                        }`}
                      >
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
                  <div className="p-5 bg-stone-900/90 rounded-xl border border-stone-700/60 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-mono font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Evening (19:00 – Late)
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleComplete(`d${activeDayIndex}-e`)}
                          aria-label="Toggle evening complete"
                          className="text-stone-400 hover:text-amber-400 cursor-pointer"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              completedItems[`d${activeDayIndex}-e`]
                                ? 'text-emerald-400 fill-emerald-950'
                                : 'text-stone-600'
                            }`}
                          />
                        </button>
                      </div>
                      <h4
                        className={`text-sm font-bold text-white mb-1.5 leading-snug ${
                          completedItems[`d${activeDayIndex}-e`] ? 'line-through text-stone-400' : ''
                        }`}
                      >
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
                <div className="p-4 bg-amber-950/40 border border-amber-900/60 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-amber-900/60 rounded-lg text-amber-300 shrink-0">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                      Curated Dining Experience for Day 0{tripPlan.days[activeDayIndex].dayNumber}
                    </div>
                    <div className="text-xs text-stone-200 font-medium mt-0.5">
                      {tripPlan.days[activeDayIndex].culinaryHighlight}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Travel Intelligence & Packing Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-stone-800/60 border border-stone-700/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" />
                  <span>Local Customs & Concierge Hints</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300">
                  {tripPlan.localInsiderTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-stone-800/60 border border-stone-700/80 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Backpack className="w-4 h-4" />
                  <span>Curated Packing Advice</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-300">
                  {tripPlan.packingAdvice.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal: Regenerate Single Day */}
        {showRegenModal && tripPlan && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-stone-800 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-serif text-lg font-bold">
                    Regenerate Day 0{tripPlan.days[activeDayIndex].dayNumber}
                  </h4>
                </div>
                <button
                  onClick={() => setShowRegenModal(false)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegenerateActiveDay} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    What should this day focus on?
                  </label>
                  <input
                    type="text"
                    required
                    value={regenCustomPrompt}
                    onChange={(e) => setRegenCustomPrompt(e.target.value)}
                    placeholder="e.g. Traditional pottery artisan workshops and matcha teahouse"
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">Or pick a suggestion:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'More Michelin fine dining',
                      'Local hidden artisan studios',
                      'Relaxed thermal hot springs & spa',
                      'Sunset photography spots',
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRegenCustomPrompt(s)}
                        className="px-2 py-1 text-[11px] bg-stone-900 border border-stone-700 rounded hover:border-amber-400 text-stone-300"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-700">
                  <button
                    type="button"
                    onClick={() => setShowRegenModal(false)}
                    className="px-3.5 py-1.5 text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={regenLoading}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${regenLoading ? 'animate-spin' : ''}`} />
                    <span>{regenLoading ? 'Updating Day...' : 'Update Day'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Custom Note */}
        {showAddActivityModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-stone-800 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 space-y-4">
              <h4 className="font-serif text-lg font-bold">Add Custom Evening Item / Note</h4>
              <form onSubmit={handleAddCustomActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Activity Description
                  </label>
                  <textarea
                    required
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    placeholder="e.g. Private evening dinner meeting with gallery curator at 8:30 PM..."
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 h-24"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddActivityModal(false)}
                    className="px-3.5 py-1.5 text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
