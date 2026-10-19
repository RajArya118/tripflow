# TripFlow (AuraVoyage) — Comprehensive System Architecture & Code Structure

## 1. Executive Summary & Product Vision

**TripFlow (AuraVoyage)** is a modern luxury travel platform, expedition curator, and intelligent itinerary architect. The application unites five travel pillars into a single client-side application:
1. **Sanctuary Collection**: Curated private villas, alpine chalets, and heritage machiyas with in-card carousels and multi-property comparison.
2. **AI Trip Architect**: A bespoke multi-day itinerary planner powered by the Google Gemini API (`gemini-2.5-flash`), with offline fallback presets, iCal (`.ics`) calendar export, and Markdown brief generation.
3. **Curated Field Expeditions**: Small-cohort and private guided journeys led by master naturalists and historians.
4. **Global Aviation Radar**: Flight search benchmarking lie-flat suites, direct routes, and carbon footprint metrics.
5. **Reservations & Travel Passes**: End-to-end checkout, client-side persistence, and printable digital boarding passes with vector QR codes.

---

## 2. Technology Stack & Toolchain

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime & Core** | React / React DOM | `^19.0.1` | Concurrent component rendering and UI state |
| **Language** | TypeScript | `^7.0.2` | Static type checking, algebraic data types, strict null checks |
| **Bundler & Dev Server** | Vite / Rolldown | `^8.3.0` | Sub-millisecond HMR, native ESM, vendor code-splitting |
| **Styling** | Tailwind CSS | `^4.3.3` | Utility-first CSS engine with custom `@theme` typographic tokens |
| **Icons & Visuals** | Lucide React | `^0.546.0` | Accessible tree-shakeable SVG icons |
| **AI Integration** | `@google/genai` | `^2.4.0` | Official Google Gen AI SDK (`gemini-2.5-flash`) |
| **Typography** | Google Fonts | Web | *Playfair Display* (serif), *Plus Jakarta Sans* (sans), *JetBrains Mono* (mono) |

---

## 3. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph UI_Layer [Presentation Layer]
        HS[HeroSearch]
        SC[StayCard Grid]
        EC[ExpeditionCard Grid]
        FS[FlightSearchSection]
        TA[TripArchitect]
        ED[EditorialSection]
        FT[Footer]
    end

    subgraph Modals [Modals & Overlay System]
        LDM[ListingDetailModal]
        BCM[BookingCheckoutModal]
        BVM[BookingVoucherModal]
        CSM[CompareStaysModal]
        DEM[DestinationExplorerModal]
        AKM[ApiKeyModal]
        WLD[WishlistDrawer]
        MBM[MyBookingsModal]
    end

    subgraph State_Orchestration [State Orchestration]
        APP[App.tsx Controller]
        HDR[Header.tsx]
    end

    subgraph Core_Services [Services & AI Engine]
        AIP[aiTripPlanner.ts]
        GENAI[@google/genai SDK]
        PTP[PRESET_TRIP_PLANS Fallbacks]
        EXP[iCal / Markdown Exporters]
    end

    subgraph Storage [Persistence Layer]
        LS[(localStorage)]
        LS_B[auravoyage_bookings]
        LS_S[auravoyage_saved_stays]
        LS_K[auravoyage_gemini_api_key]
    end

    subgraph Contracts [Contract Layer]
        TYP[src/types/travel.ts]
        MOCK[src/data/mockData.ts]
    end

    HDR --> APP
    UI_Layer --> APP
    APP --> Modals

    TA --> AIP
    AIP --> GENAI
    AIP --> PTP
    AIP --> EXP

    APP --> LS
    LS --> LS_B
    LS --> LS_S
    LS --> LS_K

    UI_Layer -.-> TYP
    Modals -.-> TYP
    MOCK -.-> TYP
