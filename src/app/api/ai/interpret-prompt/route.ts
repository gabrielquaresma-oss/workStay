import { getOrCreateUser } from "@/lib/auth";
import client from "@/lib/claude-client";
import { DEFAULT_WEIGHTS } from "@/lib/stayscore-calculator";
import type { PromptInterpretation, StayScoreWeights } from "@/types/hotel";

const SYSTEM_PROMPT = `Você é o interpretador de buscas do workStay, uma plataforma de inteligência hoteleira para viajantes corporativos no Brasil.

O usuário vai descrever suas necessidades de viagem em português (ou ocasionalmente inglês). Você deve extrair parâmetros estruturados de busca e determinar pesos personalizados para o StayScore.

O StayScore tem 6 componentes. Os pesos PADRÃO são:
- wifi: 0.25 (qualidade do Wi-Fi)
- workspace_room: 0.20 (espaço de trabalho no quarto: mesa, cadeira, tomadas)
- workspace_hotel: 0.15 (áreas comuns para trabalho: lobby, business center)
- coworking_proximity: 0.15 (coworkings próximos)
- price_productivity: 0.15 (custo-benefício relativo a funcionalidades de trabalho)
- traveler_rating: 0.10 (satisfação geral dos hóspedes)

Ajuste esses pesos com base no que o usuário prioriza. Os pesos DEVEM somar exatamente 1.00.

Exemplos de ajustes:
- "Wi-Fi rápido" → wifi para 0.35, reduzir outros proporcionalmente
- "Silêncio e concentração" → workspace_room para 0.30
- "Orçamento apertado" → price_productivity para 0.30
- "Reuniões com clientes" → workspace_hotel para 0.25
- "Perto de coworking" → coworking_proximity para 0.25

Retorne APENAS JSON válido com esta estrutura exata:
{
  "destination": "nome da cidade para busca no Google Places",
  "weights": {
    "wifi": 0.25,
    "workspace_room": 0.20,
    "workspace_hotel": 0.15,
    "coworking_proximity": 0.15,
    "price_productivity": 0.15,
    "traveler_rating": 0.10
  },
  "priorities_summary": "Frase curta em PT-BR explicando o que foi priorizado e por quê",
  "search_query": "Query otimizada para Google Places, ex: 'Hotéis em São Paulo Paulista'",
  "confidence": 0.0-1.0
}

Regras importantes:
- A data de hoje é fornecida na mensagem do usuário para referência
- Se nenhuma cidade for claramente mencionada, defina destination como "" e confidence < 0.3
- Sempre responda em português para priorities_summary
- O search_query deve estar em português e otimizado para busca de hotéis no Google Places no Brasil
- Se o prompt mencionar um bairro específico (ex: "Paulista", "Savassi"), inclua no search_query`;

function buildFallback(prompt: string): PromptInterpretation {
  return {
    destination: prompt.trim(),
    weights: { ...DEFAULT_WEIGHTS },
    priorities_summary: "Busca geral com pesos padrão do StayScore",
    search_query: `Hotéis em ${prompt.trim()}`,
    original_prompt: prompt,
    confidence: 0.3,
  };
}

function normalizeWeights(weights: Record<string, number>): StayScoreWeights {
  const keys: (keyof StayScoreWeights)[] = [
    "wifi", "workspace_room", "workspace_hotel",
    "coworking_proximity", "price_productivity", "traveler_rating",
  ];

  // Verify all keys exist
  for (const k of keys) {
    if (typeof weights[k] !== "number" || weights[k] < 0) {
      return { ...DEFAULT_WEIGHTS };
    }
  }

  const sum = keys.reduce((s, k) => s + weights[k], 0);
  if (sum === 0) return { ...DEFAULT_WEIGHTS };

  const normalized = {} as StayScoreWeights;
  for (const k of keys) {
    normalized[k] = weights[k] / sum;
  }
  return normalized;
}

export async function POST(request: Request) {
  await getOrCreateUser();

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body JSON inválido" }, { status: 400 });
  }

  const { prompt } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return Response.json(
      { error: "Prompt é obrigatório (mínimo 3 caracteres)" },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Data de hoje: ${new Date().toISOString().slice(0, 10)}\n\nPedido do viajante: "${prompt.trim()}"`,
        },
      ],
    });

    // Extract JSON from response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return Response.json({ interpretation: buildFallback(prompt) });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const interpretation: PromptInterpretation = {
      destination: typeof parsed.destination === "string" ? parsed.destination : prompt.trim(),
      weights: normalizeWeights(parsed.weights ?? {}),
      priorities_summary:
        typeof parsed.priorities_summary === "string"
          ? parsed.priorities_summary
          : "Busca personalizada com IA",
      search_query:
        typeof parsed.search_query === "string"
          ? parsed.search_query
          : `Hotéis em ${parsed.destination || prompt.trim()}`,
      original_prompt: prompt.trim(),
      confidence:
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(1, parsed.confidence))
          : 0.5,
    };

    return Response.json({ interpretation });
  } catch (error) {
    console.error("AI interpret-prompt error:", error);
    return Response.json({ interpretation: buildFallback(prompt) });
  }
}
