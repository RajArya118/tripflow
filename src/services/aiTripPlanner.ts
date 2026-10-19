import { GoogleGenAI } from '@google/genai';
import { TripPlan, ItineraryDay } from '../types/travel';
import { PRESET_TRIP_PLANS } from '../data/mockData';

const API_KEY_STORAGE_KEY = 'auravoyage_gemini_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function getEffectiveApiKey(): string {
  const userKey = getStoredApiKey();
  if (userKey) return userKey;

  const envKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
  return envKey || '';
}

export interface ItineraryOptions {
  interests?: string[];
  pacing?: 'Relaxed' | 'Balanced' | 'Intensive';
}

const memoryCache = new Map<string, TripPlan>();

export async function generateBespokeItinerary(
  destination: string,
  daysCount: number,
  style: string,
  budget: 'Comfort' | 'Boutique Luxury' | 'Ultra Luxury',
  options: ItineraryOptions = {}
): Promise<TripPlan> {
  const cacheKey = `${destination.toLowerCase()}-${daysCount}-${style}-${budget}-${(options.interests || []).sort().join(',')}-${options.pacing || 'Balanced'}`;
  if (memoryCache.has(cacheKey)) {
    return JSON.parse(JSON.stringify(memoryCache.get(cacheKey)!));
  }

  const apiKey = getEffectiveApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const interestsStr = options.interests && options.interests.length > 0
        ? `Focus on these traveler interests: ${options.interests.join(', ')}.`
        : '';
      const pacingStr = options.pacing ? `Pacing rhythm: ${options.pacing}.` : '';

      const prompt = `You are a world-class luxury travel curator, author of high-end monographs, and private concierge.
Create a detailed ${daysCount}-day bespoke luxury travel itinerary for "${destination}" with travel style "${style}" and budget tier "${budget}".
${interestsStr}
${pacingStr}

Respond with valid JSON matching this exact structure:
{
  "id": "trip-${Date.now()}",
  "destination": "${destination}",
  "durationDays": ${daysCount},
  "style": "${style}",
  "budget": "${budget}",
  "days": [
    {
      "dayNumber": 1,
      "title": "Evocative, poetic day title",
      "theme": "Theme of day",
      "morning": { "activity": "Specific authentic luxury activity", "location": "Neighborhood or landmark", "notes": "Discreet insider hint or logistics" },
      "afternoon": { "activity": "Specific authentic luxury activity", "location": "Neighborhood or landmark", "notes": "Discreet insider hint or logistics" },
      "evening": { "activity": "Specific authentic luxury activity", "location": "Neighborhood or landmark", "notes": "Discreet insider hint or logistics" },
      "culinaryHighlight": "Signature local dish, wine pairing, or dining venue"
    }
  ],
  "localInsiderTips": ["3 distinct, high-value local customs, etiquette or navigation secrets"],
  "packingAdvice": ["3 targeted essential packing items tailored to the terrain and climate"]
}
Ensure exactly ${daysCount} days are generated. Do not wrap in markdown quotes if possible, output raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson) as TripPlan;
      if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
        memoryCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn('AI generation fell back to curated travel library:', err);
    }
  }

  // Graceful curated fallback from high-fidelity library
  const matchedPresetKey = Object.keys(PRESET_TRIP_PLANS).find(
    (k) => k.toLowerCase() === destination.toLowerCase() || destination.toLowerCase().includes(k.toLowerCase())
  );

  const preset = matchedPresetKey ? PRESET_TRIP_PLANS[matchedPresetKey] : null;

  if (preset) {
    const slicedDays = preset.days.slice(0, daysCount);
    while (slicedDays.length < daysCount) {
      const dayNum = slicedDays.length + 1;
      slicedDays.push({
        dayNumber: dayNum,
        title: `Hidden Treasures of ${destination} & Sunset Toast`,
        theme: 'Local Discovery & Farewell Memories',
        morning: {
          activity: `Explore quiet local artisan markets and boutique craft studios with a resident specialist`,
          location: `Historic Old Quarter, ${destination}`,
          notes: 'Visit early to witness craftspeople practicing ancestral techniques.',
        },
        afternoon: {
          activity: `Private scenic viewpoint walk and leisurely café immersion overlooking panoramic terrain`,
          location: `Belvedere Ridge, ${destination}`,
          notes: 'Optimal golden-hour light for photography and contemplation.',
        },
        evening: {
          activity: `Celebratory chef tasting menu with sommelier-paired regional vintage wines`,
          location: `Hillside Terrace, ${destination}`,
          notes: 'Smart casual dress code recommended; prime sunset table reserved.',
        },
        culinaryHighlight: `Chef special regional tasting paired with local reserve vintage wine.`,
      });
    }

    const result: TripPlan = {
      id: `trip-${Date.now()}`,
      destination: destination,
      durationDays: daysCount,
      style: style,
      budget: budget,
      days: slicedDays,
      localInsiderTips: preset.localInsiderTips,
      packingAdvice: preset.packingAdvice,
    };
    memoryCache.set(cacheKey, result);
    return result;
  }

  // Generic procedural generator for custom user destinations
  const generatedDays: ItineraryDay[] = [];
  const themes = [
    { title: `Arrival & Historic Footsteps`, theme: 'Heritage & Orientation' },
    { title: `Hidden Gems & Artisan Crafts`, theme: 'Culture & Immersion' },
    { title: `Nature Vistas & Panoramic Serenity`, theme: 'Panoramic Escapes' },
    { title: `Gastronomic Delights & Market Walk`, theme: 'Culinary Exploration' },
    { title: `Exclusive Private Access & Sunset Farewell`, theme: 'Celebration & Reflection' },
    { title: `Countryside Excursion & Mountain Passes`, theme: 'Rural Heritage' },
    { title: `Leisure Morning & Departure Memories`, theme: 'Final Reflections' },
  ];

  for (let i = 0; i < daysCount; i++) {
    const t = themes[i % themes.length];
    generatedDays.push({
      dayNumber: i + 1,
      title: `${t.title} in ${destination}`,
      theme: t.theme,
      morning: {
        activity: `Early morning orientation walk through ${destination}'s most scenic historic district`,
        location: `Central Historic Quarter, ${destination}`,
        notes: 'Arrive early before day-tripper crowds for tranquil exploration.',
      },
      afternoon: {
        activity: `Curated museum visit or private walking tour with an architectural historian`,
        location: `Old Town Cultural Quarter, ${destination}`,
        notes: 'Pre-reserved VIP entry pass included.',
      },
      evening: {
        activity: `Rooftop aperitivo followed by an authentic regional dinner`,
        location: `Scenic Terrace, ${destination}`,
        notes: 'Reservation confirmed for prime sunset viewing table.',
      },
      culinaryHighlight: `Traditional seasonal dinner paired with regional sommelier wine selection.`,
    });
  }

  const result: TripPlan = {
    id: `trip-${Date.now()}`,
    destination: destination,
    durationDays: daysCount,
    style: style,
    budget: budget,
    days: generatedDays,
    localInsiderTips: [
      `Always keep local currency on hand for charming family-run markets and artisan studios.`,
      `Book reservations for premier dining at least 2 weeks ahead in peak travel season.`,
      `Download offline maps of ${destination} before leaving your accommodation.`,
    ],
    packingAdvice: [
      `Supportive, broken-in footwear suitable for stone pathways and walking tours.`,
      `Versatile layering options for cooler evening breezes.`,
      `A lightweight portable power bank and universal plug adapter.`,
    ],
  };

  memoryCache.set(cacheKey, result);
  return result;
}

