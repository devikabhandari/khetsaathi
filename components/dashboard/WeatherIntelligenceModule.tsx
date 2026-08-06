"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  AlertTriangle,
  Sun,
  Sunrise,
  Sunset,
  Calendar,
  Sparkles,
  MapPin,
  RefreshCw,
  Gauge,
  Info,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { WeatherData, ForecastDay, LocationInfo } from "../../hooks/useLocationWeather";

interface WeatherModuleProps {
  location: LocationInfo;
  currentWeather: WeatherData;
  forecast: ForecastDay[];
  loading: boolean;
  onRefreshLocation: () => void;
}

export const WeatherIntelligenceModule: React.FC<WeatherModuleProps> = ({
  location,
  currentWeather,
  forecast,
  loading,
  onRefreshLocation,
}) => {
  const { t, language } = useLanguage();

  const isHi = language === "hi";
  const isMr = language === "mr";

  const getFarmingAdvice = () => {
    const adviceList = [];

    if (currentWeather.humidity >= 65) {
      adviceList.push({
        title: isHi
          ? "उच्च आर्द्रता एवं कवक रोग जोखिम चेतावनी"
          : isMr
          ? "जास्त आर्द्रता व बुरशीजन्य रोग धोका इशारा"
          : "High Humidity & Fungal Risk Notice",
        impact: isHi
          ? "65% से अधिक हवा में नमी से पत्तियों पर कवक और पफूंदी के बीजाणु तेजी से पनपते हैं।"
          : isMr
          ? "६५% पेक्षा जास्त हवेतील आर्द्रतेमुळे पानांवर बुरशीचा प्रादुर्भाव वेगाने वाढतो."
          : "High humidity (above 65%) creates ideal conditions for fungal spore multiplication on crops.",
        action: isHi
          ? "पत्तियों पर नीम तेल घोल या जैविक कवकनाशी का छिड़काव करें।"
          : isMr
          ? "पानांवर कडुनिंब तेल द्रावण किंवा सेंद्रिय बुरशीनाशक फवारा."
          : "Inspect crop foliage for dark spots. Consider applying organic neem oil spray.",
        tag: isHi ? "रोग जोखिम" : isMr ? "रोग धोका" : "Disease Risk",
        color: "amber",
      });
    }

    const highRainDay = forecast.find((d) => d.rainProb >= 50 || d.condition.includes("Rain"));
    if (highRainDay) {
      adviceList.push({
        title: isHi
          ? `भारी वर्षा की संभावना (${highRainDay.dayName}) - खाद छिड़काव स्थगित रखें`
          : isMr
          ? `जोरदार पावसाची शक्यता (${highRainDay.dayName}) - खत फवारणी पुढे ढकला`
          : `Heavy Rainfall Expected (${highRainDay.dayName}) - Delay Fertilizer Application`,
        impact: isHi
          ? "भारी बारिश से यूरिया और डीएपी खाद का बहकर नुकसान हो सकता है।"
          : isMr
          ? "जोरदार पावसामुळे युरिया व खते वाहून जाण्याची शक्यता असते."
          : "High rainfall probability causes nitrogen runoff and fertilizer leaching from topsoil.",
        action: isHi
          ? "बारिश थमने तक यूरिया या डीएपी का छिड़काव रोक दें।"
          : isMr
          ? "पाऊस ओसरेपर्यंत युरिया व खतांची फवारणी थांबवा."
          : "Hold off on top dressing Urea or DAP until rainfall subsides to prevent nutrient loss.",
        tag: isHi ? "उर्वरक अनुसूची" : isMr ? "खत नियोजन" : "Fertilizer Schedule",
        color: "teal",
      });
    }

    if (currentWeather.windSpeed >= 15) {
      adviceList.push({
        title: isHi
          ? "तेज हवाएं - छोटे पौधों की सुरक्षा करें"
          : isMr
          ? "वेगाने वारा - लहान रोपांचे संरक्षण करा"
          : "Strong Winds - Protect Young Seedlings",
        impact: isHi
          ? `वर्तमान हवा की गति ${currentWeather.windSpeed} किमी/घंटा है, जिससे कीटनाशक का छिड़काव बह सकता है।`
          : isMr
          ? `सध्या वाऱ्याचा वेग ${currentWeather.windSpeed} किमी/तास आहे, ज्यामुळे औषध फवारणी उडून जाते.`
          : `Current wind velocity of ${currentWeather.windSpeed} km/h causes pesticide spray drift.`,
        action: isHi
          ? "उच्च दबाव वाले छिड़काव को स्थगित करें। केले और गन्ने की फसलों को सहारा दें।"
          : isMr
          ? "कीटकनाशक फवारणी पुढे ढकला. केळी व ऊस पिकाला आधार द्या."
          : "Postpone high-pressure spraying. Secure banana stalks and sugarcane clumps.",
        tag: isHi ? "वायु सुरक्षा" : isMr ? "वारा संरक्षण" : "Wind Protection",
        color: "blue",
      });
    }

    return adviceList;
  };

  const adviceItems = getFarmingAdvice();

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <CloudRain className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("weather.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("weather.heroDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-md">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{location.district}, {location.state}</span>
          </div>

          <button
            onClick={onRefreshLocation}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950 transition-all cursor-pointer"
            title={t("weather.refreshGps")}
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Current Weather Metrics & Farming Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Weather Parameters Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t("weather.currentCondition")}
              </span>
              <span className="text-xs font-black text-amber-300 bg-slate-950 px-3 py-1 rounded-full border border-amber-500/30">
                {currentWeather.condition}
              </span>
            </div>

            {/* Main Temperature Display */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-black text-white flex items-start">
                  <span>{currentWeather.temp}</span>
                  <span className="text-2xl font-bold text-amber-400">°C</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold block mt-1">
                  Feels like {currentWeather.temp + 1}°C • {location.district}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center">
                <Sun className="w-8 h-8 text-amber-400 mx-auto mb-1 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-300 block">{currentWeather.sunrise}</span>
              </div>
            </div>

            {/* Grid of Weather Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t("weather.humidity")}</span>
                </span>
                <span className="text-base font-black text-teal-300">{currentWeather.humidity}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t("weather.windSpeed")}</span>
                </span>
                <span className="text-base font-black text-blue-300">{currentWeather.windSpeed} km/h</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t("weather.rainfall")}</span>
                </span>
                <span className="text-base font-black text-indigo-300">{currentWeather.rainfall} mm</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t("weather.uvIndex")}</span>
                </span>
                <span className="text-base font-black text-amber-300">{currentWeather.uvIndex}</span>
              </div>
            </div>

            {/* AQI Notice */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400">{t("weather.aqi")}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-black">
                {currentWeather.aqi} - {currentWeather.aqiText}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Farming Advice & 7-Day Forecast */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Farming Advice Section */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              <span>{t("weather.farmingAdvice")}</span>
            </h3>

            <div className="space-y-3">
              {adviceItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-300">{item.title}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.impact}</p>
                  <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5 pt-1">
                    <span>💡 Action:</span>
                    <span>{item.action}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast Section */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Calendar className="w-4.5 h-4.5 text-emerald-400" />
              <span>{t("weather.forecast7Days")}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {forecast.map((day, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1.5 shadow-sm">
                  <span className="text-[11px] font-bold text-amber-300 block">{day.dayName}</span>
                  <div className="text-xs font-black text-white">{day.maxTemp}° / {day.minTemp}°</div>
                  <span className="text-[10px] text-teal-300 font-semibold block">🌧 {day.rainProb}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
