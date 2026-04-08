import { getOrCreateUser } from "@/lib/auth";
import { getPlaceDetails, searchNearby } from "@/lib/google-places";
import client from "@/lib/claude-client";

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function isWorkFriendlyCafe(
  name: string,
  reviews: { text: string }[]
): Promise<{ friendly: boolean; score: number }> {
  if (reviews.length === 0) return { friendly: true, score: 0.5 };

  try {
    const reviewTexts = reviews
      .slice(0, 5)
      .map((r) => r.text)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Is "${name}" a good place to work from? Rate work-friendliness from 0 to 1 based on these reviews. Return only JSON: {"work_friendly_score": 0.7}\n\nReviews:\n${reviewTexts}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return { friendly: true, score: 0.5 };

    const match = textBlock.text.match(/\{[\s\S]*\}/);
    if (!match) return { friendly: true, score: 0.5 };

    const data = JSON.parse(match[0]);
    const score = data.work_friendly_score ?? 0.5;
    return { friendly: score > 0.5, score };
  } catch {
    return { friendly: true, score: 0.5 };
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await getOrCreateUser();

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const radius = Number(searchParams.get("radius") || "1000");
  const types = (searchParams.get("types") || "coworking,cafe").split(",");

  try {
    // Get hotel coordinates
    const hotel = await getPlaceDetails(id);
    const hotelLat = hotel.location?.latitude ?? 0;
    const hotelLng = hotel.location?.longitude ?? 0;

    const workspaces: {
      id: string;
      name: string;
      type: "COWORKING" | "CAFE";
      address: string;
      latitude: number;
      longitude: number;
      distance_meters: number;
      google_rating: number | null;
      total_reviews: number | null;
      opening_hours: string[] | null;
      has_wifi: boolean;
      has_power_outlets: boolean;
      is_quiet: boolean;
    }[] = [];

    // Search nearby coworkings
    if (types.includes("coworking")) {
      const coworkings = await searchNearby(
        hotelLat,
        hotelLng,
        "coworking_space",
        radius
      );
      for (const place of coworkings) {
        workspaces.push({
          id: place.id,
          name: place.displayName?.text ?? "",
          type: "COWORKING",
          address: place.formattedAddress ?? "",
          latitude: place.location?.latitude ?? 0,
          longitude: place.location?.longitude ?? 0,
          distance_meters: haversineDistance(
            hotelLat,
            hotelLng,
            place.location?.latitude ?? 0,
            place.location?.longitude ?? 0
          ),
          google_rating: place.rating ?? null,
          total_reviews: place.userRatingCount ?? null,
          opening_hours:
            place.regularOpeningHours?.weekdayDescriptions ?? null,
          has_wifi: true, // Assumed for coworkings
          has_power_outlets: true,
          is_quiet: true,
        });
      }
    }

    // Search nearby cafes
    if (types.includes("cafe")) {
      const cafes = await searchNearby(hotelLat, hotelLng, "cafe", radius);

      // Filter cafes by work-friendliness
      for (const place of cafes.slice(0, 10)) {
        const reviews = (place.reviews ?? []).map((r) => ({
          text: r.text?.text ?? "",
        }));
        const { friendly, score } = await isWorkFriendlyCafe(
          place.displayName?.text ?? "",
          reviews
        );

        if (friendly || score > 0.5) {
          workspaces.push({
            id: place.id,
            name: place.displayName?.text ?? "",
            type: "CAFE",
            address: place.formattedAddress ?? "",
            latitude: place.location?.latitude ?? 0,
            longitude: place.location?.longitude ?? 0,
            distance_meters: haversineDistance(
              hotelLat,
              hotelLng,
              place.location?.latitude ?? 0,
              place.location?.longitude ?? 0
            ),
            google_rating: place.rating ?? null,
            total_reviews: place.userRatingCount ?? null,
            opening_hours:
              place.regularOpeningHours?.weekdayDescriptions ?? null,
            has_wifi: score > 0.6,
            has_power_outlets: score > 0.7,
            is_quiet: score > 0.8,
          });
        }
      }
    }

    // Sort by distance
    workspaces.sort((a, b) => a.distance_meters - b.distance_meters);

    return Response.json({ workspaces });
  } catch (error) {
    console.error("Nearby workspaces error:", error);
    return Response.json(
      { error: "Erro ao buscar espaços próximos" },
      { status: 500 }
    );
  }
}
