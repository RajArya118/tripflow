import React, { useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey, getEffectiveApiKey } from '../services/aiTripPlanner';
import { Sparkles, Key, Check, ShieldCheck, X, ExternalLink, RefreshCw } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEffectiveKey = getEffectiveApiKey();
  const isCustomKeyActive = Boolean(getStoredApiKey());
  const isEnvKeyActive = Boolean(!isCustomKeyActive && currentEffectiveKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredApiKey(apiKey.trim());
    setSavedSuccess(true);
    onKeyUpdated();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif text-base font-bold text-stone-900">
              Gemini AI Concierge Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-stone-600">
          {/* Status Indicator */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Engine Status
              </div>
              <div className="font-semibold text-stone-900 mt-0.5">
                {isCustomKeyActive
                  ? 'Connected with Custom Key'
                  : isEnvKeyActive
                  ? 'Active via Environment Key'
                  : 'Curated Architectural Fallback Active'}
              </div>
            </div>
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                currentEffectiveKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-800 mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:border-amber-700 pr-10"
              />
              <Key className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
              Your API key is stored locally in your browser and used only to curate personalized multi-day itineraries and regenerate days.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-amber-900 hover:text-amber-950 font-semibold flex items-center gap-1 underline"
            >
              <span>Get API key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {isCustomKeyActive && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Clear key
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
