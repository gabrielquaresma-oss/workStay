import { getCurrentUser } from "@/lib/auth";

// Demo pending surveys data (for MVP without DB)
const DEMO_PENDING_SURVEYS = [
  {
    booking_id: "booking-006",
    hotel_id: "hotel-mercure-bh-lourdes",
    hotel_name: "Mercure BH Lourdes",
    city: "Belo Horizonte",
    check_in: "2026-04-05",
    check_out: "2026-04-07",
  },
  {
    booking_id: "booking-007",
    hotel_id: "hotel-ibis-sp-paulista",
    hotel_name: "Ibis São Paulo Paulista",
    city: "São Paulo",
    check_in: "2026-03-28",
    check_out: "2026-03-30",
  },
];

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (status === "pending") {
    // For MVP, return demo pending surveys for TRAVELER role
    if (user.role === "TRAVELER") {
      return Response.json({ surveys: DEMO_PENDING_SURVEYS });
    }
    return Response.json({ surveys: [] });
  }

  return Response.json({ surveys: [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  const required = [
    "hotel_id",
    "booking_id",
    "wifi_rating",
    "workspace_adequate",
    "silence_rating",
    "would_recommend",
    "stay_date",
  ];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null) {
      return Response.json(
        { error: `Campo obrigatório: ${field}` },
        { status: 400 }
      );
    }
  }

  // Validate wifi_rating (1-5)
  if (body.wifi_rating < 1 || body.wifi_rating > 5) {
    return Response.json(
      { error: "wifi_rating deve ser entre 1 e 5" },
      { status: 400 }
    );
  }

  // Validate workspace_adequate
  if (!["SIM", "PARCIAL", "NAO"].includes(body.workspace_adequate)) {
    return Response.json(
      { error: "workspace_adequate deve ser SIM, PARCIAL ou NAO" },
      { status: 400 }
    );
  }

  // Validate silence_rating (1-5)
  if (body.silence_rating < 1 || body.silence_rating > 5) {
    return Response.json(
      { error: "silence_rating deve ser entre 1 e 5" },
      { status: 400 }
    );
  }

  // Validate would_recommend
  if (!["SIM", "TALVEZ", "NAO"].includes(body.would_recommend)) {
    return Response.json(
      { error: "would_recommend deve ser SIM, TALVEZ ou NAO" },
      { status: 400 }
    );
  }

  // For MVP, just return success (would save to DB and trigger recalculation)
  return Response.json({
    survey: { id: `survey-${Date.now()}` },
    message: "Obrigado!",
  });
}
