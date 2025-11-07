import "dotenv/config";

export type Location = {
  lat?: number | null;
  lon?: number | null;
  city?: string | null; 
};

export type CurrentWeather = {
  name: string;
  main: { temp: number | null };
  weather: Array<{ description: string; main: string }>;
  wind: { speed: number | null };
  dt: number;
};


const BASE_URL = (process.env.OPENWEATHER_BASE_URL ?? "");
const API_KEY = process.env.OPENWEATHER_API_KEY ?? "";

if (!BASE_URL) throw new Error("Missing OPENWEATHER_BASE_URL");
if (!API_KEY) throw new Error("Missing OPENWEATHER_API_KEY");

export const getByLocation = async (location: Location): Promise<CurrentWeather> => {
  const qs = new URLSearchParams();
  if (location.lat != null) qs.set("lat", String(location.lat));
  if (location.lon != null) qs.set("lon", String(location.lon));
  if (location.city!= null) qs.set("q", location.city);
  qs.set("appid", API_KEY);

  const resp = await fetch(`${BASE_URL}?${qs.toString()}`, { method: "GET" });
  if (!resp.ok) {
    let body = "";
    try { body = await resp.text(); } catch {}
    throw new Error(`OpenWeather HTTP ${resp.status} ${resp.statusText}${body ? `: ${body}` : ""}`);
  }

  return (await resp.json()) as CurrentWeather;
};
