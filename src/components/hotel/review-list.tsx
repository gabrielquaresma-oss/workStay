import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewSentiment {
  wifi: number;
  workspace_room: number;
  workspace_hotel: number;
  noise: number;
  location_business: number;
}

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time: string;
  is_work_relevant: boolean;
  work_relevance_score: number;
  sentiment_analysis: ReviewSentiment | null;
}

interface ReviewListProps {
  reviews: Review[];
}

const WORK_TERMS = [
  "wifi", "wi-fi", "internet", "mesa", "trabalho", "trabalhar",
  "silêncio", "silencio", "barulho", "ruído", "ruido", "coworking",
  "escritório", "escritorio", "notebook", "tomada", "concentrar",
  "reunião", "reuniao", "business", "desk", "quiet",
];

const SENTIMENT_LABELS: { key: keyof ReviewSentiment; label: string }[] = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "workspace_room", label: "Mesa" },
  { key: "noise", label: "Silêncio" },
  { key: "location_business", label: "Localização" },
];

function highlightWorkTerms(text: string): React.ReactNode[] {
  const regex = new RegExp(`(${WORK_TERMS.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (WORK_TERMS.some((t) => part.toLowerCase() === t.toLowerCase())) {
      return (
        <mark key={i} className="bg-amber-100 px-0.5 rounded">
          {part}
        </mark>
      );
    }
    return part;
  });
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        O que viajantes a trabalho dizem{" "}
        <span className="text-sm font-normal text-muted-foreground">
          ({reviews.length} avaliações)
        </span>
      </h3>

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="p-4 bg-card rounded-lg border">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                {review.author_name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">
                    {review.author_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {review.relative_time}
                  </span>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star
                        key={j}
                        className={cn(
                          "h-3 w-3",
                          j < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  {/* Relevance badge */}
                  {review.is_work_relevant && (
                    <Badge variant="secondary" className="text-[10px]">
                      {Math.round(review.work_relevance_score * 100)}% relevante
                    </Badge>
                  )}
                </div>

                {/* Text with highlights */}
                <p className="text-sm mt-2 leading-relaxed">
                  {highlightWorkTerms(review.text)}
                </p>

                {/* Sentiment tags */}
                {review.sentiment_analysis && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SENTIMENT_LABELS.map(({ key, label }) => {
                      const score = review.sentiment_analysis![key];
                      if (score <= 0.3 || score >= 0.7) {
                        const isPositive = score >= 0.7;
                        return (
                          <Badge
                            key={key}
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              isPositive
                                ? "border-green-300 text-green-700 bg-green-50"
                                : "border-red-300 text-red-700 bg-red-50"
                            )}
                          >
                            {label}: {isPositive ? "Positivo" : "Negativo"}
                          </Badge>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
