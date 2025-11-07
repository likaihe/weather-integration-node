import { GetWeatherSummaryQuery, WeatherSummary } from "../dto/weather.dto";
import { getByLocation } from "../clients/openweather.client";
import { mapToWeatherSummary } from "./weather.mapper";

export const getWeatherSummary = async (
  query: GetWeatherSummaryQuery
): Promise<WeatherSummary> => {


  const location = {
    city: query.city ?? null,
    lat: query.lat ?? null,
    lon: query.lon ?? null,
  };

  
  const currentWeather = await getByLocation(location);


  return mapToWeatherSummary(currentWeather, query.units);
};
