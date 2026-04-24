import type { WeatherData } from "../types.js";

const CONDITIONS = ["Sunny", "Partly Cloudy", "Overcast", "Light Rain", "Clear", "Scattered Clouds", "Fog"];
const FORECASTS = [
  "Generally mild with some cloud cover expected mid-week.",
  "Warm and dry spell continuing through the weekend.",
  "Rain expected on Thursday, clearing by Friday evening.",
  "Temperatures rising gradually. UV protection recommended.",
  "Mixed conditions. Pack layers and a light rain jacket.",
  "Stable high pressure bringing clear skies all week.",
];

// City-specific temperature ranges (°C)
const CITY_TEMPS: Record<string, [number, number]> = {
  london: [8, 22],
  paris: [10, 26],
  amsterdam: [7, 21],
  berlin: [6, 24],
  rome: [14, 32],
  tokyo: [10, 30],
  dubai: [25, 45],
  singapore: [26, 34],
  sydney: [12, 28],
  "new york": [5, 30],
};

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

export function generateWeather(city: string): WeatherData {
  const key = city.toLowerCase();
  const rand = seededRandom(key + new Date().toISOString().split("T")[0]);

  const [minTemp, maxTemp] = CITY_TEMPS[key] || [10, 28];
  const temp = Math.floor(minTemp + rand() * (maxTemp - minTemp));
  const feels = temp + Math.floor(rand() * 4) - 2;
  const condition = CONDITIONS[Math.floor(rand() * CONDITIONS.length)];
  const humidity = Math.floor(40 + rand() * 40);
  const wind = Math.floor(5 + rand() * 30);
  const uv = Math.floor(rand() * 8);
  const vis = Math.floor(8 + rand() * 14);
  const forecast = FORECASTS[Math.floor(rand() * FORECASTS.length)];

  let suitability = "Good for travel";
  if (condition === "Light Rain" || condition === "Fog") suitability = "Bring umbrella and layers";
  if (temp > 38) suitability = "Very hot — stay hydrated, avoid midday sun";
  if (temp < 5) suitability = "Cold — bring warm layers";

  return {
    city,
    temperature: `${temp}°C`,
    feelsLike: `${feels}°C`,
    condition,
    humidity: `${humidity}%`,
    windSpeed: `${wind} km/h`,
    uvIndex: uv,
    visibility: `${vis} km`,
    travelSuitability: suitability,
    forecast7Days: forecast,
  };
}
