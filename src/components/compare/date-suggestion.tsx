import { CalendarCheck, TrendingDown } from "lucide-react";

interface DateSuggestionProps {
  bestDate: {
    date: string;
    price: number;
    savings: number;
    stayscore_ok: boolean;
  };
  projectedAnnualSavings: number;
}

export function DateSuggestion({
  bestDate,
  projectedAnnualSavings,
}: DateSuggestionProps) {
  if (bestDate.savings <= 30) return null;

  const formattedDate = new Date(bestDate.date + "T12:00:00").toLocaleDateString(
    "pt-BR",
    { weekday: "long", day: "numeric", month: "long" }
  );

  return (
    <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <CalendarCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800">
            Economize R$ {bestDate.savings} mudando para {formattedDate}
          </p>
          <p className="text-sm text-green-700 mt-1">
            R$ {bestDate.price.toFixed(0)}/noite
            {bestDate.stayscore_ok && " — mesmo StayScore ou melhor"}
          </p>
          {projectedAnnualSavings > 0 && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Economia projetada anual: R$ {projectedAnnualSavings.toLocaleString("pt-BR")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
