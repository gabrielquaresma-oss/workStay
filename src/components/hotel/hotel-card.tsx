import Link from "next/link";
import { Star, Wifi, Monitor, Volume2 } from "lucide-react";
import { StayScoreBadge } from "./stayscore-badge";
import { Badge } from "@/components/ui/badge";
import type { HotelSearchResult } from "@/types/hotel";

interface HotelCardProps {
  result: HotelSearchResult;
}

function getHighlights(result: HotelSearchResult): { label: string; color: string }[] {
  const highlights: { label: string; color: string }[] = [];
  const b = result.stayscore?.breakdown;
  if (!b) return highlights;

  if (b.wifi_score >= 80) {
    highlights.push({ label: "Wi-Fi Excelente", color: "bg-green-50 text-green-700 border-green-200" });
  }
  if (b.workspace_hotel_score >= 75) {
    highlights.push({ label: "Business Center", color: "bg-blue-50 text-blue-700 border-blue-200" });
  }
  if (b.coworking_proximity_score >= 70) {
    highlights.push({ label: "Perto de coworking", color: "bg-sky-50 text-sky-700 border-sky-200" });
  }

  return highlights;
}

export function HotelCard({ result }: HotelCardProps) {
  const { hotel, stayscore, price_per_night } = result;
  const highlights = getHighlights(result);

  return (
    <Link href={`/hotel/${hotel.id}`} className="block group">
      <div className="flex flex-col sm:flex-row bg-white rounded-xl border overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
        {/* Image */}
        <div className="sm:w-[220px] h-[160px] sm:h-auto bg-muted shrink-0 relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-[#2872FA]/8 to-[#009EFB]/5 flex items-center justify-center">
            <span className="text-5xl font-bold text-primary/12">
              {hotel.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 relative">
          {/* StayScore badge */}
          {stayscore && (
            <div className="absolute top-5 right-5">
              <StayScoreBadge score={stayscore.total_score} size="md" />
            </div>
          )}

          <h3 className="text-lg font-bold pr-16 tracking-tight">{hotel.name}</h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            {hotel.address}
          </p>

          {/* Mini metrics */}
          <div className="flex items-center gap-3 mt-3">
            {stayscore && (
              <>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Wifi className="h-3 w-3" />
                  {stayscore.breakdown.wifi_score}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Monitor className="h-3 w-3" />
                  {stayscore.breakdown.workspace_room_score}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Volume2 className="h-3 w-3" />
                  {stayscore.breakdown.traveler_rating_score}
                </span>
              </>
            )}
            {hotel.google_rating && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {hotel.google_rating}
              </span>
            )}
          </div>

          {/* Price + highlights */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-1.5">
              {highlights.map((h) => (
                <Badge
                  key={h.label}
                  variant="outline"
                  className={`text-[11px] font-medium ${h.color}`}
                >
                  {h.label}
                </Badge>
              ))}
            </div>
            {price_per_night && (
              <div className="text-right shrink-0 ml-2">
                <span className="text-xl font-bold text-foreground">
                  R$ {price_per_night.toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground block">
                  /noite
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
