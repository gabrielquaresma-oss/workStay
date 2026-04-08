import Link from "next/link";
import { MapPin } from "lucide-react";
import type { FeaturedHotelCard } from "@/types/hotel";

const SCORE_STYLES = {
  green: "bg-[#C8F5DC] text-[#00873A]",
  yellow: "bg-[#FFF0B2] text-[#7A5700]",
  red: "bg-[#FFE4E5] text-[#B91C1C]",
};

interface CarouselHotelCardProps {
  hotel: FeaturedHotelCard;
}

export function CarouselHotelCard({ hotel }: CarouselHotelCardProps) {
  return (
    <Link
      href={`/hotel/${hotel.id}`}
      className="block bg-white border border-[#EAECF0] rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)] hover:-translate-y-[2px]"
    >
      {/* Image */}
      <div className="relative w-full h-[130px] overflow-hidden bg-[#E8F4FF] shrink-0">
        {hotel.imageUrl ? (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform hover:scale-[1.04]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}
        {/* Fallback */}
        <div
          className="absolute inset-0 flex-col items-center justify-center gap-1 bg-[#EFF8FF]"
          style={{ display: hotel.imageUrl ? "none" : "flex" }}
        >
          <span className="text-3xl font-bold text-[#009EFB]/30">
            {hotel.name.charAt(0)}
          </span>
        </div>

        {/* WorkScore badge */}
        <div
          className={`absolute top-[7px] right-[7px] w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.14)] ${SCORE_STYLES[hotel.scoreColor]}`}
        >
          {hotel.workScore.toFixed(1)}
        </div>
      </div>

      {/* Body */}
      <div className="px-[11px] pt-[10px] pb-3">
        <div className="text-[12px] font-semibold text-[#111827] mb-[3px] whitespace-nowrap overflow-hidden text-ellipsis">
          {hotel.name}
        </div>
        <div className="text-[10px] text-[#6B7280] mb-[7px] flex items-center gap-[3px]">
          <MapPin className="w-[9px] h-[9px]" />
          {hotel.location}
        </div>
        <div className="flex flex-wrap gap-1 mb-2 min-h-[18px]">
          {hotel.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#EFF8FF] text-[#1D4E89] text-[10px] font-semibold px-[7px] py-[2px] rounded-[20px] whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-[10px] text-[#6B7280]">
          A partir de{" "}
          <strong className="text-[13px] font-bold text-[#009EFB]">
            R$ {hotel.pricePerNight?.toFixed(0) ?? "—"}
          </strong>
          <span className="text-[10px] text-[#9CA3AF]">/noite</span>
        </div>
      </div>
    </Link>
  );
}
