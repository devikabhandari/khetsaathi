"use client";

import { useLocation, WeatherData, ForecastDay, LocationInfo, PermissionState } from "../context/LocationContext";

export type { WeatherData, ForecastDay, LocationInfo, PermissionState };

/**
 * useLocationWeather Hook
 * Now connects to the singleton LocationContext to ensure 100% synchronized state
 * across all modules (ConversationalDashboard, WeatherIntelligence, CropProblemInvestigation, etc.)
 */
export function useLocationWeather() {
  return useLocation();
}
