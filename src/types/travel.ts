export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface CurrencyRate {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD
}

export type CategoryTheme = 'all' | 'coastal' | 'alpine' | 'cultural' | 'safari' | 'nordic';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  content: string;
  tripType: string;
}

export interface StayListing {
  id: string;
  title: string;
  subtitle: string;
  destination: string;
  country: string;
  region: string;
  category: CategoryTheme;
  pricePerNight: number; // in USD
  rating: number;
  reviewCount: number;
  images: string[];
  gradientTheme: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  badge?: string;
  description: string;
  highlights: string[];
  amenities: string[];
  host: {
    name: string;
    role: string;
    avatar: string;
    superhost: boolean;
    responseRate: string;
  };
  cleaningFee: number;
  serviceFeePercent: number;
  cancellationPolicy: string;
  coordinates: { lat: number; lng: number };
  reviews: Review[];
}

export interface ExpeditionListing {
  id: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  groupSizeMax: number;
  priceTotal: number;
  rating: number;
  reviewCount: number;
  category: CategoryTheme;
  images: string[];
  gradientTheme: string;
  difficulty: 'Relaxed' | 'Moderate' | 'Challenging';
  description: string;
  included: string[];
  itinerarySummary: { day: number; title: string; desc: string }[];
}

export interface FlightOffer {
  id: string;
  airline: string;
  flightNumber: string;
  airlineLogo: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  cabinClass: 'Economy' | 'Premium' | 'Business';
  aircraft: string;
  co2Kg: number;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr?: string;
  title: string;
  theme: string;
  morning: { activity: string; location: string; notes: string };
  afternoon: { activity: string; location: string; notes: string };
  evening: { activity: string; location: string; notes: string };
  culinaryHighlight: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  durationDays: number;
  style: string;
  budget: 'Comfort' | 'Boutique Luxury' | 'Ultra Luxury';
  days: ItineraryDay[];
  localInsiderTips: string[];
  packingAdvice: string[];
}

export interface BookingDetails {
  bookingId: string;
  listingId: string;
  listingTitle: string;
  listingLocation: string;
  listingImage: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  primaryGuestName: string;
  primaryGuestEmail: string;
  primaryGuestPhone: string;
  specialRequests?: string;
  baseAmount: number;
  cleaningFee: number;
  serviceFee: number;
  addonsAmount: number;
  totalAmount: number;
  currency: Currency;
  status: 'Confirmed' | 'Pending';
  createdAt: string;
}
