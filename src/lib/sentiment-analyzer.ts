import client from "./claude-client";

interface ReviewInput {
  text: string;
  rating: number;
}

interface CriteriaSentiment {
  wifi: number;
  workspace_room: number;
  workspace_hotel: number;
  noise: number;
  location_business: number;
}

export interface SentimentResult {
  reviews: {
    text_snippet: string;
    criteria: CriteriaSentiment;
    overall_work_relevance: number;
  }[];
  aggregated: CriteriaSentiment & { overall_work_relevance: number };
}

const SYSTEM_PROMPT = `You are a hotel review analyzer for corporate business travelers.
Analyze each review and extract sentiment scores (0 to 1, where 0 is very negative and 1 is very positive) for these work-relevant criteria:

- wifi: Quality and reliability of internet/Wi-Fi for work
- workspace_room: Adequacy of the room as a workspace (desk, chair, lighting, power outlets)
- workspace_hotel: Hotel common areas for working (lobby, business center, meeting rooms)
- noise: Quietness and ability to concentrate (1 = very quiet, 0 = very noisy)
- location_business: Proximity and convenience for business activities

If a review doesn't mention a criterion, use 0.5 (neutral).
Also provide an overall_work_relevance score (0-1) indicating how relevant the review is to business travelers.

Return valid JSON with this exact structure:
{
  "reviews": [
    {
      "text_snippet": "first 60 chars of review...",
      "criteria": { "wifi": 0.8, "workspace_room": 0.6, "workspace_hotel": 0.7, "noise": 0.5, "location_business": 0.9 },
      "overall_work_relevance": 0.7
    }
  ],
  "aggregated": {
    "wifi": 0.75,
    "workspace_room": 0.6,
    "workspace_hotel": 0.65,
    "noise": 0.5,
    "location_business": 0.85,
    "overall_work_relevance": 0.7
  }
}`;

const NEUTRAL_RESULT: SentimentResult = {
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

export async function analyzeReviews(
  hotelName: string,
  reviews: ReviewInput[]
): Promise<SentimentResult> {
  if (reviews.length === 0) {
    return NEUTRAL_RESULT;
  }

  const reviewsText = reviews
    .map((r, i) => `Review ${i + 1} (rating: ${r.rating}/5):\n${r.text}`)
    .join("\n\n");

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze these reviews for the hotel "${hotelName}":\n\n${reviewsText}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NEUTRAL_RESULT;
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NEUTRAL_RESULT;
    return JSON.parse(jsonMatch[0]) as SentimentResult;
  } catch (error) {
    console.error(`Sentiment analysis failed for "${hotelName}":`, error);
    return NEUTRAL_RESULT;
  }
}
