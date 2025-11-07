import { Router } from "express";
import { getWeatherSummary } from "../controllers/weather.controller";

const router = Router();
router.get("/weather/summary", getWeatherSummary);
export default router;