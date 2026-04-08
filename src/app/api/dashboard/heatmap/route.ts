import { getCurrentUser } from "@/lib/auth";

const DEMO_HEATMAP = [
  { city: "Belo Horizonte", state: "MG", lat: -19.9191, lng: -43.9386, total_spent: 17200, avg_stayscore: 78, bookings_count: 30 },
  { city: "São Paulo", state: "SP", lat: -23.5505, lng: -46.6333, total_spent: 27600, avg_stayscore: 82, bookings_count: 30 },
  { city: "Rio de Janeiro", state: "RJ", lat: -22.9068, lng: -43.1729, total_spent: 8400, avg_stayscore: 70, bookings_count: 8 },
  { city: "Brasília", state: "DF", lat: -15.7801, lng: -47.9292, total_spent: 5200, avg_stayscore: 75, bookings_count: 5 },
  { city: "Curitiba", state: "PR", lat: -25.4284, lng: -49.2733, total_spent: 3600, avg_stayscore: 80, bookings_count: 4 },
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (user.role === "TRAVELER") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  return Response.json({ cities: DEMO_HEATMAP });
}
