import type { GooglePlaceResult, GoogleNearbyResult } from "@/types/google-places";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
const BASE_URL = "https://places.googleapis.com/v1";

const headers = () => ({
  "Content-Type": "application/json",
  "X-Goog-Api-Key": API_KEY,
});

/**
 * Search hotels via Google Places (New) Text Search.
 */
export async function searchHotels(
  query: string,
  maxResults = 20
): Promise<GooglePlaceResult[]> {
  const res = await fetch(`${BASE_URL}/places:searchText`, {
    method: "POST",
    headers: {
      ...headers(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.photos,places.types",
    },
    body: JSON.stringify({
      textQuery: query,
      includedType: "hotel",
      languageCode: "pt-BR",
      maxResultCount: maxResults,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google Places searchText failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.places ?? [];
}

/**
 * Get full details for a single place by ID.
 */
export async function getPlaceDetails(
  placeId: string
): Promise<GooglePlaceResult> {
  const fieldMask =
    "id,displayName,formattedAddress,location,rating,userRatingCount,reviews,photos,types";
  const res = await fetch(`${BASE_URL}/places/${placeId}`, {
    method: "GET",
    headers: {
      ...headers(),
      "X-Goog-FieldMask": fieldMask,
    },
  });

  if (!res.ok) {
    throw new Error(`Google Places getPlaceDetails failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Search nearby places within a radius of a coordinate.
 */
export async function searchNearby(
  lat: number,
  lng: number,
  type: string,
  radius = 1000
): Promise<GooglePlaceResult[]> {
  const res = await fetch(`${BASE_URL}/places:searchNearby`, {
    method: "POST",
    headers: {
      ...headers(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.reviews,places.photos,places.types,places.regularOpeningHours",
    },
    body: JSON.stringify({
      includedTypes: [type],
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius,
        },
      },
      languageCode: "pt-BR",
      maxResultCount: 20,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google Places searchNearby failed: ${res.status} ${res.statusText}`);
  }

  const data: GoogleNearbyResult = await res.json();
  return data.places ?? [];
}

/**
 * Build a photo URL from a Google Places photo resource name.
 */
export function getPhotoUrl(
  photoName: string,
  maxWidthPx = 800
): string {
  return `${BASE_URL}/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
