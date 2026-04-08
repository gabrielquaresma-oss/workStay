import { cn } from "@/lib/utils";

interface StayScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10 text-[16px]",
  md: "h-[52px] w-[52px] text-[20px]",
  lg: "h-20 w-20 text-[32px]",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "border-[#16A34A] text-[#16A34A] bg-green-50";
  if (score >= 60) return "border-[#CA8A04] text-[#CA8A04] bg-amber-50";
  return "border-[#DC2626] text-[#DC2626] bg-red-50";
}

export function StayScoreBadge({ score, size = "md" }: StayScoreBadgeProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-full border-[3px] font-bold",
        sizeClasses[size],
        getScoreColor(score)
      )}
    >
      <span className="leading-none">{score}</span>
      {(size === "md" || size === "lg") && (
        <span className="text-[9px] font-normal leading-none mt-0.5">
          Score
        </span>
      )}
    </div>
  );
}
