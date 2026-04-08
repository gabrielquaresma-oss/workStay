import { Laptop, Coffee, Star, Wifi, Plug, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    type: "COWORKING" | "CAFE";
    distance_meters: number;
    google_rating: number | null;
    opening_hours: string[] | null;
    has_wifi: boolean;
    has_power_outlets: boolean;
    is_quiet: boolean;
  };
  isHighlighted?: boolean;
  onHover?: (id: string | null) => void;
}

export function WorkspaceCard({
  workspace,
  isHighlighted,
  onHover,
}: WorkspaceCardProps) {
  const isCoworking = workspace.type === "COWORKING";

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer",
        isHighlighted ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/50"
      )}
      onMouseEnter={() => onHover?.(workspace.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
            isCoworking ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
          )}
        >
          {isCoworking ? (
            <Laptop className="h-4 w-4" />
          ) : (
            <Coffee className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold truncate">{workspace.name}</h4>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{workspace.distance_meters}m</span>
            {workspace.google_rating && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {workspace.google_rating}
              </span>
            )}
          </div>

          {/* Opening hours (first line) */}
          {workspace.opening_hours?.[0] && (
            <p className="text-[11px] text-muted-foreground mt-1 truncate">
              {workspace.opening_hours[0]}
            </p>
          )}

          {/* Indicator badges */}
          <div className="flex gap-1 mt-2">
            {workspace.has_wifi && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                <Wifi className="h-2.5 w-2.5 mr-0.5" />
                Wi-Fi
              </Badge>
            )}
            {workspace.has_power_outlets && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                <Plug className="h-2.5 w-2.5 mr-0.5" />
                Tomadas
              </Badge>
            )}
            {workspace.is_quiet && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                <VolumeX className="h-2.5 w-2.5 mr-0.5" />
                Silencioso
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
