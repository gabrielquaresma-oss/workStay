"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CarouselHotelCard } from "./carousel-hotel-card";
import type { FeaturedHotelCard } from "@/types/hotel";

interface HotelCarouselProps {
  hotels: FeaturedHotelCard[];
  sectionId: string;
}

export function HotelCarousel({ hotels, sectionId }: HotelCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);

  const VISIBLE = 5;
  const GAP = 14;
  const total = hotels.length;
  const maxIndex = Math.max(0, total - VISIBLE);

  const calculateCardWidth = useCallback(() => {
    if (outerRef.current) {
      const containerWidth = outerRef.current.offsetWidth;
      setCardWidth((containerWidth - GAP * (VISIBLE - 1)) / VISIBLE);
    }
  }, []);

  useEffect(() => {
    calculateCardWidth();
    window.addEventListener("resize", calculateCardWidth);
    return () => window.removeEventListener("resize", calculateCardWidth);
  }, [calculateCardWidth]);

  function slidePrev() {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }

  function slideNext() {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }

  const translateX = currentIndex * (cardWidth + GAP);
  const start = currentIndex + 1;
  const end = Math.min(currentIndex + VISIBLE, total);

  return (
    <div>
      <div className="relative" id={`carousel-${sectionId}`}>
        {/* Prev button */}
        <button
          onClick={slidePrev}
          className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.14)] cursor-pointer ${
            currentIndex === 0
              ? "opacity-0 pointer-events-none"
              : "bg-[#D6EFFF] text-[#0057C2] hover:bg-[#A8DAFF] hover:text-[#004499] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
          }`}
        >
          <ChevronLeft className="w-[14px] h-[14px]" />
        </button>

        {/* Track */}
        <div ref={outerRef} className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              gap: `${GAP}px`,
              transform: `translateX(-${translateX}px)`,
            }}
          >
            {hotels.map((hotel) => (
              <div
                key={hotel.id + sectionId}
                className="shrink-0"
                style={{ width: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
              >
                <CarouselHotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={slideNext}
          className={`absolute -right-[18px] top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center z-10 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.14)] cursor-pointer ${
            currentIndex >= maxIndex
              ? "bg-[#EAECF0] text-[#A0AEC0] cursor-not-allowed shadow-none pointer-events-none"
              : "bg-[#D6EFFF] text-[#0057C2] hover:bg-[#A8DAFF] hover:text-[#004499] hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
          }`}
        >
          <ChevronRight className="w-[14px] h-[14px]" />
        </button>
      </div>

      {/* Count */}
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 h-px bg-[#EAECF0]" />
        <span className="text-[11px] text-[#9CA3AF] whitespace-nowrap">
          Exibindo {start}–{end} de {total} hotéis
        </span>
        <div className="flex-1 h-px bg-[#EAECF0]" />
      </div>
    </div>
  );
}
