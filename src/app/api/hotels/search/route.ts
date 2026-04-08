import { getOrCreateUser } from "@/lib/auth";
import { searchHotels, getPlaceDetails } from "@/lib/google-places";
import { analyzeReviews } from "@/lib/sentiment-analyzer";
import { calculateStayScore } from "@/lib/stayscore-calculator";
import { generatePrices } from "@/lib/price-simulator";
import type { HotelSearchResult } from "@/types/hotel";

export async function GET(request: Request) {
  await getOrCreateUser();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const minScore = Number(searchParams.get("min_score") || "0");
  const maxPrice = Number(searchParams.get("max_price") || "0");
  const sort = searchParams.get("sort") || "stayscore";

  if (!query) {
    return Response.json({ error: "Parâmetro 'q' é obrigatório" }, { status: 400 });
  }

  try {
    // Search Google Places for hotels
    const places = await searchHotels(query, 20);

    // Get details and calculate scores in parallel batches of 5
    const results: HotelSearchResult[] = [];
    for (let i = 0; i < places.length; i += 5) {
      const batch = places.slice(i, i + 5);
      const batchResults = await Promise.all(
        batch.map(async (place) => {
          try {
            const details = await getPlaceDetails(place.id);

            // Analyze reviews for work-relevant sentiment
            const reviews = (details.reviews ?? []).map((r) => ({
              text: r.text?.text ?? "",
              rating: r.rating,
            }));
            const sentiment = await analyzeReviews(
              details.displayName?.text ?? "",
              reviews
            );

            // Calculate StayScore
            const stayScore = calculateStayScore({
              sentiment,
              surveys: [],
              googleRating: details.rating ?? null,
              amenities: null,
              starCategory: null,
              nearbyWorkspaces: [],
              avgPricePerNight: null,
              cityAvgPrice: null,
            });

            // Generate simulated price
            const city = query.split(",")[0]?.trim() ?? query;
            const prices = generatePrices(
              details.displayName?.text ?? "",
              city,
              new Date(),
              3
            );
            const todayPrice = prices.find(
              (p) => p.date === new Date().toISOString().slice(0, 10)
            );

            const result: HotelSearchResult = {
              hotel: {
                id: place.id,
                google_place_id: place.id,
                name: details.displayName?.text ?? "",
                address: details.formattedAddress ?? "",
                city,
                state: "",
                latitude: details.location?.latitude ?? 0,
                longitude: details.location?.longitude ?? 0,
                google_rating: details.rating ?? null,
                google_total_reviews: details.userRatingCount ?? null,
                photo_references: (details.photos ?? []).map((p) => p.name),
                amenities: null,
              },
              stayscore: stayScore,
              price_per_night: todayPrice?.price ?? null,
              highlights: [],
            };

            return result;
          } catch {
            return null;
          }
        })
      );
      results.push(
        ...(batchResults.filter(Boolean) as HotelSearchResult[])
      );
    }

    // Apply filters
    let filtered = results;
    if (minScore > 0) {
      filtered = filtered.filter(
        (r) => (r.stayscore?.total_score ?? 0) >= minScore
      );
    }
    if (maxPrice > 0) {
      filtered = filtered.filter(
        (r) => (r.price_per_night ?? 0) <= maxPrice
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sort === "price") {
        return (a.price_per_night ?? Infinity) - (b.price_per_night ?? Infinity);
      }
      if (sort === "value") {
        const valueA =
          (a.stayscore?.total_score ?? 0) / (a.price_per_night ?? 1);
        const valueB =
          (b.stayscore?.total_score ?? 0) / (b.price_per_night ?? 1);
        return valueB - valueA;
      }
      // Default: stayscore
      return (
        (b.stayscore?.total_score ?? 0) - (a.stayscore?.total_score ?? 0)
      );
    });

    return Response.json({ hotels: filtered, total: filtered.length });
  } catch (error) {
    console.error("Hotel search error:", error);
    return Response.json(
      { error: "Erro ao buscar hotéis. Tente novamente." },
      { status: 500 }
    );
  }
}
