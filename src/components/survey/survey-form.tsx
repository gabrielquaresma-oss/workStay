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
      <div className="text-center py-16">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Obrigado!</h2>
        <p className="text-muted-foreground mt-2">
          Sua avaliação ajuda outros viajantes a trabalho.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center mb-2">
        Avalie sua estadia no {hotelName}
      </h2>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                s <= step ? "bg-primary" : "bg-muted"
              )}
            />
            {s < 4 && (
              <div
                className={cn(
                  "w-8 h-0.5",
                  s < step ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Wi-Fi */}
      {step === 1 && (
        <div className="text-center space-y-4">
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
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-12 w-12 transition-colors",
                    n <= wifiRating
                      ? "fill-primary text-primary"
                      : "text-gray-200 hover:text-gray-400"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Workspace */}
      {step === 2 && (
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">
            Tinha espaço adequado para trabalhar no quarto?
          </p>
          <div className="flex justify-center gap-3">
            {(
              [
                { value: "SIM" as const, label: "Sim", color: "bg-green-500 hover:bg-green-600" },
                { value: "PARCIAL" as const, label: "Parcial", color: "bg-yellow-500 hover:bg-yellow-600" },
                { value: "NAO" as const, label: "Não", color: "bg-red-500 hover:bg-red-600" },
              ]
            ).map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => {
                  setWorkspaceAdequate(value);
                  setStep(3);
                }}
                className={cn(
                  "px-6 py-3 rounded-lg text-white font-medium transition-colors",
                  workspaceAdequate === value
                    ? color
                    : "bg-muted text-foreground hover:bg-muted/80",
                  workspaceAdequate === value && color
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
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">
            Conseguiu se concentrar sem ruído?
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => {
                  setSilenceRating(n);
                  setStep(4);
                }}
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-12 w-12 transition-colors",
                    n <= silenceRating
                      ? "fill-primary text-primary"
                      : "text-gray-200 hover:text-gray-400"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Recommend */}
      {step === 4 && (
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">
            Recomendaria para outro viajante a trabalho?
          </p>
          <div className="flex justify-center gap-3">
            {(
              [
                { value: "SIM" as const, label: "Sim" },
                { value: "TALVEZ" as const, label: "Talvez" },
                { value: "NAO" as const, label: "Não" },
              ]
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setWouldRecommend(value)}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors border",
                  wouldRecommend === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-muted"
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
              className="mt-6 w-full h-12"
            >
              {submitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          )}
        </div>
      )}

      {/* Back button */}
      {step > 1 && !submitted && (
        <button
          onClick={() => setStep(step - 1)}
          className="text-sm text-muted-foreground mt-6 mx-auto block hover:underline"
        >
          Voltar
        </button>
      )}
    </div>
  );
}
