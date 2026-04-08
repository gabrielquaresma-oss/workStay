const BADGE_STYLES: Record<string, string> = {
  "badge-workscore": "bg-[#DBEAFE] text-[#1E40AF]",
  "badge-cowork": "bg-[#D1FAE5] text-[#065F46]",
  "badge-nearby": "bg-[#DBEAFE] text-[#1E40AF]",
  "badge-business": "bg-[#EDE9FE] text-[#4C1D95]",
  "badge-quarto": "bg-[#FFEDD5] text-[#9A3412]",
};

const SECTION_ICONS: Record<string, string> = {
  "top-rated":
    "M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z",
  "coworking-inside":
    "M2 3h12v10H2zM5 7h6M5 10h4",
  "coworking-nearby":
    "M8 2a4 4 0 00-4 4c0 3 4 8 4 8s4-5 4-8a4 4 0 00-4-4zM8 6a1.5 1.5 0 110 3 1.5 1.5 0 010-3z",
  "business-center":
    "M1 3h14v10H1zM5 13v2M11 13v2M3 15h10M6 7h4M6 10h2",
  "room-office":
    "M2 2h12v12H2zM5 6h6M5 9h4M10 9h1",
};

interface SectionHeaderProps {
  id: string;
  title: string;
  badge: string;
  badgeVariant: string;
  subtitle: string;
  iconBg: string;
  iconColor: string;
}

export function SectionHeader({
  id,
  title,
  badge,
  badgeVariant,
  subtitle,
  iconBg,
  iconColor,
}: SectionHeaderProps) {
  const iconPath = SECTION_ICONS[id] || "";

  return (
    <div>
      <div className="flex items-center gap-3 mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0"
            style={{ background: iconBg }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke={iconColor}
              strokeWidth="1.5"
            >
              <path d={iconPath} />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-[#111827] whitespace-nowrap">
            {title}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-[3px] rounded-[20px] text-[10px] font-bold whitespace-nowrap shrink-0 ${BADGE_STYLES[badgeVariant] || ""}`}
          >
            {badge}
          </span>
        </div>
      </div>
      <p className="text-[12px] text-[#6B7280] mb-4 pl-9">{subtitle}</p>
    </div>
  );
}
