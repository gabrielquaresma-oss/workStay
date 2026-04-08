"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import type { PromptInterpretation } from "@/types/hotel";

const EXAMPLE_PROMPTS = [
  "Hotel em SP Paulista, priorizo Wi-Fi e silêncio",
  "Hotel barato em BH com espaço pra reunião",
  "Viagem de 3 dias ao Rio, perto de coworking",
];

interface AIPromptInputProps {
  initialPrompt?: string;
}

export function AIPromptInput({ initialPrompt }: AIPromptInputProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const [interpreting, setInterpreting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  async function handleSubmit() {
    const trimmed = prompt.trim();
    if (!trimmed || interpreting) return;

    setInterpreting(true);

    try {
      const res = await fetch("/api/ai/interpret-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) throw new Error("Failed to interpret");

      const data: { interpretation: PromptInterpretation } = await res.json();
      const { interpretation } = data;

      const params = new URLSearchParams({
        q: interpretation.search_query || trimmed,
      });
      params.set("weights", JSON.stringify(interpretation.weights));
      params.set("summary", interpretation.priorities_summary);
      params.set("prompt", interpretation.original_prompt);

      router.push(`/search?${params.toString()}`);
    } catch {
      // Fallback: use prompt as plain destination search
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } finally {
      setInterpreting(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleExampleClick(example: string) {
    setPrompt(example);
    textareaRef.current?.focus();
  }

  // Expose a way for parent to set prompt (used by CityChips)
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  return (
    <div className="max-w-[700px] mx-auto">
      {/* Main input card */}
      <div className="bg-white border border-[#D1D5DB] rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          <Sparkles className="w-[18px] h-[18px] text-[#009EFB] shrink-0 mt-1" />
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva sua viagem... Ex: Hotel em SP com Wi-Fi rápido para trabalho remoto"
            rows={2}
            className="flex-1 text-[13px] text-[#374151] placeholder:text-[#9CA3AF] bg-transparent border-none outline-none p-0 resize-none leading-[1.5]"
          />
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-0">
          <span className="text-[10px] text-[#9CA3AF]">
            {interpreting ? "" : "Enter para buscar · Shift+Enter para nova linha"}
          </span>
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim() || interpreting}
            className="bg-[#009EFB] hover:bg-[#007FCC] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 text-[12px] font-semibold flex items-center gap-1.5 rounded-[10px] whitespace-nowrap transition-colors cursor-pointer"
          >
            {interpreting ? (
              <>
                <Loader2 className="w-[13px] h-[13px] animate-spin" />
                Interpretando...
              </>
            ) : (
              <>
                <Sparkles className="w-[13px] h-[13px]" />
                Buscar com IA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Example prompts */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-[10px] text-[#9CA3AF]">Experimente:</span>
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            className="border border-[#C5E2FF] bg-white rounded-[20px] px-[10px] py-[3px] text-[10px] text-[#0070E0] hover:bg-[#E8F4FF] transition-colors cursor-pointer"
          >
            &ldquo;{example}&rdquo;
          </button>
        ))}
      </div>
    </div>
  );
}
