import { getCurrentUser } from "@/lib/auth";

// Demo data for MVP
const DEMO_TOP_HOTELS = [
  { id: "hotel-mercure-bh-lourdes", name: "Mercure BH Lourdes", city: "Belo Horizonte", bookings_count: 12, total_spent: 6960, avg_stayscore: 82 },
  { id: "hotel-novotel-sp-jaragua", name: "Novotel SP Jaraguá", city: "São Paulo", bookings_count: 10, total_spent: 7000, avg_stayscore: 85 },
  { id: "hotel-hilton-sp-morumbi", name: "Hilton SP Morumbi", city: "São Paulo", bookings_count: 8, total_spent: 11200, avg_stayscore: 92 },
  { id: "hotel-ibis-bh-liberdade", name: "Ibis BH Liberdade", city: "Belo Horizonte", bookings_count: 7, total_spent: 2380, avg_stayscore: 62 },
  { id: "hotel-novotel-bh-savassi", name: "Novotel BH Savassi", city: "Belo Horizonte", bookings_count: 6, total_spent: 4320, avg_stayscore: 88 },
  { id: "hotel-ibis-sp-paulista", name: "Ibis SP Paulista", city: "São Paulo", bookings_count: 5, total_spent: 1900, avg_stayscore: 65 },
  { id: "hotel-radisson-sp-faria-lima", name: "Radisson SP Faria Lima", city: "São Paulo", bookings_count: 4, total_spent: 4800, avg_stayscore: 84 },
  { id: "hotel-quality-bh", name: "Quality BH Afonso Pena", city: "Belo Horizonte", bookings_count: 3, total_spent: 2340, avg_stayscore: 78 },
  { id: "hotel-mercure-sp-vila-olimpia", name: "Mercure SP Vila Olímpia", city: "São Paulo", bookings_count: 3, total_spent: 2700, avg_stayscore: 80 },
  { id: "hotel-intercity-bh", name: "Intercity BH Expo", city: "Belo Horizonte", bookings_count: 2, total_spent: 1200, avg_stayscore: 71 },
];

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (user.role === "TRAVELER") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "10");

  return Response.json({
    hotels: DEMO_TOP_HOTELS.slice(0, limit),
  });
}
