"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, User } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  function handleSubmit() {
    if (destination.trim()) {
      router.push(`/search?q=${encodeURIComponent(destination.trim())}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="bg-white border border-[#D1D5DB] rounded-[14px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] flex items-stretch max-w-[800px] mx-auto overflow-hidden">
      {/* Destino */}
      <div className="flex-[2] flex items-center gap-2 px-4 py-3 cursor-pointer border-r border-[#EAECF0] hover:bg-[#FAFAFA] transition-colors">
        <Search className="w-[15px] h-[15px] text-[#009EFB] shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.6px] mb-[2px]">
            Destino
          </div>
          <input
            type="text"
            placeholder="Para onde você vai?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-[12px] text-[#374151] placeholder:text-[#9CA3AF] bg-transparent border-none outline-none p-0"
          />
        </div>
      </div>

      {/* Check-in */}
      <div className="flex-[1.3] flex items-center gap-2 px-4 py-3 cursor-pointer border-r border-[#EAECF0] hover:bg-[#FAFAFA] transition-colors">
        <Calendar className="w-[14px] h-[14px] text-[#009EFB] shrink-0" />
        <div>
          <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.6px] mb-[2px]">
            Check-in
          </div>
          <div className="text-[12px] text-[#9CA3AF]">Adicionar data</div>
        </div>
      </div>

      {/* Check-out */}
      <div className="flex-[1.3] flex items-center gap-2 px-4 py-3 cursor-pointer border-r border-[#EAECF0] hover:bg-[#FAFAFA] transition-colors">
        <Calendar className="w-[14px] h-[14px] text-[#009EFB] shrink-0" />
        <div>
          <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.6px] mb-[2px]">
            Check-out
          </div>
          <div className="text-[12px] text-[#9CA3AF]">Adicionar data</div>
        </div>
      </div>

      {/* Hóspedes */}
      <div className="flex-1 flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-[#FAFAFA] transition-colors">
        <User className="w-[14px] h-[14px] text-[#009EFB] shrink-0" />
        <div>
          <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-[0.6px] mb-[2px]">
            Hóspedes
          </div>
          <div className="text-[12px] text-[#9CA3AF]">1 hóspede</div>
        </div>
      </div>

      {/* Buscar */}
      <button
        onClick={handleSubmit}
        className="bg-[#009EFB] hover:bg-[#007FCC] text-white px-5 text-[13px] font-semibold flex items-center gap-1.5 m-1.5 rounded-[10px] whitespace-nowrap transition-colors cursor-pointer"
      >
        <Search className="w-[13px] h-[13px]" />
        Buscar
      </button>
    </div>
  );
}
