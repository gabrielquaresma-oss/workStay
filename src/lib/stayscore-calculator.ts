import type { ScoreBreakdown, StayScoreResult } from "@/types/hotel";
import type { SentimentResult } from "./sentiment-analyzer";

// Weights for each sub-score
const WEIGHTS = {
  wifi: 0.25,
  workspace_room: 0.20,
  workspace_hotel: 0.15,
  coworking_proximity: 0.15,
  price_productivity: 0.15,
  traveler_rating: 0.10,
} as const;

interface SurveyData {
  wifi_rating: number; // 1-5
  workspace_adequate: "SIM" | "PARCIAL" | "NAO";
  silence_rating: number; // 1-5
  would_recommend: "SIM" | "TALVEZ" | "NAO";
}

interface NearbyWorkspaceData {
  distance_meters: number;
  google_rating: number | null;
}

interface CalculatorInput {
  sentiment: SentimentResult | null;
  surveys: SurveyData[];
  googleRating: number | null;
  amenities: Record<string, unknown> | null;
  starCategory: number | null;
  nearbyWorkspaces: NearbyWorkspaceData[];
  avgPricePerNight: number | null;
  cityAvgPrice: number | null;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Wi-Fi score: review sentiment (60%) + survey wifi_rating (weight grows with volume) + amenity bonus
 */
function calculateWifiScore(
  sentiment: SentimentResult | null,
  surveys: SurveyData[],
  amenities: Record<string, unknown> | null
): number {
  // Review sentiment component (0-1 → 0-100)
  const sentimentScore = sentiment ? sentiment.aggregated.wifi * 100 : 50;

  // Survey component — weight grows with volume: 20% at 1 survey, up to 70% at 10+
  let surveyScore = 50;
  let surveyWeight = 0;
  if (surveys.length > 0) {
    const avgWifi =
      surveys.reduce((sum, s) => sum + s.wifi_rating, 0) / surveys.length;
    surveyScore = (avgWifi / 5) * 100;
    surveyWeight = Math.min(0.7, 0.2 + surveys.length * 0.05);
  }

  const sentimentWeight = 1 - surveyWeight;
  let score = sentimentScore * (sentiment ? sentimentWeight * 0.6 / sentimentWeight : 0.6) +
    surveyScore * surveyWeight;

  // Simplified: blend sentiment 60% base, survey grows
  if (surveys.length > 0 && sentiment) {
    score = sentimentScore * (0.6 * (1 - surveyWeight)) + surveyScore * surveyWeight + sentimentScore * 0.6 * surveyWeight;
    // Re-approach: simpler formula
    score = sentimentScore * 0.6 + surveyScore * 0.4;
    // Adjust survey influence based on volume
    const surveyInfluence = Math.min(0.7, 0.2 + surveys.length * 0.05);
    score = sentimentScore * (1 - surveyInfluence) + surveyScore * surveyInfluence;
  } else if (surveys.length > 0) {
    score = surveyScore;
  } else if (sentiment) {
    score = sentimentScore;
  }

  // Amenity bonus: +5 if wifi mentioned in amenities
  const hasWifiAmenity =
    amenities &&
    JSON.stringify(amenities).toLowerCase().includes("wifi");
  if (hasWifiAmenity) {
    score += 5;
  }

  return clamp(score);
}

/**
 * Room workspace score: review sentiment + survey workspace_adequate + category bonus
 */
function calculateRoomWorkspaceScore(
  sentiment: SentimentResult | null,
  surveys: SurveyData[],
  starCategory: number | null
): number {
  const sentimentScore = sentiment
    ? sentiment.aggregated.workspace_room * 100
    : 50;

  let surveyScore = 50;
  if (surveys.length > 0) {
    const adequacyScores = surveys.map((s) => {
      if (s.workspace_adequate === "SIM") return 100;
      if (s.workspace_adequate === "PARCIAL") return 50;
      return 10;
    });
    surveyScore =
      adequacyScores.reduce((a, b) => a + b, 0) / adequacyScores.length;
  }

  let score: number;
  if (surveys.length > 0 && sentiment) {
    const surveyInfluence = Math.min(0.7, 0.2 + surveys.length * 0.05);
    score = sentimentScore * (1 - surveyInfluence) + surveyScore * surveyInfluence;
  } else if (surveys.length > 0) {
    score = surveyScore;
  } else if (sentiment) {
    score = sentimentScore;
  } else {
    score = 50;
  }

  // Category bonus: +10 for 4-5 star hotels
  if (starCategory && starCategory >= 4) {
    score += 10;
  }

  return clamp(score);
}

/**
 * Hotel workspace score: review sentiment for workspace_hotel
 */
function calculateHotelWorkspaceScore(
  sentiment: SentimentResult | null
): number {
  if (!sentiment) return 50;
  return clamp(sentiment.aggregated.workspace_hotel * 100);
}

/**
 * Coworking proximity score: count (max 40pts) + closest distance (max 30pts) + avg rating (max 30pts)
 */
function calculateCoworkingProximityScore(
  nearbyWorkspaces: NearbyWorkspaceData[]
): number {
  if (nearbyWorkspaces.length === 0) return 0;

  // Count score: max 40pts, 10pts per workspace up to 4
  const countScore = Math.min(40, nearbyWorkspaces.length * 10);

  // Closest distance score: max 30pts
  // 0m = 30pts, 500m = 15pts, 1000m+ = 0pts
  const closestDistance = Math.min(
    ...nearbyWorkspaces.map((w) => w.distance_meters)
  );
  const distanceScore = clamp(30 * (1 - closestDistance / 1000), 0, 30);

  // Average rating score: max 30pts (1-5 → 0-30)
  const ratings = nearbyWorkspaces
    .filter((w) => w.google_rating != null)
    .map((w) => w.google_rating!);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 3;
  const ratingScore = ((avgRating - 1) / 4) * 30;

  return clamp(countScore + distanceScore + ratingScore);
}

/**
 * Price-productivity score: efficiency index = avgProductivity / normalizedPrice
 */
function calculatePriceProductivityScore(
  avgPricePerNight: number | null,
  cityAvgPrice: number | null,
  currentSubScores: { wifi: number; room: number; hotel: number }
): number {
  if (!avgPricePerNight || !cityAvgPrice || cityAvgPrice === 0) return 50;

  const avgProductivity =
    (currentSubScores.wifi + currentSubScores.room + currentSubScores.hotel) / 3;
  const normalizedPrice = avgPricePerNight / cityAvgPrice;

  if (normalizedPrice === 0) return 50;

  // Efficiency index: higher is better
  const efficiency = avgProductivity / (normalizedPrice * 100);
  // Map efficiency to 0-100: efficiency of 1.0 = 50pts, 2.0 = 100pts, 0.5 = 25pts
  const score = efficiency * 50;

  return clamp(score);
}

/**
 * Traveler rating score: Google rating (1-5 → 0-100) blended with survey would_recommend
 */
function calculateTravelerRatingScore(
  googleRating: number | null,
  surveys: SurveyData[]
): number {
  // Google rating component: 1-5 → 0-100
  const googleScore = googleRating ? ((googleRating - 1) / 4) * 100 : 50;

  // Survey would_recommend component
  let recommendScore = 50;
  if (surveys.length > 0) {
    const recScores = surveys.map((s) => {
      if (s.would_recommend === "SIM") return 100;
      if (s.would_recommend === "TALVEZ") return 50;
      return 10;
    });
    recommendScore = recScores.reduce((a, b) => a + b, 0) / recScores.length;
  }

  if (surveys.length > 0) {
    return clamp(googleScore * 0.6 + recommendScore * 0.4);
  }
  return clamp(googleScore);
}

/**
 * Main StayScore calculator — returns total score (0-100) and 6 sub-scores.
 */
export function calculateStayScore(input: CalculatorInput): StayScoreResult {
  const wifiScore = calculateWifiScore(
    input.sentiment,
    input.surveys,
    input.amenities
  );

  const roomWorkspaceScore = calculateRoomWorkspaceScore(
    input.sentiment,
    input.surveys,
    input.starCategory
  );

  const hotelWorkspaceScore = calculateHotelWorkspaceScore(input.sentiment);

  const coworkingProximityScore = calculateCoworkingProximityScore(
    input.nearbyWorkspaces
  );

  const priceProductivityScore = calculatePriceProductivityScore(
    input.avgPricePerNight,
    input.cityAvgPrice,
    {
      wifi: wifiScore,
      room: roomWorkspaceScore,
      hotel: hotelWorkspaceScore,
    }
  );

  const travelerRatingScore = calculateTravelerRatingScore(
    input.googleRating,
    input.surveys
  );

  const breakdown: ScoreBreakdown = {
    wifi_score: Math.round(wifiScore),
    workspace_room_score: Math.round(roomWorkspaceScore),
    workspace_hotel_score: Math.round(hotelWorkspaceScore),
    coworking_proximity_score: Math.round(coworkingProximityScore),
    price_productivity_score: Math.round(priceProductivityScore),
    traveler_rating_score: Math.round(travelerRatingScore),
  };

  const totalScore = Math.round(
    wifiScore * WEIGHTS.wifi +
      roomWorkspaceScore * WEIGHTS.workspace_room +
      hotelWorkspaceScore * WEIGHTS.workspace_hotel +
      coworkingProximityScore * WEIGHTS.coworking_proximity +
      priceProductivityScore * WEIGHTS.price_productivity +
      travelerRatingScore * WEIGHTS.traveler_rating
  );

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return {
    total_score: clamp(totalScore),
    breakdown,
    reviews_analyzed: input.sentiment?.reviews.length ?? 0,
    surveys_count: input.surveys.length,
    calculated_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  };
}
