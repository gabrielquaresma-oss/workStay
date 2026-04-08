import { StayScoreBadge } from "@/components/hotel/stayscore-badge";
import { Badge } from "@/components/ui/badge";

interface AlternativeHotel {
  name: string;
  price: number;
  stayscore: number;
  savings: number;
}

interface AlternativeHotelsProps {
  hotels: AlternativeHotel[];
}

export function AlternativeHotels({ hotels }: AlternativeHotelsProps) {
  if (hotels.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2">Alternativas na mesma cidade</h4>
      <div className="space-y-2">
        {hotels.map((hotel) => (
          <div
            key={hotel.name}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
          >
            <StayScoreBadge score={hotel.stayscore} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{hotel.name}</p>
              <p className="text-sm font-bold text-primary">
                R$ {hotel.price.toFixed(0)}
                <span className="text-xs font-normal text-muted-foreground">
                  /noite
                </span>
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">
              -R$ {hotel.savings}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
