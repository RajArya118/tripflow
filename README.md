# TripFlow · AuraVoyage ✈️🏛️

> **Curated luxury stays, bespoke small-cohort expeditions, interactive AI itinerary architect, and seamless travel booking.**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Overview

**TripFlow (AuraVoyage)** is a next-generation luxury travel platform engineered for discerning travelers seeking deep connection to place. Combining architectural elegance with advanced AI capabilities, the platform provides an all-in-one suite for discovering handpicked sanctuaries, comparing private estates, booking curated field journeys, and architecting tailor-made daily itineraries.

---

## ✨ Key Features

### 🏡 1. Sanctuary Collection (Villas & Estates)
- **Verified Historic Properties**: Handpicked machiyas, cliffside Mediterranean villas, alpine chalets, and wilderness tented camps.
- **In-Card Photo Carousels**: Browse multi-photo galleries directly on listing cards without opening modals.
- **Dynamic Multi-Currency Engine**: Instant real-time rate conversion across **USD ($)**, **EUR (€)**, **GBP (£)**, and **JPY (¥)**.
- **Live Search & Price Slider**: Instant debounced search filtering by keywords, amenities, and customizable nightly rate caps.
- **Zero-Broken-Image Fallback**: Graceful fallback to CSS gradient art cards carrying destination typography if external image links fail.

### ⚖️ 2. Side-by-Side Property Comparison
- Select up to **3 properties simultaneously**.
- Floating bottom comparison dock with real-time selection counters.
- Comprehensive tabular comparison matrix covering nightly rates, bedroom/bathroom configurations, guest capacities, cancellation policies, curated highlights, and an active amenities checklist.

### 🤖 3. AI Trip Architect & Concierge (Google Gemini 2.5)
- **Bespoke Multi-Day Generation**: Powered by the official `@google/genai` SDK with strict JSON schema enforcement (`responseMimeType: "application/json"`).
- **Personalized Passions & Pacing**: Filter by traveler interests (*Michelin Dining*, *Art & Architecture*, *Slow Living*, *Private Access*, *Thermal Spas*) and pacing rhythms (*Relaxed*, *Balanced*, *Intensive*).
- **Single-Day AI Regeneration**: Regenerate any individual day with custom prompt guidance (e.g. *"Focus on hidden artisan workshops and sunset views"*) without altering the rest of your itinerary.
- **Export to Calendar (`.ics`)**: Exports RFC-5545 `.ics` files that import directly into Apple Calendar, Google Calendar, and Outlook with morning, afternoon, and evening slots.
- **Copy Travel Dossier**: One-click formatted Markdown summary generation for archiving or client briefings.
- **Print / PDF Brief**: Clean printable view formatted for travel binders and documents.
- **Progress Tracking**: Interactive activity checkboxes with a real-time completion progress bar.
- **Curated Offline Presets**: Built-in multi-day itineraries for **Kyoto**, **Amalfi Coast**, **Swiss Alps**, **Santorini**, **Serengeti**, and **Reykjavik**.

### 🌍 4. Global Sanctuaries Atlas
- Interactive world explorer mapping 8 iconic travel landscapes.
- Direct geographical intelligence: average climate, prime visiting seasons, gateway airport codes, and regional languages.
- Instant 1-click filters to jump straight to stays or launch the AI Trip Architect for that region.

### ✈️ 5. Global Aviation Radar
- Benchmarking long-haul flight fares, lie-flat business suites, and premium routes.
- Aircraft fleet specifications, duration timelines, and carbon emission (`kg CO₂ / seat`) tracking.
- Interactive multi-cabin filtering: *All*, *Economy*, *Premium*, and *Business*.

### 🎫 6. Reservations & Digital Boarding Pass
- **Complete Booking Checkout**: Multi-step reservation flow calculating base amounts, cleaning fees, service fees, and optional luxury add-ons (Private Chauffeur, Sommelier Access, Carbon Offset).
- **Digital Boarding Pass**: Printable luxury travel pass with verified reference codes, check-in instructions, concierge contacts, and an SVG vector QR code for contactless check-in.
- **Persistent Reservations**: Backed by browser `localStorage` to review upcoming bookings anytime from the header.

### 🔑 7. Client-Side AI Settings
- In-app modal to connect custom Google Gemini API keys directly in the browser.
- Instant validation and engine status monitoring (*Connected with Custom Key*, *Active via Environment Key*, or *Curated Architectural Fallback Active*).

---

## 🏗️ Architecture & Tech Stack

```
tripflow-main/
├── index.html                       # HTML5 shell with Google Fonts preconnections
├── vite.config.ts                   # Vite 8 config with ESM dirname & Rolldown chunking
├── package.json                     # Scripts & dependencies
├── tsconfig.json                    # Strict TypeScript compiler options
├── ARCHITECTURE.md                  # Comprehensive architectural documentation
└── src/
    ├── main.tsx                     # React application root
    ├── App.tsx                      # Primary controller and state orchestrator
    ├── index.css                    # Tailwind CSS v4 design tokens and theme configuration
    ├── types/
    │   └── travel.ts                # Immutable contracts and domain models
    ├── services/
    │   └── aiTripPlanner.ts         # Gemini AI engine, caching, single-day regen, exporters
    ├── data/
    │   └── mockData.ts              # Curated listings, expeditions, flights, exchange rates, presets
    └── components/
        ├── Header.tsx               # Navigation, currency switcher, reservations badge, mobile drawer
        ├── HeroSearch.tsx           # Multi-mode tabbed search hub
        ├── StayCard.tsx             # Stay card with photo carousel & compare toggle
        ├── ExpeditionCard.tsx       # Small-cohort journey preview cards
        ├── FlightSearchSection.tsx  # Aviation radar & cabin filter engine
        ├── TripArchitect.tsx        # AI itinerary planner, day tabs, and exporters
        ├── ListingDetailModal.tsx   # Detailed stay/expedition view with photo gallery
        ├── BookingCheckoutModal.tsx # Multi-step reservation checkout
        ├── BookingVoucherModal.tsx  # Printable luxury boarding pass with QR code
        ├── CompareStaysModal.tsx    # Side-by-side estate comparison matrix
        ├── DestinationExplorerModal.tsx # Global atlas & regional travel intelligence
        ├── WishlistDrawer.tsx       # Saved sanctuaries drawer with trip bundling
        ├── MyBookingsModal.tsx      # Confirmed reservations history
        ├── ApiKeyModal.tsx          # Gemini API key configuration
        ├── EditorialSection.tsx     # Travel monographs & trust pillars
        └── Footer.tsx               # Brand manifesto & legal links
```

### ⚡ Performance & Bundle Optimization
Powered by **Vite 8** and **Rolldown** code-splitting:
- **`vendor-react`**: React 19 core isolated for long-term browser caching.
- **`vendor-genai`**: Official Google Gen AI client library isolated to lazy loads.
- **`vendor-icons`**: Lucide SVG icon definitions.
- **Application JS Bundle**: Minified to **~189 kB (44.96 kB gzipped)** for near-instant First Contentful Paint (FCP).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/RajArya118/tripflow.git
cd tripflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment (Optional)
To enable live AI generation without entering a key in the browser UI, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the platform automatically utilizes its built-in curated architectural fallback library.)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches local development server on `http://localhost:3000/` |
| `npm run build` | Compiles and builds production-ready bundle into `/dist` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs strict TypeScript compiler check (`tsc --noEmit`) |
| `npm run clean` | Cross-platform cleanup of `/dist` directory |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Crafted with precision for modern luxury travelers.*
