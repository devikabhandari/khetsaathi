"use client";

import { useState, useEffect, useCallback } from "react";

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  uvIndex: number;
  aqi: number;
  aqiText: string;
  sunrise: string;
  sunset: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  weatherCode: number;
  condition: string;
}

export interface LocationInfo {
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  source: "auto" | "manual" | "default";
}

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky ☀️",
  1: "Mainly Clear 🌤️",
  2: "Partly Cloudy ⛅",
  3: "Overcast ☁️",
  45: "Foggy 🌫️",
  48: "Depositing Rime Fog 🌫️",
  51: "Light Drizzle 🌧️",
  53: "Moderate Drizzle 🌧️",
  55: "Dense Drizzle 🌧️",
  61: "Slight Rain 🌦️",
  63: "Moderate Rain 🌧️",
  65: "Heavy Rain 🌧️⚡",
  80: "Slight Rain Showers 🌦️",
  81: "Moderate Rain Showers 🌧️",
  82: "Violent Rain Showers ⛈️",
  95: "Thunderstorm 🌩️",
};

const SESSION_STORAGE_KEY = "khetsaathi_user_location";

export function useLocationWeather() {
  const [location, setLocation] = useState<LocationInfo>({
    state: "Maharashtra",
    district: "Pune",
    village: "Haveli",
    latitude: 18.5204,
    longitude: 73.8567,
    source: "default",
  });

  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    temp: 28,
    humidity: 72,
    rainfall: 0,
    windSpeed: 12,
    weatherCode: 2,
    condition: "Partly Cloudy ⛅",
    uvIndex: 5.4,
    aqi: 42,
    aqiText: "Good (Clean Air)",
    sunrise: "06:12 AM",
    sunset: "07:08 PM",
  });

  const [forecast, setForecast] = useState<ForecastDay[]>([
    { date: "Today", dayName: "Today", maxTemp: 31, minTemp: 22, rainProb: 15, weatherCode: 2, condition: "Partly Cloudy ⛅" },
    { date: "Tomorrow", dayName: "Tomorrow", maxTemp: 30, minTemp: 21, rainProb: 40, weatherCode: 61, condition: "Slight Rain 🌦️" },
    { date: "Day 3", dayName: "Wed", maxTemp: 29, minTemp: 21, rainProb: 65, weatherCode: 63, condition: "Moderate Rain 🌧️" },
    { date: "Day 4", dayName: "Thu", maxTemp: 32, minTemp: 23, rainProb: 20, weatherCode: 1, condition: "Mainly Clear 🌤️" },
    { date: "Day 5", dayName: "Fri", maxTemp: 33, minTemp: 24, rainProb: 10, weatherCode: 0, condition: "Clear Sky ☀️" },
    { date: "Day 6", dayName: "Sat", maxTemp: 31, minTemp: 23, rainProb: 35, weatherCode: 2, condition: "Partly Cloudy ⛅" },
    { date: "Day 7", dayName: "Sun", maxTemp: 30, minTemp: 22, rainProb: 50, weatherCode: 80, condition: "Slight Rain Showers 🌦️" },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Restore stored session location on mount
  useEffect(() => {
    try {
      const savedLoc = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedLoc) {
        const parsed: LocationInfo = JSON.parse(savedLoc);
        setLocation(parsed);
        setPermissionState("granted");
        fetchWeather(parsed.latitude, parsed.longitude);
      }
    } catch (e) {
      console.warn("Failed to load session location", e);
    }
  }, []);

  // Save location to session
  const saveLocationToSession = (loc: LocationInfo) => {
    setLocation(loc);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loc));
    } catch (e) {
      console.warn("Failed to save location to session", e);
    }
  };

  // Fetch weather data given lat/lon
  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max&timezone=auto`
      );

      if (!res.ok) throw new Error("Weather API fetch failed");
      const data = await res.json();

      if (data.current) {
        const code = data.current.weather_code ?? 0;
        const uv = data.daily?.uv_index_max?.[0] ?? 5.5;
        const srRaw = data.daily?.sunrise?.[0];
        const ssRaw = data.daily?.sunset?.[0];

        const formatTime = (iso?: string) => {
          if (!iso) return "06:15 AM";
          const d = new Date(iso);
          return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        };

        setCurrentWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          rainfall: data.current.rain ?? 0,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: code,
          condition: WEATHER_DESCRIPTIONS[code] || "Clear Sky ☀️",
          uvIndex: Math.round(uv * 10) / 10,
          aqi: 42,
          aqiText: "Good (Clean Air)",
          sunrise: formatTime(srRaw),
          sunset: formatTime(ssRaw),
        });
      }

      if (data.daily && data.daily.time) {
        const days: ForecastDay[] = data.daily.time.map((tStr: string, idx: number) => {
          const dateObj = new Date(tStr);
          const dayName =
            idx === 0
              ? "Today"
              : idx === 1
              ? "Tomorrow"
              : dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const code = data.daily.weather_code[idx] ?? 0;

          return {
            date: tStr,
            dayName,
            maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
            minTemp: Math.round(data.daily.temperature_2m_min[idx]),
            rainProb: data.daily.precipitation_probability_max[idx] ?? 20,
            weatherCode: code,
            condition: WEATHER_DESCRIPTIONS[code] || "Clear Sky ☀️",
          };
        });
        setForecast(days);
      }
    } catch (err) {
      console.warn("Using fallback weather data", err);
    }
  }, []);

  // Reverse geocode lat/lon to State, District, Village via Nominatim
  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const addr = data.address || {};

      const state = addr.state || addr.region || "Maharashtra";
      const district =
        addr.state_district ||
        addr.district ||
        addr.county ||
        addr.city ||
        addr.town ||
        "Pune";
      const village =
        addr.village || addr.suburb || addr.neighbourhood || addr.town || "Khed";

      return { state, district, village };
    } catch (e) {
      console.warn("Reverse geocode failed", e);
      return null;
    }
  }, []);

  // Main trigger: Detect Geolocation
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionState("denied");
      setErrorMsg("Browser does not support Geolocation");
      return;
    }

    setLoading(true);
    setPermissionState("requesting");
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPermissionState("granted");

        const geoDetails = await reverseGeocode(lat, lon);

        const newLoc: LocationInfo = {
          state: geoDetails?.state || "Maharashtra",
          district: geoDetails?.district || "Pune",
          village: geoDetails?.village || "Near Farm",
          latitude: lat,
          longitude: lon,
          source: "auto",
        };

        saveLocationToSession(newLoc);
        await fetchWeather(lat, lon);
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation permission denied or error", err);
        setPermissionState("denied");
        setErrorMsg("Location permission denied. Using default/manual location.");
        setLoading(false);
        fetchWeather(18.5204, 73.8567);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchWeather, reverseGeocode]);

  const updateLocationManually = useCallback(
    async (state: string, district: string, village: string = "Farm Central") => {
      setLoading(true);
      const coordMap: Record<string, { lat: number; lon: number }> = {
        Maharashtra: { lat: 19.7515, lon: 75.7139 },
        Punjab: { lat: 31.1471, lon: 75.3412 },
        "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
        Gujarat: { lat: 22.2587, lon: 71.1924 },
        "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
        Karnataka: { lat: 15.3173, lon: 75.7139 },
        Haryana: { lat: 29.0588, lon: 76.0856 },
        Rajasthan: { lat: 27.0238, lon: 74.2179 },
        Telangana: { lat: 18.1124, lon: 79.0193 },
        Bihar: { lat: 25.0961, lon: 85.3131 },
      };

      const coords = coordMap[state] || { lat: 18.5204, lon: 73.8567 };

      const newLoc: LocationInfo = {
        state,
        district,
        village,
        latitude: coords.lat,
        longitude: coords.lon,
        source: "manual",
      };

      saveLocationToSession(newLoc);
      await fetchWeather(coords.lat, coords.lon);
      setLoading(false);
    },
    [fetchWeather]
  );

  return {
    location,
    currentWeather,
    forecast,
    loading,
    permissionState,
    errorMsg,
    requestLocation,
    updateLocationManually,
  };
}
