import { getCurrentUser } from "@/lib/auth";
import client from "@/lib/claude-client";

const DEMO_INSIGHTS = [
  {
    type: "saving",
    title: "Economia com hotéis em BH",
    description:
      "Ao priorizar o Ibis BH Liberdade para viagens curtas, a empresa pode economizar R$2.400/mês sem perder produtividade.",
    action: "Ver alternativas em BH",
  },
  {
    type: "quality",
    title: "StayScore alto em SP",
    description:
      "O Hilton Morumbi tem o maior StayScore (92) mas o custo é 3x maior que alternativas com score acima de 80.",
    action: "Comparar hotéis em SP",
  },
  {
    type: "alert",
    title: "Wi-Fi problemático no Ibis Liberdade",
    description:
      "3 de 5 viajantes relataram problemas com Wi-Fi. Considere alternar para o Novotel Savassi (Wi-Fi score: 95).",
    action: "Ver reviews",
  },
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Não autenticado" }, { status: 401 });
  }
  if (user.role === "TRAVELER") {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Based on this hotel data for a corporate travel program:
- Top hotel: Hilton SP Morumbi (StayScore 92, R$700/night, 8 bookings)
- Most booked: Mercure BH Lourdes (StayScore 82, R$290/night, 12 bookings)
- Low-score: Ibis BH Liberdade (StayScore 62, R$170/night, 7 bookings - low wifi score)
- Total monthly spend: ~R$45,000

Generate 3-5 actionable insights in JSON format:
[{"type":"saving|quality|alert","title":"short title","description":"detailed text in Portuguese","action":"action button text"}]

Return only the JSON array.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (textBlock && textBlock.type === "text") {
      const match = textBlock.text.match(/\[[\s\S]*\]/);
      if (match) {
        const insights = JSON.parse(match[0]);
        return Response.json({ insights });
      }
    }
  } catch {
    // Fall through to demo insights
  }

  return Response.json({ insights: DEMO_INSIGHTS });
}
