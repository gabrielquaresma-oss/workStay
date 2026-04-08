import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoiIndexProps {
  avgStayscore: number;
  avgSatisfaction: number;
  avgPricePerNight: number;
  previousRoi?: number;
}

export function RoiIndex({
  avgStayscore,
  avgSatisfaction,
  avgPricePerNight,
  previousRoi,
}: RoiIndexProps) {
  const roi =
    avgPricePerNight > 0
      ? Math.round((avgStayscore * avgSatisfaction) / avgPricePerNight * 100)
      : 0;

  const trend = previousRoi ? roi - previousRoi : 0;
  const isUp = trend >= 0;

  return (
    <div className="bg-card rounded-lg border p-4 text-center">
      <p className="text-xs text-muted-foreground font-medium uppercase">
        Índice ROI
      </p>
      <div className="flex items-center justify-center gap-2 mt-2">
        <span className="text-4xl font-bold">{roi}</span>
        {previousRoi !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              isUp ? "text-green-600" : "text-red-600"
            )}
          >
            {isUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(trend)}
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        (StayScore × Satisfação) / Preço × 100
      </p>
    </div>
  );
}
