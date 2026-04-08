import { getOrCreateUser } from "@/lib/auth";
import { getPlaceDetails, getPhotoUrl } from "@/lib/google-places";
import { getOrComputeStayScore } from "@/lib/sentiment-cache";
import { generatePrices } from "@/lib/price-simulator";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getOrCreateUser();

  const { id } = await params;

  try {
    // Fetch place details from Google
    const details = await getPlaceDetails(id);

    const reviews = (details.reviews ?? []).map((r) => ({
      text: r.text?.text ?? "",
      rating: r.rating,
      authorName: r.authorAttribution?.displayName,
      publishTime: r.publishTime,
    }));

    // Use cached score or compute fresh
    const { sentiment, stayScore } = await getOrComputeStayScore({
      placeId: id,
      hotelName: details.displayName?.text ?? "",
      address: details.formattedAddress ?? "",
      city: "",
      latitude: details.location?.latitude ?? 0,
      longitude: details.location?.longitude ?? 0,
      googleRating: details.rating ?? null,
      googleTotalReviews: details.userRatingCount ?? null,
      photoReferences: (details.photos ?? []).map((p) => p.name),
      reviews,
    });

    // Generate photo URLs
    const photoUrls = (details.photos ?? [])
      .slice(0, 5)
      .map((p) => getPhotoUrl(p.name));

    // Generate simulated prices
    const prices = generatePrices(
      details.displayName?.text ?? "",
      "",
      new Date(),
      7
    );

    // Build review list with work relevance
    const analyzedReviews = (details.reviews ?? []).map((r, i) => {
      const reviewSentiment = sentiment.reviews[i];
      return {
        author_name: r.authorAttribution?.displayName ?? "Anônimo",
        rating: r.rating,
        text: r.text?.text ?? "",
        publish_time: r.publishTime ?? null,
        relative_time: r.relativePublishTimeDescription ?? "",
        is_work_relevant: (reviewSentiment?.overall_work_relevance ?? 0) > 0.4,
        work_relevance_score: reviewSentiment?.overall_work_relevance ?? 0,
        sentiment_analysis: reviewSentiment?.criteria ?? null,
      };
    });

    // Sort reviews: work-relevant first, then by relevance score
    analyzedReviews.sort((a, b) => {
      if (a.is_work_relevant && !b.is_work_relevant) return -1;
      if (!a.is_work_relevant && b.is_work_relevant) return 1;
      return b.work_relevance_score - a.work_relevance_score;
    });

    return Response.json({
      hotel: {
        id: details.id,
        google_place_id: details.id,
        name: details.displayName?.text ?? "",
        address: details.formattedAddress ?? "",
        latitude: details.location?.latitude ?? 0,
        longitude: details.location?.longitude ?? 0,
        google_rating: details.rating ?? null,
        google_total_reviews: details.userRatingCount ?? null,
        photo_urls: photoUrls,
        types: details.types ?? [],
      },
      stayscore: stayScore,
      reviews: analyzedReviews,
      prices,
    });
  } catch (error) {
    console.error("Hotel detail error:", error);
    return Response.json(
      { error: "Erro ao buscar detalhes do hotel" },
      { status: 500 }
    );
  }
}
