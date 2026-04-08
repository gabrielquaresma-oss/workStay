"use client";

import { SectionHeader } from "./section-header";
import { HotelCarousel } from "./hotel-carousel";
import type { FeaturedSection } from "@/types/hotel";

interface FeaturedSectionsProps {
  sections: FeaturedSection[];
}

export function FeaturedSections({ sections }: FeaturedSectionsProps) {
  return (
    <div className="px-[100px] pt-4 pb-14">
      {sections.map((section) => {
        if (section.hotels.length === 0) return null;
        return (
          <div key={section.id} className="mt-10 first:mt-0">
            <SectionHeader
              id={section.id}
              title={section.title}
              badge={section.badge}
              badgeVariant={section.badgeVariant}
              subtitle={section.subtitle}
              iconBg={section.iconBg}
              iconColor={section.iconColor}
            />
            <HotelCarousel
              hotels={section.hotels}
              sectionId={section.id}
            />
          </div>
        );
      })}
    </div>
  );
}