```

---

## 4. Repository & Codebase Directory Structure

```
tripflow-main/
├── .env.example                     # Sample environment variable declarations (VITE_GEMINI_API_KEY)
├── .gitignore                       # Git exclusions (node_modules, dist, .env, etc.)
├── ARCHITECTURE.md                  # Comprehensive system architecture documentation (this document)
├── index.html                       # HTML5 entrypoint with Google Fonts preconnections
├── metadata.json                    # Project metadata & capability flags
├── package.json                     # Scripts, dependencies, and project metadata
├── tsconfig.json                    # TypeScript compiler options (ESNext, React-JSX, Bundler resolution)
├── vite.config.ts                   # Vite 8 config with ESM dirname & Rolldown chunking
└── src/
    ├── main.tsx                     # React application bootstrapping
    ├── App.tsx                      # Primary application orchestrator and state hub
    ├── index.css                    # Tailwind CSS v4 design tokens and theme configuration
    ├── types/
    │   └── travel.ts                # Domain models, algebraic data types, and contract interfaces
    ├── services/
    │   └── aiTripPlanner.ts         # Gemini AI itinerary generator, caching, single-day regeneration, exporters
    ├── data/
    │   └── mockData.ts              # Curated stays, expeditions, flights, exchange rates, and fallback presets
    └── components/
        ├── Header.tsx               # Sticky navigation bar, currency switch, booking badge, atlas trigger
        ├── HeroSearch.tsx           # Multi-mode tabbed search hub (Stays, Expeditions, Flights, Architect)
        ├── StayCard.tsx             # Interactive stay card with in-card photo carousel and compare toggle
        ├── ExpeditionCard.tsx       # Small-cohort guided journey preview cards
        ├── FlightSearchSection.tsx  # Aviation radar with cabin filters, stops, and carbon tracking
        ├── TripArchitect.tsx        # Interactive AI itinerary generator with day tabs, regeneration, and export
        ├── ListingDetailModal.tsx   # Detailed stay/expedition view with photo gallery and price calculations
        ├── BookingCheckoutModal.tsx # Multi-step checkout with traveler info, add-ons, and payment
        ├── BookingVoucherModal.tsx  # Printable luxury boarding pass with vector QR code
        ├── CompareStaysModal.tsx    # Side-by-side tabular comparison of up to 3 selected properties
        ├── DestinationExplorerModal.tsx # Global atlas with climate, airports, languages, and direct filters
        ├── WishlistDrawer.tsx       # Off-canvas saved sanctuaries list with bundling actions
        ├── MyBookingsModal.tsx      # Confirmed reservation history and ticket pass access
        ├── ApiKeyModal.tsx          # Client-side Google Gemini API key configuration modal
        ├── EditorialSection.tsx     # Curated travel journal articles, trust pillars, and newsletter
        └── Footer.tsx               # Brand manifesto, regional links, and currency information
```

---

## 5. Subsystem Architecture & Implementation Details

### 5.1. Domain Data Contracts (`src/types/travel.ts`)

Every component references immutable contracts defined in [`src/types/travel.ts`](file:///c:/Users/chand/OneDrive/Desktop/tripflow/tripflow-main/src/types/travel.ts):

- **`Currency`**: `'USD' | 'EUR' | 'GBP' | 'JPY'` supported across dynamic conversions.
- **`CategoryTheme`**: `'all' | 'coastal' | 'alpine' | 'cultural' | 'safari' | 'nordic'` used for unified thematic filtering across Stays, Expeditions, and the Atlas.
- **`StayListing`**: Models property specs (bedrooms, baths, maxGuests), location coordinates (`lat`/`lng`), host metadata (`superhost`, response rate), pricing ledgers, and nested `Review[]`.
- **`TripPlan` & `ItineraryDay`**: Defines time-slotted daily plans (morning, afternoon, evening activities, location, insider notes, culinary highlights, tips, packing list).
- **`BookingDetails`**: Models financial ledgers (`baseAmount`, `cleaningFee`, `serviceFee`, `addonsAmount`, `totalAmount`), reference numbers (`AV-XXXXX-DEST`), and guest contacts.
- **`DestinationInfo`**: Geographical intelligence contracts (average climate, prime visiting seasons, gateway airport codes, regional languages).

---

### 5.2. AI Subsystem & Concierge Service (`src/services/aiTripPlanner.ts`)

The AI architecture balances live generative intelligence with bulletproof client-side reliability:

```
User Prompt (Dest, Days, Style, Budget, Interests, Pacing)
                        │
                        ▼
            Check In-Memory Cache (Hit?)
             ├── Yes ──> Return Cached Plan Immediately
             └── No
                  │
                  ▼
          API Key Available? (Custom or Env)
             ├── Yes ──> Call @google/genai (gemini-2.5-flash)
             │             │
             │             ├── Success ──> Cache & Return Structured Plan
             │             └── Error   ──> Log Warning & Fallthrough
             │
             └── No ──> Match PRESET_TRIP_PLANS [Dest]
                          ├── Found ──> Slice/Synthesize Days & Return
                          └── None  ──> Run Procedural Synthetic Generator
