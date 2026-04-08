"use client";

import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SurveyFormProps {
  hotelId: string;
  bookingId: string;
  hotelName: string;
  stayDate: string;
}

type WorkspaceAdequacy = "SIM" | "PARCIAL" | "NAO";
type Recommendation = "SIM" | "TALVEZ" | "NAO";

export function SurveyForm({
  hotelId,
  bookingId,
  hotelName,
  stayDate,
}: SurveyFormProps) {
  const [step, setStep] = useState(1);
  const [wifiRating, setWifiRating] = useState(0);
  const [workspaceAdequate, setWorkspaceAdequate] =
    useState<WorkspaceAdequacy | null>(null);
  const [silenceRating, setSilenceRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] =
    useState<Recommendation | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    wifiRating > 0 &&
    workspaceAdequate !== null &&
    silenceRating > 0 &&
    wouldRecommend !== null;

  const totalSteps = 4;
  const progressPercent = Math.round((step / totalSteps) * 100);

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel_id: hotelId,
          booking_id: bookingId,
          wifi_rating: wifiRating,
          workspace_adequate: workspaceAdequate,
          silence_rating: silenceRating,
          would_recommend: wouldRecommend,
          stay_date: stayDate,
        }),
      });
      setSubmitted(true);
    } catch {
      // Ignore
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-5">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Obrigado!</h2>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
          Sua avaliacao ajuda outros viajantes a trabalho a encontrar os melhores hoteis.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.location.href = "/search"}
        >
          Voltar para busca
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center mb-1">
        Avalie sua estadia
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {hotelName}
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Pergunta {step} de {totalSteps}
          </span>
          <span className="text-xs font-medium text-primary">
            {progressPercent}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2872FA] to-[#009EFB] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Step 1: Wi-Fi */}
      {step === 1 && (
        <div className="text-center space-y-6">
          <p className="text-lg font-medium">
            Como foi o Wi-Fi para trabalho?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setWifiRating(n);
                  setStep(2);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    n <= wifiRating
                      ? "fill-primary text-primary"
                      : "text-gray-200 hover:text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Workspace */}
      {step === 2 && (
        <div className="text-center space-y-6">
          <p className="text-lg font-medium">
            Tinha espaco adequado para trabalhar no quarto?
          </p>
          <div className="flex justify-center gap-3">
            {(
              [
                { value: "SIM" as const, label: "Sim" },
                { value: "PARCIAL" as const, label: "Parcial" },
                { value: "NAO" as const, label: "Nao" },
              ]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setWorkspaceAdequate(value);
                  setStep(3);
                }}
                className={cn(
                  "px-6 py-3 rounded-full font-medium transition-all border-2 cursor-pointer",
                  workspaceAdequate === value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Silence */}
      {step === 3 && (
        <div className="text-center space-y-6">
          <p className="text-lg font-medium">
            Conseguiu se concentrar sem ruido?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSilenceRating(n);
                  setStep(4);
                }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <Star
                  className={cn(
                    "h-10 w-10 transition-colors",
                    n <= silenceRating
                      ? "fill-primary text-primary"
                      : "text-gray-200 hover:text-gray-300"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Recommend */}
      {step === 4 && (
        <div className="text-center space-y-6">
          <p className="text-lg font-medium">
            Recomendaria para outro viajante a trabalho?
          </p>
          <div className="flex justify-center gap-3">
            {(
              [
                { value: "SIM" as const, label: "Sim" },
                { value: "TALVEZ" as const, label: "Talvez" },
                { value: "NAO" as const, label: "Nao" },
              ]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setWouldRecommend(value)}
                className={cn(
                  "px-6 py-3 rounded-full font-medium transition-all border-2 cursor-pointer",
                  wouldRecommend === value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border hover:border-primary/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {canSubmit && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-4 w-full h-12 rounded-full bg-gradient-to-r from-[#2872FA] to-[#009EFB] hover:from-[#1D5FE0] hover:to-[#008DE0] text-white shadow-md"
            >
              {submitting ? "Enviando..." : "Enviar Avaliacao"}
            </Button>
          )}
        </div>
      )}

      {/* Back button */}
      {step > 1 && !submitted && (
        <button
          onClick={() => setStep(step - 1)}
          className="text-sm text-muted-foreground mt-8 mx-auto block hover:text-foreground transition-colors cursor-pointer"
        >
          Voltar
        </button>
      )}
    </div>
  );
}
