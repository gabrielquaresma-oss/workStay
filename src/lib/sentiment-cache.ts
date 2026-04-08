import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { analyzeReviews, type SentimentResult } from "./sentiment-analyzer";
import { calculateStayScore } from "./stayscore-calculator";
import type { StayScoreResult, StayScoreWeights } from "@/types/hotel";

interface ReviewInput {
  text: string;
  rating: number;
  authorName?: string;
  publishTime?: string;
}

interface CacheInput {
  placeId: string;
  hotelName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  googleRating: number | null;
  googleTotalReviews: number | null;
  photoReferences: string[];
  reviews: ReviewInput[];
  customWeights?: StayScoreWeights;
}

interface CacheResult {
  sentiment: SentimentResult;
  stayScore: StayScoreResult;
  fromCache: boolean;
}

/**
 * Get a cached StayScore or compute + cache a new one.
 * Checks DB for a valid (non-expired) StayScore first.
 */
export async function getOrComputeStayScore(
  input: CacheInput
): Promise<CacheResult> {
  // 1. Upsert hotel row
  const hotel = await prisma.hotel.upsert({
    where: { google_place_id: input.placeId },
    update: {
      name: input.hotelName,
      address: input.address,
      google_rating: input.googleRating,
      google_total_reviews: input.googleTotalReviews,
      photo_references: input.photoReferences,
    },
    create: {
      google_place_id: input.placeId,
      name: input.hotelName,
      address: input.address,
      city: input.city,
      state: "",
      latitude: input.latitude,
      longitude: input.longitude,
      google_rating: input.googleRating,
      google_total_reviews: input.googleTotalReviews,
      photo_references: input.photoReferences,
    },
  });

  // 2. Check for valid cached score
  const cachedScore = await prisma.stayScore.findFirst({
    where: {
      hotel_id: hotel.id,
      expires_at: { gt: new Date() },
    },
    orderBy: { calculated_at: "desc" },
  });

  if (cachedScore) {
    // Reconstruct sentiment from cached hotel reviews
    const cachedReviews = await prisma.hotelReview.findMany({
      where: { hotel_id: hotel.id, sentiment_analysis: { not: Prisma.JsonNullValueFilter.DbNull } },
      orderBy: { created_at: "desc" },
    });

    const sentiment = reconstructSentiment(cachedReviews);

    const stayScore: StayScoreResult = {
      total_score: cachedScore.total_score,
      breakdown: {
        wifi_score: cachedScore.wifi_score,
        workspace_room_score: cachedScore.workspace_room_score,
        workspace_hotel_score: cachedScore.workspace_hotel_score,
        coworking_proximity_score: cachedScore.coworking_proximity_score,
        price_productivity_score: cachedScore.price_productivity_score,
        traveler_rating_score: cachedScore.traveler_rating_score,
      },
      reviews_analyzed: cachedScore.reviews_analyzed,
      surveys_count: cachedScore.surveys_count,
      calculated_at: cachedScore.calculated_at.toISOString(),
      expires_at: cachedScore.expires_at.toISOString(),
    };

    return { sentiment, stayScore, fromCache: true };
  }

  // 3. No cache — compute fresh
  const sentiment = await analyzeReviews(input.hotelName, input.reviews);

  const stayScore = calculateStayScore({
    sentiment,
    surveys: [],
    googleRating: input.googleRating,
    amenities: null,
    starCategory: null,
    nearbyWorkspaces: [],
    avgPricePerNight: null,
    cityAvgPrice: null,
    customWeights: input.customWeights,
  });

  // 4. Persist to DB (fire-and-forget to not slow down response)
  persistCache(hotel.id, input.reviews, sentiment, stayScore).catch((err) =>
    console.error("Failed to persist cache:", err)
  );

  return { sentiment, stayScore, fromCache: false };
}

async function persistCache(
  hotelId: string,
  reviews: ReviewInput[],
  sentiment: SentimentResult,
  stayScore: StayScoreResult
) {
  // Delete old reviews and re-create for simplicity
  await prisma.hotelReview.deleteMany({ where: { hotel_id: hotelId } });

  if (reviews.length > 0) {
    await prisma.hotelReview.createMany({
      data: reviews.map((r, i) => ({
        hotel_id: hotelId,
        author_name: r.authorName ?? "Anônimo",
        rating: r.rating,
        text: r.text,
        publish_time: r.publishTime ? new Date(r.publishTime) : null,
        sentiment_analysis: sentiment.reviews[i]
          ? (sentiment.reviews[i] as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        is_work_relevant:
          (sentiment.reviews[i]?.overall_work_relevance ?? 0) > 0.4,
        work_relevance_score:
          sentiment.reviews[i]?.overall_work_relevance ?? 0,
        analyzed_at: new Date(),
      })),
    });
  }

  await prisma.stayScore.create({
    data: {
      hotel_id: hotelId,
      total_score: stayScore.total_score,
      wifi_score: stayScore.breakdown.wifi_score,
      workspace_room_score: stayScore.breakdown.workspace_room_score,
      workspace_hotel_score: stayScore.breakdown.workspace_hotel_score,
      coworking_proximity_score:
        stayScore.breakdown.coworking_proximity_score,
      price_productivity_score:
        stayScore.breakdown.price_productivity_score,
      traveler_rating_score: stayScore.breakdown.traveler_rating_score,
      reviews_analyzed: stayScore.reviews_analyzed,
      surveys_count: stayScore.surveys_count,
      data_sources: { google_reviews: reviews.length, surveys: 0 },
      calculated_at: new Date(stayScore.calculated_at),
      expires_at: new Date(stayScore.expires_at),
    },
  });
}

function reconstructSentiment(
  cachedReviews: { sentiment_analysis: unknown; work_relevance_score: number | null }[]
): SentimentResult {
  if (cachedReviews.length === 0) {
    return {
      reviews: [],
      aggregated: {
        wifi: 0.5,
        workspace_room: 0.5,
        workspace_hotel: 0.5,
        noise: 0.5,
        location_business: 0.5,
        overall_work_relevance: 0,
      },
    };
  }

  const reviews = cachedReviews
    .filter((r) => r.sentiment_analysis)
    .map((r) => {
      const sa = r.sentiment_analysis as Record<string, unknown>;
      return {
        text_snippet: (sa.text_snippet as string) ?? "",
        criteria: (sa.criteria as {
          wifi: number;
          workspace_room: number;
          workspace_hotel: number;
          noise: number;
          location_business: number;
        }) ?? { wifi: 0.5, workspace_room: 0.5, workspace_hotel: 0.5, noise: 0.5, location_business: 0.5 },
        overall_work_relevance:
          (sa.overall_work_relevance as number) ?? r.work_relevance_score ?? 0,
      };
    });

  // Aggregate
  const count = reviews.length || 1;
  const aggregated = {
    wifi: reviews.reduce((s, r) => s + r.criteria.wifi, 0) / count,
    workspace_room:
      reviews.reduce((s, r) => s + r.criteria.workspace_room, 0) / count,
    workspace_hotel:
      reviews.reduce((s, r) => s + r.criteria.workspace_hotel, 0) / count,
    noise: reviews.reduce((s, r) => s + r.criteria.noise, 0) / count,
    location_business:
      reviews.reduce((s, r) => s + r.criteria.location_business, 0) / count,
    overall_work_relevance:
      reviews.reduce((s, r) => s + r.overall_work_relevance, 0) / count,
  };

  return { reviews, aggregated };
}
