"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingSurvey {
  booking_id: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
}

export function SurveyBanner() {
  const router = useRouter();
  const [survey, setSurvey] = useState<PendingSurvey | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/surveys?status=pending")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.surveys?.length > 0) {
          setSurvey(data.surveys[0]);
        }
      })
      .catch(() => {});
  }, []);

  if (!survey || dismissed) return null;

  const stayDate = new Date(survey.check_in + "T12:00:00").toLocaleDateString(
    "pt-BR",
    { day: "numeric", month: "long" }
  );

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-3 mb-4">
      <MessageSquare className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          Avalie sua estadia no {survey.hotel_name}
        </p>
        <p className="text-xs text-muted-foreground">
          Estadia em {stayDate}
        </p>
      </div>
      <Button
        size="sm"
        onClick={() => router.push(`/survey/${survey.booking_id}`)}
      >
        Avaliar agora
      </Button>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground hover:text-foreground p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
