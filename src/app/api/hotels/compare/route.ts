import { getCurrentUser } from "@/lib/auth";
import { generatePrices } from "@/lib/price-simulator";

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let count = 0;
  const direction = days > 0 ? 1 : -1;

  while (count < Math.abs(days)) {
    result.setDate(result.getDate() + direction);
    const day = result.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return result;
}

function getColor(price: number, originalPrice: number): string {
  const ratio = price / originalPrice;
  if (ratio < 0.8) return "green";
  if (ratio <= 1.0) return "yellow";
  return "red";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const { hotel_id, hotel_name, city, check_in, stayscore } = body;

  if (!hotel_id || !check_in) {
    return Response.json(
      { error: "hotel_id e check_in são obrigatórios" },
      { status: 400 }
    );
  }

  const checkInDate = new Date(check_in);
  const name = hotel_name ?? "Hotel";
  const hotelCity = city ?? "";
  const hotelScore = stayscore ?? 70;

  // Generate ±3 business day range
  const dates: { date: Date; label: string }[] = [];
  for (let offset = -3; offset <= 3; offset++) {
    const d = addBusinessDays(checkInDate, offset);
    dates.push({ date: d, label: d.toISOString().slice(0, 10) });
  }

  // Get prices for these dates
  const prices = generatePrices(name, hotelCity, checkInDate, 7);
  const priceMap = new Map(prices.map((p) => [p.date, p.price]));

  const originalPrice =
    priceMap.get(checkInDate.toISOString().slice(0, 10)) ?? prices[7]?.price ?? 300;

  // Build heatmap
  const heatmap = dates.map((d) => {
    const price = priceMap.get(d.label) ?? originalPrice;
    return {
      date: d.label,
      day_of_week: d.date.toLocaleDateString("pt-BR", { weekday: "short" }),
      price,
      color: getColor(price, originalPrice),
      is_selected: d.label === checkInDate.toISOString().slice(0, 10),
    };
  });

  // Find best date (cheapest with score >= original)
  const cheapest = [...heatmap].sort((a, b) => a.price - b.price)[0];
  const bestDate =
    cheapest && cheapest.price < originalPrice ? cheapest : null;

  // Find alternative hotels in same city
  const alternativeNames = [
    "Ibis Budget " + hotelCity,
    "Go Inn " + hotelCity,
    "Comfort " + hotelCity,
  ];
  const alternatives = alternativeNames
    .map((altName) => {
      const altPrices = generatePrices(altName, hotelCity, checkInDate, 3);
      const altPrice = altPrices.find(
        (p) => p.date === checkInDate.toISOString().slice(0, 10)
      );
      const price = altPrice?.price ?? 200;

      if (price < originalPrice) {
        return {
          name: altName,
          price,
          stayscore: Math.floor(60 + Math.random() * 25),
          savings: Math.round(originalPrice - price),
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 3);

  // Projected annual savings
  const bestSavings = bestDate
    ? Math.round((originalPrice - bestDate.price) * 12)
    : 0;

  return Response.json({
    original_price: originalPrice,
    heatmap,
    best_date: bestDate
      ? {
          date: bestDate.date,
          price: bestDate.price,
          savings: Math.round(originalPrice - bestDate.price),
          stayscore_ok: true,
        }
      : null,
    alternative_hotels: alternatives,
    projected_annual_savings: bestSavings,
  });
}
