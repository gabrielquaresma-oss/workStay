import { StayScoreBadge } from "@/components/hotel/stayscore-badge";

interface TopHotel {
  id: string;
  name: string;
  city: string;
  bookings_count: number;
  total_spent: number;
  avg_stayscore: number;
}

interface TopHotelsTableProps {
  hotels: TopHotel[];
}

export function TopHotelsTable({ hotels }: TopHotelsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2 w-8">#</th>
            <th className="p-2">Hotel</th>
            <th className="p-2">Cidade</th>
            <th className="p-2 text-right">Reservas</th>
            <th className="p-2 text-right">Gasto Total</th>
            <th className="p-2 text-center">StayScore</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel, i) => (
            <tr key={hotel.id} className="border-b last:border-0 hover:bg-muted/50">
              <td className="p-2 text-muted-foreground">{i + 1}</td>
              <td className="p-2 font-medium">{hotel.name}</td>
              <td className="p-2 text-muted-foreground">{hotel.city}</td>
              <td className="p-2 text-right">{hotel.bookings_count}</td>
              <td className="p-2 text-right">
                R$ {hotel.total_spent.toLocaleString("pt-BR")}
              </td>
              <td className="p-2 flex justify-center">
                <StayScoreBadge score={hotel.avg_stayscore} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