```

#### Key Capabilities:
1. **JSON Schema Enforcement**: Calls `ai.models.generateContent` with `config: { responseMimeType: 'application/json' }`.
2. **Single-Day AI Regeneration**: `regenerateSingleDay()` allows updating a single day based on specific prompt guidance without re-generating the entire multi-day trip.
3. **iCalendar Serialization**: `exportItineraryAsICal()` generates standard RFC-5545 `.ics` strings containing morning, afternoon, and evening events for native calendar import.
4. **Markdown Dossier Serialization**: `exportItineraryAsMarkdown()` builds a clean formatted brief for copying or archiving.
5. **Multi-Source Key Resolution**: Resolves custom browser keys from `localStorage` first, falling back to `VITE_GEMINI_API_KEY` or `process.env.GEMINI_API_KEY`.

---

### 5.3. Presentation & User Experience Layer

#### A. Interactive Stay Cards (`src/components/StayCard.tsx`)
- **In-Card Carousel**: Users can cycle through photos using overlay arrows and pagination dots without opening the modal.
- **Compare Checkbox**: Adds or removes the listing from the active comparison pool.
- **Zero Broken Image Fallback**: Falls back to an evocative CSS gradient backdrop displaying destination typography if external image links fail.

#### B. Property Comparison Engine (`src/components/CompareStaysModal.tsx`)
- Users can select up to 3 properties simultaneously.
- A floating action pill dock appears at the bottom of the viewport with a live counter.
- The modal renders a tabular view comparing nightly rates, guest capacities, bedrooms, baths, curated highlights, cancellation rules, and a full amenities matrix.

#### C. Multi-Step Checkout & Digital Boarding Pass
- **`BookingCheckoutModal.tsx`**: Calculates base price, nights, cleaning fees, service fees, and optional luxury add-ons (Private Chauffeur, Sommelier Cellar Access, Verified Carbon Offset).
- **`BookingVoucherModal.tsx`**: Renders a luxury travel pass complete with reference IDs, traveler names, dates, concierge contacts, price breakdowns, and a scalable vector QR code.
- **Print Formatting**: Optimized with `@media print` rules to print directly to physical paper or PDF.

#### D. Global Sanctuaries Atlas (`src/components/DestinationExplorerModal.tsx`)
- Interactive sidebar navigating 8 curated landscapes (Kyoto, Amalfi Coast, Swiss Alps, Santorini, Serengeti, Reykjavik, Bali, Patagonia).
- Displays average temperature, seasonal advice, gateway airport codes, and primary languages.
- Direct CTAs to filter the stays catalog or launch the AI Trip Architect for that region.

---

### 5.4. State Management & Persistence Strategy

The application avoids heavy external state libraries (Redux, Zustand) in favor of a clean **two-tier state architecture**:

1. **Reactive UI State (`useState`, `useMemo`)**:
   - Filter criteria (keyword search, max price range slider, category tabs, sort orders).
   - Active modals and drawer visibility flags.
   - Active itinerary day index and item completion checklist states.

2. **Durable Browser State (`localStorage`)**:
   - `auravoyage_saved_stays`: Persisted array of listing IDs for the private wishlist.
   - `auravoyage_bookings`: Persisted array of `BookingDetails` objects for the user's confirmed reservations.
   - `auravoyage_gemini_api_key`: Optional user-supplied Google Gemini API key.

---

## 6. Build Optimization & Bundler Architecture

The build pipeline leverages Vite 8 and Rolldown with strict vendor code-splitting configured in [`vite.config.ts`](file:///c:/Users/chand/OneDrive/Desktop/tripflow/tripflow-main/vite.config.ts):

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks(id: string) {
        if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
          return 'vendor-react';
        }
        if (id.includes('node_modules/lucide-react/')) {
          return 'vendor-icons';
        }
        if (id.includes('node_modules/@google/genai/')) {
          return 'vendor-genai';
        }
      },
    },
  },
}
```

### Production Bundle Size Distribution

| Chunk Name | Raw Size | Gzip Size | Contents |
| :--- | :--- | :--- | :--- |
| `index.html` | 1.59 kB | 0.65 kB | HTML5 shell, font preconnections |
| `index-[hash].css` | 57.48 kB | 9.53 kB | Compiled Tailwind v4 utility and theme CSS |
| `vendor-react-[hash].js` | 210.92 kB | 65.85 kB | React 19 core and React DOM runtime |
| `vendor-genai-[hash].js` | 375.56 kB | 67.75 kB | `@google/genai` client library |
| `vendor-icons-[hash].js` | 18.96 kB | 7.30 kB | Lucide SVG icon definitions |
| `index-[hash].js` | **189.21 kB** | **44.96 kB** | Core application, state, and component logic |

*Result: Initial application JS download is only **44.96 kB gzipped**, ensuring rapid First Contentful Paint (FCP) and optimal Core Web Vitals performance.*

---

## 7. Developer & Operational Workflows

### Available NPM Scripts
- `npm run dev`: Starts the Vite development server on port `3000` with host `0.0.0.0`.
- `npm run build`: Compiles TypeScript with Rolldown code-splitting into `/dist`.
- `npm run preview`: Serves the production bundle locally for validation.
- `npm run lint`: Executes `tsc --noEmit` across all workspace `.ts` and `.tsx` files.
- `npm run clean`: Cross-platform node script to remove `/dist`.

### Adding a New Destination or Listing
1. Add the domain model entry in [`src/data/mockData.ts`](file:///c:/Users/chand/OneDrive/Desktop/tripflow/tripflow-main/src/data/mockData.ts) under `MOCK_STAYS` or `MOCK_EXPEDITIONS`.
2. Ensure required coordinates, images, and category theme are supplied.
3. Add corresponding regional travel intelligence to `POPULAR_DESTINATIONS` and a multi-day itinerary to `PRESET_TRIP_PLANS`.
4. Run `npm run lint` to guarantee complete type contract adherence.
