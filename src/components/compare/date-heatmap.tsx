import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeatmapCell {
  date: string;
  day_of_week: string;
  price: number;
  color: string;
  is_selected: boolean;
}

interface DateHeatmapProps {
  heatmap: HeatmapCell[];
  bestDate: string | null;
}

const BG_COLORS: Record<string, string> = {
  green: "bg-[#DCFCE7]",
  yellow: "bg-[#FEF9C3]",
  red: "bg-[#FEE2E2]",
};

export function DateHeatmap({ heatmap, bestDate }: DateHeatmapProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {heatmap.map((cell) => (
        <div
          key={cell.date}
          className={cn(
            "flex flex-col items-center justify-center p-2 rounded-lg min-w-[90px] relative",
            BG_COLORS[cell.color] ?? "bg-muted",
            cell.is_selected && "ring-2 ring-primary"
          )}
        >
          {/* Best date star */}
          {bestDate === cell.date && (
            <Star className="absolute top-1 right-1 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          )}

          <span className="text-[11px] text-muted-foreground">
            {cell.day_of_week}
          </span>
          <span className="text-xs font-bold mt-0.5">
            {new Date(cell.date + "T12:00:00").toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
          <span className="text-sm font-bold mt-1">
            R$ {cell.price.toFixed(0)}
          </span>
        </div>
      ))}
    </div>
  );
}
