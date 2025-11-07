import { Request, Response, NextFunction } from "express";
import { getWeatherSummary as getWeatherSummaryService } from "../services/weather.service";
import { GetWeatherSummaryQuery } from "../dto/weather.dto";

export const getWeatherSummary = async (req: Request, res: Response, next: NextFunction) => {
  const q: GetWeatherSummaryQuery = {
    city: req.query.city as string | undefined,
    lat: req.query.lat !== undefined ? Number(req.query.lat) : undefined,
    lon: req.query.lon !== undefined ? Number(req.query.lon) : undefined,
    units: (req.query.units as "C" | "F" | undefined),
  };

  try {
    const summary = await getWeatherSummaryService(q);
    res.status(200).json(summary);
  } catch (err) {
    next(err); 
  }
};
