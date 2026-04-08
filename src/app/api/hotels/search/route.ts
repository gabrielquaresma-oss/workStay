import { getOrCreateUser } from "@/lib/auth";
import { searchHotels, getPlaceDetails } from "@/lib/google-places";
import { getOrComputeStayScore } from "@/lib/sentiment-cache";
import { generatePrices } from "@/lib/price-simulator";
import type { HotelSearchResult, StayScoreWeights } from "@/types/hotel";

export async function GET(request: Request) {
  await getOrCreateUser();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  // Parse optional custom weights
  let customWeights: StayScoreWeights | undefined;
  const weightsParam = searchParams.get("weights");
  if (weightsParam) {
    try {
      const parsed = JSON.parse(decodeURIComponent(weightsParam));
      const keys: (keyof StayScoreWeights)[] = [
        "wifi", "workspace_room", "workspace_hotel",
        "coworking_proximity", "price_productivity", "traveler_rating",
      ];
      if (keys.every((k) => typeof parsed[k] === "number")) {
        const sum = keys.reduce((s, k) => s + parsed[k], 0);
        if (sum > 0) {
          customWeights = {} as StayScoreWeights;
          for (const k of keys) {
            customWeights[k] = parsed[k] / sum;
          }
        }
      }
    } catch {
      // Ignore malformed weights, use defaults
    }
  }

  if (!query) {
    return Response.json({ error: "Parâmetro 'q' é obrigatório" }, { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Search Google Places for hotels
        const places = await searchHotels(query, 20);
        let emitted = 0;

        // Process in batches of 5, stream each result as it completes
        for (let i = 0; i < places.length; i += 5) {
          const batch = places.slice(i, i + 5);
          const batchResults = await Promise.all(
            batch.map(async (place): Promise<HotelSearchResult | null> => {
              try {
                const details = await getPlaceDetails(place.id);

                const reviews = (details.reviews ?? []).map((r) => ({
                  text: r.text?.text ?? "",
                  rating: r.rating,
                  authorName: r.authorAttribution?.displayName,
                  publishTime: r.publishTime,
                }));

                const city = query.split(",")[0]?.trim() ?? query;

                const { stayScore } = await getOrComputeStayScore({
                  placeId: place.id,
                  hotelName: details.displayName?.text ?? "",
                  address: details.formattedAddress ?? "",
                  city,
                  latitude: details.location?.latitude ?? 0,
                  longitude: details.location?.longitude ?? 0,
                  googleRating: details.rating ?? null,
                  googleTotalReviews: details.userRatingCount ?? null,
                  photoReferences: (details.photos ?? []).map((p) => p.name),
                  reviews,
                  customWeights,
                });

                // Generate simulated price
                const prices = generatePrices(
                  details.displayName?.text ?? "",
                  city,
                  new Date(),
                  3
                );
                const todayPrice = prices.find(
                  (p) => p.date === new Date().toISOString().slice(0, 10)
                );

                return {
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
              } catch {
                return null;
              }
            })
          );

          // Stream each result from this batch
          for (const result of batchResults) {
            if (!result) continue;
            controller.enqueue(
              encoder.encode(
                JSON.stringify({ type: "hotel", data: result }) + "\n"
              )
            );
            emitted++;
          }
        }

        // Signal completion
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: "done", total: emitted }) + "\n"
          )
        );
      } catch (error) {
        console.error("Hotel search error:", error);
        controller.enqueue(
          encoder.encode(
            JSON.stringify({ type: "error", message: "Erro ao buscar hotéis. Tente novamente." }) + "\n"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
