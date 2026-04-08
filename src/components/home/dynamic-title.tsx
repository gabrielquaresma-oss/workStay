import { MapPin, PlusCircle } from "lucide-react";

interface DynamicTitleProps {
  selectedCity: string | null;
}

export function DynamicTitle({ selectedCity }: DynamicTitleProps) {
  return (
    <div className="py-7 px-[100px] flex flex-col items-center gap-2 text-center">
      <h2 className="text-[22px] font-bold text-[#111827] leading-[1.2]">
        {selectedCity ? (
          <>
            Melhores hotéis para sua viagem a trabalho em{" "}
            <span className="text-[#009EFB]">{selectedCity}</span>
          </>
        ) : (
          <>
            Melhores hotéis para sua{" "}
            <span className="text-[#009EFB]">viagem a trabalho</span>
          </>
        )}
      </h2>
      <div className="flex items-center justify-center gap-2 flex-wrap text-[13px] font-medium text-[#374151]">
        {selectedCity ? (
          <>
            <MapPin className="w-[11px] h-[11px] text-[#374151]" />
            <span>
              Exibindo hotéis disponíveis em{" "}
              <strong className="text-[#111827]">{selectedCity}</strong>
            </span>
          </>
        ) : (
          <>
            <span className="inline-flex items-center gap-1 bg-[#DBEAFE] text-[#1E40AF] text-[11px] font-bold px-2.5 py-[3px] rounded-[20px]">
              <PlusCircle className="w-[11px] h-[11px]" />
              Todos os destinos disponíveis
            </span>
            <span>Selecione uma cidade acima para filtrar por destino</span>
          </>
        )}
      </div>
    </div>
  );
}
