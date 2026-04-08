/**
 * Deterministic price simulator for MVP demo.
 * Generates realistic Brazilian hotel prices with weekday/weekend variation.
 */

interface PriceEntry {
  date: string; // YYYY-MM-DD
  price: number; // R$
}

/**
 * Simple deterministic hash from a string → number between 0 and 1.
 */
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash % 10000) / 10000;
}

/**
 * Seeded pseudo-random number generator (simple LCG).
 */
function seededRandom(seed: number): () => number {
  let state = seed * 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

/**
 * Determine base price tier from hotel name.
 * Budget: <R$200, Midscale: R$200-400, Upscale: R$400-700
 */
function getBasePriceForHotel(hotelName: string, city: string): number {
  const name = hotelName.toLowerCase();
  const seed = hashSeed(hotelName + city);

  // Upscale brands
  if (
    name.includes("hilton") ||
    name.includes("sheraton") ||
    name.includes("marriott") ||
    name.includes("renaissance") ||
    name.includes("fasano") ||
    name.includes("palácio") ||
    name.includes("grand")
  ) {
    return 400 + seed * 300; // R$400-700
  }

  // Midscale brands
  if (
    name.includes("mercure") ||
    name.includes("novotel") ||
    name.includes("quality") ||
    name.includes("comfort") ||
    name.includes("holiday inn") ||
    name.includes("radisson") ||
    name.includes("intercity")
  ) {
    return 200 + seed * 200; // R$200-400
  }

  // Budget brands
  if (
    name.includes("ibis") ||
    name.includes("go inn") ||
    name.includes("slim") ||
    name.includes("sleep inn") ||
    name.includes("formulaone")
  ) {
    return 100 + seed * 100; // R$100-200
  }

  // Default: midscale range
  return 180 + seed * 220; // R$180-400
}

/**
 * Check if a date falls on a weekend (Saturday or Sunday).
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Generate simulated hotel prices for a date range.
 * Deterministic: same inputs produce same outputs.
 */
export function generatePrices(
  hotelName: string,
  city: string,
  baseDate: Date,
  days: number
): PriceEntry[] {
  const basePrice = getBasePriceForHotel(hotelName, city);
  const seed = hashSeed(hotelName + city + baseDate.toISOString().slice(0, 7));
  const random = seededRandom(Math.floor(seed * 100000));

  const prices: PriceEntry[] = [];

  for (let offset = -days; offset <= days; offset++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + offset);

    // Base variation: ±10-25% around base price
    const variationFactor = 0.75 + random() * 0.5; // 0.75 to 1.25
    let price = basePrice * variationFactor;

    // Weekday prices are 15-30% higher than weekend
    if (!isWeekend(date)) {
      price *= 1.15 + random() * 0.15; // +15-30%
    }

    prices.push({
      date: date.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
    });
  }

  return prices;
}
