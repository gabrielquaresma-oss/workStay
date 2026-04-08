import { getCurrentUser } from "@/lib/auth";

function generateWeeklyTrends(): {
  hotel: string;
  data: { week: string; price: number }[];
}[] {
  const hotels = [
    { name: "Mercure BH Lourdes", basePrice: 290 },
    { name: "Novotel SP Jaraguá", basePrice: 350 },
    { name: "Hilton SP Morumbi", basePrice: 700 },
    { name: "Ibis BH Liberdade", basePrice: 170 },
    { name: "Radisson SP Faria Lima", basePrice: 450 },
  ];

  return hotels.map((h) => ({
    hotel: h.name,
    data: Array.from({ length: 12 }, (_, i) => {
      const weekNum = 12 - i;
      const variation = 0.85 + Math.sin(i * 0.8 + h.basePrice * 0.01) * 0.15;
      return {
        week: `Sem ${weekNum}`,
        price: Math.round(h.basePrice * variation),
      };
    }).reverse(),
  }));
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (user.role === "TRAVELER") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  return Response.json({ trends: generateWeeklyTrends() });
}
