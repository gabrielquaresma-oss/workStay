import { DollarSign, Award, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  insight: {
    type: string;
    title: string;
    description: string;
    action?: string;
  };
}

const TYPE_CONFIG: Record<string, { border: string; icon: typeof DollarSign; iconColor: string }> = {
  saving: { border: "border-l-green-500", icon: DollarSign, iconColor: "text-green-600" },
  quality: { border: "border-l-yellow-500", icon: Award, iconColor: "text-yellow-600" },
  alert: { border: "border-l-red-500", icon: AlertTriangle, iconColor: "text-red-600" },
};

export function InsightCard({ insight }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.quality;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg border bg-card p-4",
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconColor)} />
        <div>
          <h4 className="font-bold text-sm">{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {insight.description}
          </p>
          {insight.action && (
            <button className="text-xs text-primary font-medium mt-2 hover:underline">
              {insight.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
