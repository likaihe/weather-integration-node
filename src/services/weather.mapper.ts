import { CurrentWeather } from "../clients/openweather.client";
import { WeatherSummary, TempUnits } from "../dto/weather.dto";

/** Constants */
const KELVIN_OFFSET = 273.15;
const HOTDAY_C_THRESHOLD = 30;               
const CONCRETE_MIN_C = 10;                   
const CONCRETE_MAX_WIND_KPH = 35;           
const PRECIP_BLOCKERS = new Set(["Rain", "Drizzle", "Thunderstorm", "Snow"]);


const isNil = (v: unknown): v is null | undefined => v == null;

const round1 = (n?: number): number | undefined =>
  isNil(n) || Number.isNaN(n) ? undefined : Math.round(n * 10) / 10;

const fromKelvin = (k?: number | null): { C?: number; F?: number } => {
  if (isNil(k)) return {};
  const c = k - KELVIN_OFFSET;
  return { C: c, F: c * 9 / 5 + 32 };
};

const toKph = (mps?: number | null): number | undefined =>
  isNil(mps) ? undefined : mps * 3.6;

const epochSecToIso = (epochSec?: number | null): string | undefined =>
  isNil(epochSec) ? undefined : new Date(epochSec * 1000).toISOString();

const firstDescription = (
  weathers?: Array<{ description: string; main: string }>
): string | undefined => weathers?.[0]?.description?.trim() || undefined;


const isHotDay = (tempC?: number): boolean | undefined =>
  isNil(tempC) ? undefined : tempC > HOTDAY_C_THRESHOLD;

const isGoodForConcretePouring = (cw: CurrentWeather): boolean | undefined => {
  const firstMain = cw.weather?.[0]?.main;
  const tempC = fromKelvin(cw.main?.temp).C;
  const windKph = toKph(cw.wind?.speed);

  if (isNil(firstMain) || isNil(tempC)) return undefined;

  if (PRECIP_BLOCKERS.has(firstMain)) return false;
  if (tempC <= CONCRETE_MIN_C) return false;
  if (!isNil(windKph) && windKph > CONCRETE_MAX_WIND_KPH) return false;

  return true;
};


export const mapToWeatherSummary = (
  currentWeather: CurrentWeather,
  unit: TempUnits ="F"
): WeatherSummary => {
  const tempK = currentWeather?.main?.temp;

  const { C: tempC, F: tempF } = fromKelvin(tempK);

  const windKph = toKph(currentWeather?.wind?.speed);
  const condition = firstDescription(currentWeather?.weather);
  const updatedAt = epochSecToIso(currentWeather?.dt) ?? new Date().toISOString();

  return {
    jobsite: currentWeather.name,
    temperatureC: unit === "C" ? round1(tempC) : undefined,
    temperatureF: unit === "F" ? round1(tempF) : undefined,
    condition,
    windSpeedKph: round1(windKph),
    updatedAt,
    isHotDay: isHotDay(tempC),
    isGoodForConcretePouring: isGoodForConcretePouring(currentWeather),
  };
};
