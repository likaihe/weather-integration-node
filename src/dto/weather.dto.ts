export type TempUnits = "C" | "F";

export type GetWeatherSummaryQuery = {
  city?: string;
  lat?: number;
  lon?: number;
  units?: TempUnits;
}

export type WeatherSummary = {
  jobsite: string;
  temperatureC?: number;
  temperatureF?: number;
  condition?: string;
  windSpeedKph?: number;
  updatedAt?: string;
  isHotDay?: boolean;
  isGoodForConcretePouring?: boolean;
}
