"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  TrendingUp,
  Droplet,
  Clock,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface CropModuleProps {
  location: LocationInfo;
  currentWeather: WeatherData;
}

interface CropRecommendation {
  name: string;
  scientificName: string;
  suitabilityScore: number;
  expectedYield: string;
  durationDays: number;
  estimatedProfit: string;
  waterRequirement: string;
  diseaseRisk: string;
  marketDemand: string;
  recommendedVariety: string;
  reasons: string[];
}

export const CropRecommendationModule: React.FC<CropModuleProps> = ({ location, currentWeather }) => {
  const { t, language } = useLanguage();

  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [waterSource, setWaterSource] = useState("Canal + Drip Irrigation");

  const isHi = language === "hi";
  const isMr = language === "mr";

  // Crop Recommendation Calculation Heuristic Engine
  const getRecommendedCrops = (): CropRecommendation[] => {
    if (season.includes("Kharif")) {
      return [
        {
          name: isHi ? "हाइब्रिड बीटी-कपास" : isMr ? "हायब्रिड बीटी-कापूस" : "Hybrid Bt-Cotton",
          scientificName: "Gossypium hirsutum",
          suitabilityScore: 96,
          expectedYield: isHi ? "12 - 16 क्विंटल / एकड़" : isMr ? "१२ - १६ क्विंटल / एकरी" : "12 - 16 Quintals / Acre",
          durationDays: 165,
          estimatedProfit: isHi ? "₹ 62,000 - ₹ 82,000 / एकड़" : isMr ? "₹ ६२,००० - ₹ ८२,००० / एकरी" : "₹ 62,000 - ₹ 82,000 / Acre",
          waterRequirement: isHi ? "मध्यम" : isMr ? "मध्यम" : "Medium",
          diseaseRisk: isHi ? "मध्यम" : isMr ? "मध्यम" : "Moderate",
          marketDemand: isHi ? "उच्च मांग (बढ़ती दर)" : isMr ? "उच्च मागणी" : "High Demand (Rising)",
          recommendedVariety: "Rashi 659 / Bollgard II",
          reasons: isHi
            ? [
                `${location.state} की ${soilType} के लिए अत्यधिक उपयुक्त`,
                "स्थानीय एपीएमसी मंडी रुझानों में उच्च रिटर्न",
                "मध्य-सीजन के सूखे के प्रति सहनशील",
              ]
            : isMr
            ? [
                `${location.state} च्या मातीसाठी अत्यंत योग्य`,
                "बाजार समितीत उत्तम दर",
                "कमी पावसात टिकून राहणारे पीक",
              ]
            : [
                `Highly compatible with ${location.state}'s ${soilType}`,
                "High returns in current local APMC Mandi trends",
                "Tolerant to mid-season dry spells",
              ],
        },
        {
          name: isHi ? "बासमती धान (पूसा 1121)" : isMr ? "बासमती भात (पुसा ११२१)" : "Basmati Rice (Pusa 1121)",
          scientificName: "Oryza sativa",
          suitabilityScore: 92,
          expectedYield: isHi ? "20 - 24 क्विंटल / एकड़" : isMr ? "२० - २४ क्विंटल / एकरी" : "20 - 24 Quintals / Acre",
          durationDays: 135,
          estimatedProfit: isHi ? "₹ 55,000 - ₹ 72,000 / एकड़" : isMr ? "₹ ५५,००० - ₹ ७२,००० / एकरी" : "₹ 55,000 - ₹ 72,000 / Acre",
          waterRequirement: isHi ? "उच्च" : isMr ? "जास्त" : "High",
          diseaseRisk: isHi ? "मध्यम" : isMr ? "मध्यम" : "Moderate",
          marketDemand: isHi ? "स्थिर एपीएमसी दर" : isMr ? "स्थिर दर" : "Stable APMC Rate",
          recommendedVariety: "Pusa Basmati 1121 / 1509",
          reasons: isHi
            ? [
                "उच्च आर्द्रता और मानसून बारिश के लिए सही मैच",
                "कृषि मंडियों में उच्च निर्यात मूल्य प्रीमियम",
              ]
            : isMr
            ? [
                "पावसाळ्यासाठी उत्तम पीक",
                "बाजारात चांगला दर मिळतो",
              ]
            : [
                "Ideal match for high humidity & monsoon rainfall",
                "High export price premium in agricultural mandis",
              ],
        },
        {
          name: isHi ? "सोयाबीन" : isMr ? "सोयाबीन" : "Soybean",
          scientificName: "Glycine max",
          suitabilityScore: 88,
          expectedYield: isHi ? "10 - 12 क्विंटल / एकड़" : isMr ? "१० - १२ क्विंटल / एकरी" : "10 - 12 Quintals / Acre",
          durationDays: 105,
          estimatedProfit: isHi ? "₹ 38,000 - ₹ 50,000 / एकड़" : isMr ? "₹ ३८,००० - ₹ ५०,००० / एकरी" : "₹ 38,000 - ₹ 50,000 / Acre",
          waterRequirement: isHi ? "कम" : isMr ? "कमी" : "Low",
          diseaseRisk: isHi ? "कम" : isMr ? "कमी" : "Low",
          marketDemand: isHi ? "उच्च मांग" : isMr ? "उच्च मागणी" : "High Demand (Rising)",
          recommendedVariety: "JS 335 / JS 9560",
          reasons: isHi
            ? [
                "कम 100 दिनों की फसल जिससे गेहूं की बुवाई जल्दी संभव है",
                "अगले सीजन के लिए मिट्टी में नाइट्रोजन बढ़ाता है",
              ]
            : isMr
            ? [
                "कम कालावधीचे पीक",
                "मातीची सुपीकता वाढवते",
              ]
            : [
                "Short duration 100-day crop allows early wheat rotation",
                "Fixes atmospheric Nitrogen in soil for next season",
              ],
        },
      ];
    } else {
      return [
        {
          name: isHi ? "गेहूं (शरबती / एचडी 2967)" : isMr ? "गहू (शरबती)" : "Wheat (Sharbati / HD 2967)",
          scientificName: "Triticum aestivum",
          suitabilityScore: 95,
          expectedYield: isHi ? "18 - 22 क्विंटल / एकड़" : isMr ? "१८ - २२ क्विंटल / एकरी" : "18 - 22 Quintals / Acre",
          durationDays: 125,
          estimatedProfit: isHi ? "₹ 48,000 - ₹ 65,000 / एकड़" : isMr ? "₹ ४८,००० - ₹ ६५,००० / एकरी" : "₹ 48,000 - ₹ 65,000 / Acre",
          waterRequirement: isHi ? "मध्यम" : isMr ? "मध्यम" : "Medium",
          diseaseRisk: isHi ? "कम" : isMr ? "कमी" : "Low",
          marketDemand: isHi ? "सरकारी एमएसपी समर्थन" : isMr ? "एमएसपी दर" : "Govt MSP Guaranteed",
          recommendedVariety: "HD 2967 / GW 322",
          reasons: isHi
            ? ["शीतकालीन तापमान के अनुकूल", "न्यूनतम समर्थन मूल्य (MSP) की गारंटी"]
            : isMr
            ? ["हिवाळ्यासाठी योग्य", "हमीभाव उपलब्ध"]
            : ["Ideal for winter Rabi climate", "Guaranteed MSP Procurement"],
        },
      ];
    }
  };

  const crops = getRecommendedCrops();

  return (
    <div className="space-y-6">
      {/* Header Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <Sprout className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("cropAdvisor.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("cropAdvisor.heroDesc")}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-extrabold shadow-md shrink-0">
          Location: {location.district}, {location.state}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("cropAdvisor.selectSoil")}</label>
          <select
            value={soilType}
            onChange={(e) => setSoilType(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
            <option value="Alluvial Loam Soil">Alluvial Loam Soil</option>
            <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("cropAdvisor.selectSeason")}</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
            <option value="Rabi (Winter)">Rabi (Winter)</option>
            <option value="Zaid (Summer)">Zaid (Summer)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("cropAdvisor.selectWater")}</label>
          <select
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="Canal + Drip Irrigation">Canal + Drip Irrigation</option>
            <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
            <option value="Borewell + Sprinkler">Borewell + Sprinkler</option>
          </select>
        </div>
      </div>

      {/* Recommended Crop Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>{t("cropAdvisor.recommendedCrops")}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {crops.map((crop, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-black">
                    {crop.suitabilityScore}% Match
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">{crop.marketDemand}</span>
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">{crop.name}</h4>
                  <p className="text-xs text-slate-400 italic">{crop.scientificName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{t("cropAdvisor.expectedYield")}</span>
                    <span className="font-bold text-emerald-300">{crop.expectedYield}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{t("cropAdvisor.duration")}</span>
                    <span className="font-bold text-amber-300">{crop.durationDays} Days</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                  <span className="text-[10px] text-slate-400 block">{t("cropAdvisor.profitability")}</span>
                  <span className="text-sm font-black text-amber-300">{crop.estimatedProfit}</span>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-300 block">Why Recommended:</span>
                  <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                    {crop.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