/**
 * Regenerate an individual day with specific user guidance
 */
export async function regenerateSingleDay(
  destination: string,
  dayNumber: number,
  customFocus: string,
  budget: 'Comfort' | 'Boutique Luxury' | 'Ultra Luxury'
): Promise<ItineraryDay> {
  const apiKey = getEffectiveApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a world-class luxury travel curator.
Regenerate Day ${dayNumber} for an itinerary in "${destination}" (Budget tier: ${budget}).
Specific focus requested by traveler: "${customFocus}".

Respond with ONLY valid JSON:
{
  "dayNumber": ${dayNumber},
  "title": "Evocative, poetic title",
  "theme": "Theme matching ${customFocus}",
  "morning": { "activity": "Specific activity", "location": "Neighborhood/place", "notes": "Helpful hint" },
  "afternoon": { "activity": "Specific activity", "location": "Neighborhood/place", "notes": "Helpful hint" },
  "evening": { "activity": "Specific activity", "location": "Neighborhood/place", "notes": "Helpful hint" },
  "culinaryHighlight": "Signature dining experience"
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const cleanJson = (res.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed && parsed.title && parsed.morning) {
        return parsed as ItineraryDay;
      }
    } catch (e) {
      console.warn('Single day regeneration fallback:', e);
    }
  }

  // Graceful fallback for single day regeneration
  return {
    dayNumber,
    title: `Bespoke ${customFocus} Experience in ${destination}`,
    theme: customFocus,
    morning: {
      activity: `Exclusive morning curated discovery dedicated to ${customFocus}`,
      location: `${destination} Cultural District`,
      notes: 'Arranged with personal host accompaniment.',
    },
    afternoon: {
      activity: `Immersive afternoon exploration focused on authentic ${customFocus}`,
      location: `${destination} Quarter`,
      notes: 'Bypasses standard tourist paths for an intimate encounter.',
    },
    evening: {
      activity: `Signature sunset experience and regional culinary celebration`,
      location: `Panoramic Terrace, ${destination}`,
      notes: 'Pre-reserved table with prime views.',
    },
    culinaryHighlight: `Regional chef tasting menu tailored around ${customFocus}.`,
  };
}

