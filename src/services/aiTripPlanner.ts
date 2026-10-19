import { GoogleGenAI } from '@google/genai';
import { TripPlan, ItineraryDay } from '../types/travel';
import { PRESET_TRIP_PLANS } from '../data/mockData';

export async function generateBespokeItinerary(
  destination: string,
  daysCount: number,
  style: string,
  budget: 'Comfort' | 'Boutique Luxury' | 'Ultra Luxury'
): Promise<TripPlan> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a world-class luxury travel curator and private concierge.
Create a detailed ${daysCount}-day bespoke travel itinerary for "${destination}" with travel style "${style}" and budget tier "${budget}".

Respond ONLY with valid JSON matching this schema:
{
  "id": "trip-${Date.now()}",
  "destination": "${destination}",
  "durationDays": ${daysCount},
  "style": "${style}",
  "budget": "${budget}",
  "days": [
    {
      "dayNumber": 1,
      "title": "Short poetic day title",
      "theme": "Theme of day",
      "morning": { "activity": "Specific authentic activity", "location": "Neighborhood or landmark", "notes": "Helpful insider hint" },
      "afternoon": { "activity": "Specific authentic activity", "location": "Neighborhood or landmark", "notes": "Helpful insider hint" },
      "evening": { "activity": "Specific authentic activity", "location": "Neighborhood or landmark", "notes": "Helpful insider hint" },
      "culinaryHighlight": "Signature local dish and recommended dining style"
    }
  ],
  "localInsiderTips": ["3 specific, non-obvious local customs or hacks"],
  "packingAdvice": ["3 targeted essential packing recommendations"]
}
Make sure exactly ${daysCount} days are generated. Do not include markdown code block backticks if possible, just raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson) as TripPlan;
      if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('AI generation fell back to curated travel library:', err);
    }
  }

  // Graceful curated fallback
  const preset = PRESET_TRIP_PLANS[destination];
  if (preset) {
    // Adjust days if count differs
    const slicedDays = preset.days.slice(0, daysCount);
    while (slicedDays.length < daysCount) {
      const dayNum = slicedDays.length + 1;
      slicedDays.push({
        dayNumber: dayNum,
        title: `Hidden Treasures of ${destination} & Sunset Toast`,
        theme: 'Local Discovery & Farewell Memories',
        morning: {
          activity: `Explore quiet local artisan markets and boutique craft studios`,
          location: `Historic Old Quarter, ${destination}`,
          notes: 'Visit early to see local craftspeople at work.',
        },
        afternoon: {
          activity: `Private scenic viewpoint walk and leisurely café immersion`,
          location: `Belvedere Ridge, ${destination}`,
          notes: 'Optimal golden-hour light for photography.',
        },
        evening: {
          activity: `Celebratory chef tasting menu with wine pairings`,
          location: `Harbor / Hillside Terrace, ${destination}`,
          notes: 'Smart casual dress code recommended.',
        },
        culinaryHighlight: `Chef special regional tasting paired with local vintage wine.`,
      });
    }

    return {
      id: `trip-${Date.now()}`,
      destination: destination,
      durationDays: daysCount,
      style: style,
      budget: budget,
      days: slicedDays,
      localInsiderTips: preset.localInsiderTips,
      packingAdvice: preset.packingAdvice,
    };
  }

  // Generic procedural generator for any destination entered by user
  const generatedDays: ItineraryDay[] = [];
  const themes = [
    { title: `Arrival & Historic Footsteps`, theme: 'Heritage & Orientation' },
    { title: `Hidden Gems & Artisan Crafts`, theme: 'Culture & Immersion' },
    { title: `Nature Vistas & Coastal/Mountain Serenity`, theme: 'Panoramic Escapes' },
    { title: `Gastronomic Delights & Market Walk`, theme: 'Culinary Exploration' },
    { title: `Exclusive Private Access & Sunset Farewell`, theme: 'Celebration & Reflection' },
    { title: `Countryside Excursion & Local Villages`, theme: 'Rural Heritage' },
    { title: `Leisure Morning & Departure Memories`, theme: 'Final Reflections' },
  ];

  for (let i = 0; i < daysCount; i++) {
    const t = themes[i % themes.length];
    generatedDays.push({
      dayNumber: i + 1,
      title: `${t.title} in ${destination}`,
      theme: t.theme,
      morning: {
        activity: `Early morning orientation walk through ${destination}'s most scenic quarter`,
        location: `Central Historic District, ${destination}`,
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

  return {
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
}
