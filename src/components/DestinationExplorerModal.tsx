import React, { useState } from 'react';
import { DestinationInfo, Currency } from '../types/travel';
import { POPULAR_DESTINATIONS, CURRENCY_RATES } from '../data/mockData';
import { X, MapPin, Compass, Sun, Calendar, Sparkles, ArrowRight, Plane } from 'lucide-react';

interface DestinationExplorerModalProps {
  isOpen: boolean;
  currency: Currency;
  onClose: () => void;
  onSelectDestination: (destName: string) => void;
  onPlanDestination: (destName: string) => void;
}

export const DestinationExplorerModal: React.FC<DestinationExplorerModalProps> = ({
  isOpen,
  currency,
  onClose,
  onSelectDestination,
  onPlanDestination,
}) => {
  const [selectedDest, setSelectedDest] = useState<DestinationInfo>(POPULAR_DESTINATIONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-900" />
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Global Sanctuaries Atlas
              </h2>
              <div className="text-xs text-stone-500">
                Curated geographical intelligence across 8 iconic landscapes
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

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Destination Selector Sidebar */}
          <div className="md:col-span-5 border-r border-stone-200 overflow-y-auto p-4 space-y-2 bg-stone-50/50 max-h-[40vh] md:max-h-[65vh]">
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = selectedDest.name === dest.name;
              return (
                <div
                  key={dest.name}
                  onClick={() => setSelectedDest(dest)}
                  className={`p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-white border-amber-800/40 shadow-xs ring-1 ring-amber-800/20'
                      : 'hover:bg-white border-transparent'
                  }`}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                        {dest.name}
                      </h4>
                      <span className="font-mono text-[10px] font-bold text-stone-400">
                        {dest.airport}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 truncate">{dest.country}</div>
                    <div className="text-[10px] text-amber-900 font-semibold mt-0.5">
                      {dest.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destination Spotlight & Intelligence Card */}
          <div className="md:col-span-7 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src={selectedDest.image}
                  alt={selectedDest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                  <div className="text-xs font-semibold tracking-wider uppercase text-amber-300">
                    {selectedDest.region} · {selectedDest.country}
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{selectedDest.name}</h3>
                </div>
              </div>

              {/* Travel Intelligence Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-bold">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Average Climate</span>
                  </div>
                  <div className="font-semibold text-stone-900 mt-1">{selectedDest.climate}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-bold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prime Season</span>
                  </div>
                  <div className="font-semibold text-stone-900 mt-1">{selectedDest.bestSeason}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-bold">
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span>Airport Gateway</span>
                  </div>
                  <div className="font-mono font-semibold text-stone-900 mt-1">
                    {selectedDest.airport} International
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5 text-stone-500 text-[10px] uppercase font-bold">
                    <Compass className="w-3.5 h-3.5 text-stone-600" />
                    <span>Local Language & Currency</span>
                  </div>
                  <div className="font-semibold text-stone-900 mt-1">
                    {selectedDest.language} · {selectedDest.currencyCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onSelectDestination(selectedDest.name);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Filter Stays in {selectedDest.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onPlanDestination(selectedDest.name);
                  onClose();
                }}
                className="py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>Architect Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
