export interface WeatherData {
  temp: number;
  feelslike: number;
  conditions: string;
  icon: string;
  windSpeed: number;
  windDir: string;
  humidity: number;
  lastUpdated: string;
}

export const montenegrinCities = [
  { name: "Podgorica", lat: 42.4304, lon: 19.2594 },
  { name: "Nikšić", lat: 42.7731, lon: 18.9446 },
  { name: "Herceg Novi", lat: 42.4531, lon: 18.5375 },
  { name: "Pljevlja", lat: 43.3566, lon: 19.3584 },
  { name: "Bijelo Polje", lat: 43.0386, lon: 19.7476 },
  { name: "Bar", lat: 42.0938, lon: 19.1003 },
  { name: "Cetinje", lat: 42.3906, lon: 18.9214 },
  { name: "Berane", lat: 42.8425, lon: 19.8733 },
  { name: "Ulcinj", lat: 41.9292, lon: 19.2244 },
  { name: "Tivat", lat: 42.4028306, lon: 18.7206639 },
  { name: "Kotor", lat: 42.4247, lon: 18.7712 },
  { name: "Budva", lat: 42.2864, lon: 18.8402 },
  { name: "Rožaje", lat: 42.8347, lon: 20.1667 },
  { name: "Kolašin", lat: 42.82229, lon: 19.51653 },
  { name: "Žabljak", lat: 43.1400, lon: 19.0967 },
  { name: "Durmitor", lat: 43.1300, lon: 19.0500 },
  { name: "Plužine", lat: 43.1100, lon: 18.8500 },
  { name: "Plav", lat: 42.5900, lon: 19.9100 },
];

const weatherCache: Record<string, { data: WeatherData; timestamp: number }> = {};

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
  if (!apiKey) {
    throw new Error("WeatherAPI.com key not configured");
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`WeatherAPI error: ${response.status}`);
  }

  const data = await response.json();
  return {
    temp: data.current.temp_c,
    feelslike: data.current.feelslike_c,
    conditions: data.current.condition.text,
    icon: data.current.condition.icon,
    windSpeed: data.current.wind_kph,
    windDir: data.current.wind_dir,
    humidity: data.current.humidity,
    lastUpdated: data.current.last_updated,
  };
}

// Utility to get cache key
function getCacheKey(lat: number, lon: number) {
  return `${lat},${lon}`;
}

// Fetch and cache for all cities, update every X ms (default: 3 hours)
export async function fetchAllCitiesWeather(
  updateIntervalMs = 3 * 60 * 60 * 1000 // 3 hours
): Promise<Record<string, WeatherData>> {
  const now = Date.now();
  const promises = montenegrinCities.map(async (city) => {
    const key = getCacheKey(city.lat, city.lon);
    const cached = weatherCache[key];
    // If cached and not expired, use cache
    if (cached && now - cached.timestamp < updateIntervalMs) {
      return { name: city.name, data: cached.data };
    }
    // Else fetch and cache
    const data = await fetchWeather(city.lat, city.lon);
    weatherCache[key] = { data, timestamp: now };
    return { name: city.name, data };
  });

  const results = await Promise.all(promises);
  // Return as { cityName: WeatherData }
  return Object.fromEntries(results.map((r) => [r.name, r.data]));
}
