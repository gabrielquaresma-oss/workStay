export interface ScoreBreakdown {
  wifi_score: number;
  workspace_room_score: number;
  workspace_hotel_score: number;
  coworking_proximity_score: number;
  price_productivity_score: number;
  traveler_rating_score: number;
}

export interface StayScoreResult {
  total_score: number;
  breakdown: ScoreBreakdown;
  reviews_analyzed: number;
  surveys_count: number;
  calculated_at: string;
  expires_at: string;
}

export interface Hotel {
  id: string;
  google_place_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  google_rating: number | null;
  google_total_reviews: number | null;
  photo_references: string[];
  amenities: Record<string, unknown> | null;
}

export interface HotelSearchResult {
  hotel: Hotel;
  stayscore: StayScoreResult | null;
  price_per_night: number | null;
  highlights: string[];
}

export interface FeaturedHotelCard {
  id: string;
  name: string;
  location: string;
  imageUrl: string | null;
  workScore: number;
  scoreColor: "green" | "yellow" | "red";
  tags: string[];
  pricePerNight: number | null;
}

export interface FeaturedSection {
  id: string;
  title: string;
  badge: string;
  badgeVariant: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
  hotels: FeaturedHotelCard[];
}

export interface StayScoreWeights {
  wifi: number;
  workspace_room: number;
  workspace_hotel: number;
  coworking_proximity: number;
  price_productivity: number;
  traveler_rating: number;
}

export interface PromptInterpretation {
  destination: string;
  weights: StayScoreWeights;
  priorities_summary: string;
  search_query: string;
  original_prompt: string;
  confidence: number;
}

export type SearchStreamMessage =
  | { type: "hotel"; data: HotelSearchResult }
  | { type: "done"; total: number }
  | { type: "error"; message: string };
