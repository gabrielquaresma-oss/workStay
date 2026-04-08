import { Wifi, Monitor, Building2, MapPin, DollarSign, Star } from "lucide-react";
import type { ScoreBreakdown as ScoreBreakdownType } from "@/types/hotel";
import { cn } from "@/lib/utils";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
}

const CRITERIA = [
  { key: "wifi_score" as const, label: "Wi-Fi", weight: "25%", icon: Wifi },
  { key: "workspace_room_score" as const, label: "Espaço no Quarto", weight: "20%", icon: Monitor },
  { key: "workspace_hotel_score" as const, label: "Espaço no Hotel", weight: "15%", icon: Building2 },
  { key: "coworking_proximity_score" as const, label: "Coworkings Próximos", weight: "15%", icon: MapPin },
  { key: "price_productivity_score" as const, label: "Custo-Benefício", weight: "15%", icon: DollarSign },
  { key: "traveler_rating_score" as const, label: "Avaliação Corp.", weight: "10%", icon: Star },
];

function getBarColor(score: number): string {
  if (score >= 80) return "bg-[#22C55E]";
  if (score >= 60) return "bg-[#EAB308]";
  return "bg-[#EF4444]";
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CRITERIA.map((c) => {
        const score = breakdown[c.key];
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              score < 50 && "bg-red-50"
            )}
          >
            <Icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium truncate">{c.label}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  {c.weight}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getBarColor(score))}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">
                  {score}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
