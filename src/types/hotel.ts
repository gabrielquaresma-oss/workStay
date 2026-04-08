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
