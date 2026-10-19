import React from 'react';
import { Currency } from '../types/travel';
import { Globe2 } from 'lucide-react';

interface FooterProps {
  currentCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentCurrency,
  onCurrencyChange,
  onNavigate,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 px-6 border-t border-stone-800">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              AuraVoyage
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              An independent collection of verified private estates, alpine chalets, and tailor-made expeditions designed for travelers seeking profound connection to place.
            </p>
            <div className="text-[11px] text-stone-500 font-mono">
              Tokyo · Milan · Zurich · New York
            </div>
          </div>

          {/* Nav links 1 */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Sanctuaries
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('stays')} className="hover:text-white transition-colors cursor-pointer">
                  Kyoto Machiyas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stays')} className="hover:text-white transition-colors cursor-pointer">
                  Amalfi Cliff Villas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stays')} className="hover:text-white transition-colors cursor-pointer">
                  Zermatt Alpine Glass
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stays')} className="hover:text-white transition-colors cursor-pointer">
                  Oia Volcanic Suites
                </button>
              </li>
            </ul>
          </div>

          {/* Nav links 2 */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Expeditions
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('expeditions')} className="hover:text-white transition-colors cursor-pointer">
                  Serengeti Great Migration
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('expeditions')} className="hover:text-white transition-colors cursor-pointer">
                  Capri Yacht Circumnavigation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('expeditions')} className="hover:text-white transition-colors cursor-pointer">
                  Imperial Zen & Tea Harvest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('flights')} className="hover:text-white transition-colors cursor-pointer">
                  Flight Radar
                </button>
              </li>
            </ul>
          </div>

          {/* Nav links 3 */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Concierge
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('architect')} className="hover:text-white transition-colors cursor-pointer">
                  AI Trip Architect
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('journal')} className="hover:text-white transition-colors cursor-pointer">
                  Editorial Journal
                </button>
              </li>
              <li>
                <span className="text-stone-500">24/7 Dedicated Host Desk</span>
              </li>
              <li>
                <span className="text-stone-500">Carbon Neutral Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} AuraVoyage Journeys Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-stone-400">
              <Globe2 className="w-3.5 h-3.5 text-stone-500" />
              <span>Currency: {currentCurrency}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
