import type { FlightResult } from "../types.js";

// Realistic airline data per route for variety
const AIRLINES: Record<string, { name: string; code: string }[]> = {
  default: [
    { name: "British Airways", code: "BA" },
    { name: "Air France", code: "AF" },
    { name: "Lufthansa", code: "LH" },
    { name: "KLM Royal Dutch", code: "KL" },
    { name: "easyJet", code: "EZ" },
    { name: "Ryanair", code: "FR" },
    { name: "Emirates", code: "EK" },
    { name: "Singapore Airlines", code: "SQ" },
    { name: "Qatar Airways", code: "QR" },
    { name: "ANA", code: "NH" },
  ],
};

const DURATIONS = ["1h 45m", "2h 10m", "2h 25m", "2h 50m", "3h 15m", "4h 30m", "6h 20m", "8h 45m", "10h 30m"];
const DEPART_TIMES = ["06:15", "08:00", "09:30", "11:30", "13:45", "16:00", "18:20", "21:05"];

function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  // Ensure h is positive
  h = Math.abs(h) || 1;
  return () => {
    h = (h * 48271) % 2147483647;
    return (h - 1) / 2147483646;
  };
}

export function generateFlights(from: string, to: string, date: string): {
  route: string;
  date: string;
  currency: string;
  results: FlightResult[];
  cheapest: string;
  recommended: string;
} {
  const rand = seededRandom(`${from}-${to}-${date}`);
  const airlines = AIRLINES.default;
  const count = 3 + Math.floor(rand() * 2); // 3-4 results

  const results: FlightResult[] = [];
  const usedAirlines = new Set<number>();

  for (let i = 0; i < count; i++) {
    let airlineIdx: number;
    do {
      airlineIdx = Math.floor(rand() * airlines.length);
    } while (usedAirlines.has(airlineIdx));
    usedAirlines.add(airlineIdx);

    const airline = airlines[airlineIdx];
    const flightNum = 100 + Math.floor(rand() * 900);
    const price = 79 + Math.floor(rand() * 350);
    const departIdx = Math.floor(rand() * DEPART_TIMES.length);
    const durationIdx = Math.floor(rand() * DURATIONS.length);
    const seats = 2 + Math.floor(rand() * 30);

    results.push({
      airline: airline.name,
      flight: `${airline.code}${flightNum}`,
      departs: DEPART_TIMES[departIdx],
      arrives: "—", // arrival depends on duration + timezone
      duration: DURATIONS[durationIdx],
      price: `$${price}`,
      seats,
    });
  }

  results.sort((a, b) => parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)));

  const cheapest = results[0].price;
  const rec = results.length > 1 ? results[1] : results[0];

  return {
    route: `${from} → ${to}`,
    date,
    currency: "USD",
    results,
    cheapest,
    recommended: `${rec.airline} ${rec.flight} at ${rec.price} — best balance of price and schedule`,
  };
}