/**
 * Generates an iCalendar (.ics) string for importing into Apple Calendar, Google Calendar, Outlook
 */
export function exportItineraryAsICal(plan: TripPlan, startDate: Date = new Date()): string {
  const formatDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AuraVoyage//Trip Architect//EN',
    `X-WR-CALNAME:${plan.destination} Itinerary - AuraVoyage`,
    'CALSCALE:GREGORIAN',
  ];

  plan.days.forEach((day, idx) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + idx);

    // Morning event
    const morningStart = new Date(dayDate);
    morningStart.setHours(9, 0, 0, 0);
    const morningEnd = new Date(dayDate);
    morningEnd.setHours(12, 0, 0, 0);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:auravoyage-${plan.id}-d${day.dayNumber}-morn@auravoyage.com`);
    lines.push(`DTSTAMP:${formatDate(new Date())}`);
    lines.push(`DTSTART:${formatDate(morningStart)}`);
    lines.push(`DTEND:${formatDate(morningEnd)}`);
    lines.push(`SUMMARY:Day ${day.dayNumber}: ${day.morning.activity}`);
    lines.push(`LOCATION:${day.morning.location}`);
    lines.push(`DESCRIPTION:${day.morning.notes}`);
    lines.push('END:VEVENT');

    // Afternoon event
    const aftStart = new Date(dayDate);
    aftStart.setHours(14, 0, 0, 0);
    const aftEnd = new Date(dayDate);
    aftEnd.setHours(17, 0, 0, 0);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:auravoyage-${plan.id}-d${day.dayNumber}-aft@auravoyage.com`);
    lines.push(`DTSTAMP:${formatDate(new Date())}`);
    lines.push(`DTSTART:${formatDate(aftStart)}`);
    lines.push(`DTEND:${formatDate(aftEnd)}`);
    lines.push(`SUMMARY:Day ${day.dayNumber}: ${day.afternoon.activity}`);
    lines.push(`LOCATION:${day.afternoon.location}`);
    lines.push(`DESCRIPTION:${day.afternoon.notes}`);
    lines.push('END:VEVENT');

    // Evening event
    const eveStart = new Date(dayDate);
    eveStart.setHours(19, 0, 0, 0);
    const eveEnd = new Date(dayDate);
    eveEnd.setHours(22, 0, 0, 0);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:auravoyage-${plan.id}-d${day.dayNumber}-eve@auravoyage.com`);
    lines.push(`DTSTAMP:${formatDate(new Date())}`);
    lines.push(`DTSTART:${formatDate(eveStart)}`);
    lines.push(`DTEND:${formatDate(eveEnd)}`);
    lines.push(`SUMMARY:Day ${day.dayNumber}: ${day.evening.activity}`);
    lines.push(`LOCATION:${day.evening.location}`);
    lines.push(`DESCRIPTION:${day.evening.notes}\\nDining Highlight: ${day.culinaryHighlight}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Generates formatted Markdown travel brief
 */
export function exportItineraryAsMarkdown(plan: TripPlan): string {
  let md = `# AuraVoyage Curated Brief: ${plan.destination}\n\n`;
  md += `**Duration:** ${plan.durationDays} Days | **Style:** ${plan.style} | **Budget Tier:** ${plan.budget}\n\n`;
  md += `---\n\n`;

  plan.days.forEach((day) => {
    md += `## Day ${day.dayNumber}: ${day.title}\n`;
    md += `*Theme: ${day.theme}*\n\n`;
    md += `- **Morning:** ${day.morning.activity} (${day.morning.location})\n  *Note: ${day.morning.notes}*\n`;
    md += `- **Afternoon:** ${day.afternoon.activity} (${day.afternoon.location})\n  *Note: ${day.afternoon.notes}*\n`;
    md += `- **Evening:** ${day.evening.activity} (${day.evening.location})\n  *Note: ${day.evening.notes}*\n`;
    md += `- **Culinary Highlight:** ${day.culinaryHighlight}\n\n`;
  });

  md += `### Local Insider Tips\n`;
  plan.localInsiderTips.forEach((tip) => {
    md += `- ${tip}\n`;
  });

  md += `\n### Packing Recommendations\n`;
  plan.packingAdvice.forEach((item) => {
    md += `- ${item}\n`;
  });

  md += `\n---\n*Curated by AuraVoyage Journeys Ltd.*`;
  return md;
}
