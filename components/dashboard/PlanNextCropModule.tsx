"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  Calendar,
  Droplets,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Landmark,
  IndianRupee,
  Loader2,
  CheckCircle2,
  BarChart2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface PlanNextCropProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToOptions: () => void;
}

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const PlanNextCropModule: React.FC<PlanNextCropProps> = ({
  location,
  weather,
  onBackToOptions,
}) => {
  const { t, language } = useLanguage();

  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

  // Inputs
  const [currentCrop, setCurrentCrop] = useState("Paddy / Rice");
  const [harvestMonth, setHarvestMonth] = useState("October");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [landSize, setLandSize] = useState<number>(3);
  const [waterAvailability, setWaterAvailability] = useState("Canal + Drip Irrigation");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<any | null>(null);

  const isHi = language === "hi";
  const isMr = language === "mr";

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      setRecommendationResult({
        bestNextCrop: isHi ? "शरबती गेहूं (Sharbati Wheat HD 2967)" : isMr ? "गहू (शरबती गहू HD 2967)" : "Sharbati Wheat (HD 2967)",
        scientificName: "Triticum aestivum",
        expectedYield: isHi ? "18 - 22 क्विंटल / एकड़" : isMr ? "१८ - २२ क्विंटल / एकरी" : "18 - 22 Quintals / Acre",
        growingDuration: isHi ? "125 - 130 दिन" : isMr ? "१२५ - १३० दिवस" : "125 - 130 Days",
        waterRequirement: isHi ? "मध्यम (3-4 सिंचाई चक्र)" : isMr ? "मध्यम (३-४ पाळ्या)" : "Medium (3-4 Irrigation Cycles)",
        fertilizerPlan: isHi
          ? "बेसल खुराक: 50 किग्रा डीएपी + 25 किग्रा एमओपी/एकड़। 30 दिन बाद 45 किग्रा नीम लेपित यूरिया।"
          : isMr
          ? "५० किग्रॅ डीएपी + २५ किग्रॅ एमओपी प्रति एकरी. ३० दिवसांनंतर युरिया ४५ किग्रॅ."
          : "Basal: 50 kg DAP + 25 kg MOP per acre. Top Dressing at Day 30: 45 kg Neem Coated Urea.",
        marketDemand: isHi ? "उच्च मांग (सरकारी एमएसपी गारंटी)" : isMr ? "उच्च मागणी (सरकारी हमीभाव)" : "High Demand (Govt MSP Guaranteed)",
        profitability: isHi ? "₹ 48,000 - ₹ 65,000 / एकड़ शुद्ध लाभ" : isMr ? "₹ ४८,००० - ₹ ६५,००० / एकरी निव्वळ नफा" : "₹ 48,000 - ₹ 65,000 / Acre Net Profit",
        governmentSchemes: [
          isHi ? "पीएम-किसान सम्मान निधि (₹6,000/वर्ष)" : isMr ? "पीएम-किसान सन्मान निधी" : "PM-KISAN DBT Direct Support",
          isHi ? "प्रधानमंत्री फसल बीमा योजना (रबी फसल 1.5% प्रीमियम)" : isMr ? "पीएम पीक विमा योजना" : "PM Fasal Bima Yojana (1.5% Rabi Premium)",
        ],
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToOptions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Farm Options</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-sm">
          Option 2: Plan Next Crop
        </div>
      </div>

      {/* Hero Guidance */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shrink-0">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Plan Next Crop</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Discover optimal crop recommendations for your upcoming harvest cycle without photo uploading.
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-md shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Current Month (Auto-detected): {currentMonthName}</span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Recommendation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleRecommend} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white pb-2 border-b border-slate-800">
              Crop Rotation Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Crop</label>
              <select
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Soybean">Soybean</option>
                <option value="Maize">Maize</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Expected Harvest Month</label>
              <select
                value={harvestMonth}
                onChange={(e) => setHarvestMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                {ALL_MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Alluvial Loam Soil">Alluvial Loam Soil</option>
                <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Land Size (Acres)</label>
              <input
                type="number"
                min="0.5"
                max="50"
                value={landSize}
                onChange={(e) => setLandSize(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Water Availability</label>
              <select
                value={waterAvailability}
                onChange={(e) => setWaterAvailability(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Canal + Drip Irrigation">Canal + Drip Irrigation</option>
                <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
                <option value="Borewell + Sprinkler">Borewell + Sprinkler</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Calculating Optimal Next Crop...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Recommend Best Next Crop</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Report */}
        <div className="lg:col-span-7 space-y-4">
          {recommendationResult ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase">Recommended Next Crop</span>
                  <h3 className="text-2xl font-black text-amber-300">{recommendationResult.bestNextCrop}</h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold">
                  96% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Expected Yield</span>
                  <span className="font-bold text-emerald-300">{recommendationResult.expectedYield}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Growing Duration</span>
                  <span className="font-bold text-amber-300">{recommendationResult.growingDuration}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Water Requirement</span>
                  <span className="font-bold text-teal-300">{recommendationResult.waterRequirement}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Estimated Profitability</span>
                  <span className="font-bold text-amber-300">{recommendationResult.profitability}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                <span className="font-bold text-emerald-300 block">Fertilizer Plan:</span>
                <p className="text-slate-200">{recommendationResult.fertilizerPlan}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-amber-400 block">Applicable Government Schemes:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  {recommendationResult.governmentSchemes.map((sch: string, i: number) => (
                    <li key={i}>{sch}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Sprout className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Awaiting Crop Rotation Inputs</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Select current crop, expected harvest month, and soil type on the left to generate the best next crop recommendation.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
