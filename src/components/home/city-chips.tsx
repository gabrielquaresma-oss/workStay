"use client";

const CITIES = [
  { label: "Todos", value: null },
  { label: "São Paulo", value: "São Paulo" },
  { label: "Belo Horizonte", value: "Belo Horizonte" },
  { label: "Rio de Janeiro", value: "Rio de Janeiro" },
  { label: "Brasília", value: "Brasília" },
  { label: "Curitiba", value: "Curitiba" },
];

interface CityChipsProps {
  selectedCity: string | null;
  onCitySelect: (city: string | null) => void;
}

export function CityChips({ selectedCity, onCitySelect }: CityChipsProps) {
  return (
    <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap">
      <span className="text-[11px] text-[#9CA3AF]">Destinos populares:</span>
      {CITIES.map((city) => {
        const isActive =
          city.value === selectedCity ||
          (city.value === null && selectedCity === null);
        return (
          <button
            key={city.label}
            onClick={() => onCitySelect(city.value)}
            className={`border rounded-[20px] px-[11px] py-[3px] text-[11px] font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-[#009EFB] border-[#009EFB] text-white"
                : "bg-white border-[#C5E2FF] text-[#0070E0] hover:bg-[#E8F4FF]"
            }`}
          >
            {city.label}
          </button>
        );
      })}
    </div>
  );
}
