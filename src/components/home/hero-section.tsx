"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { AIPromptInput } from "./ai-prompt-input";
import { CityChips } from "./city-chips";

interface HeroSectionProps {
  selectedCity: string | null;
  onCitySelect: (city: string | null) => void;
}

export function HeroSection({ selectedCity, onCitySelect }: HeroSectionProps) {
  const [promptText, setPromptText] = useState<string | undefined>(undefined);

  function handleCityPrompt(text: string) {
    setPromptText(text);
  }

  return (
    <div className="bg-[#E8F4FF] px-6 pt-9 pb-8 text-center border-b border-[#C5E2FF]">
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-1.5 bg-white border border-[#C5E2FF] rounded-[20px] px-3 py-1 text-[11px] font-semibold text-[#0057C2] mb-3.5">
        <Star className="w-[11px] h-[11px]" />
        WorkScore — Ranking de produtividade corporativa
      </div>

      {/* Title */}
      <h1 className="text-[26px] font-bold text-[#111827] mb-2 leading-[1.25]">
        O hotel certo para quem
        <br />
        trabalha <span className="text-[#009EFB]">viajando</span>
      </h1>

      {/* Subtitle */}
      <p className="text-[13px] text-[#6B7280] mb-6">
        Descreva sua viagem e nossa IA encontra os hotéis ideais para seu perfil
        de trabalho
      </p>

      {/* AI Prompt Input */}
      <AIPromptInput initialPrompt={promptText} />

      {/* City chips */}
      <CityChips
        selectedCity={selectedCity}
        onCitySelect={onCitySelect}
        onPromptPopulate={handleCityPrompt}
      />
    </div>
  );
}
