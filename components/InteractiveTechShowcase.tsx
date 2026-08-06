"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Calculator, Sprout, Droplets, TrendingUp, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export const InteractiveTechShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [landAcres, setLandAcres] = useState<number>(5);
  const [cropType, setCropType] = useState<string>("wheat");

  const cropFactors: Record<string, { label: string; baseProfitPerAcre: number; waterSavedPerAcre: number }> = {
    wheat: { label: "Wheat (गेहूं / गव्हा)", baseProfitPerAcre: 14500, waterSavedPerAcre: 45000 },
    rice: { label: "Paddy / Rice (धान / भात)", baseProfitPerAcre: 18000, waterSavedPerAcre: 68000 },
    cotton: { label: "Cotton (कपास / कापूस)", baseProfitPerAcre: 21000, waterSavedPerAcre: 52000 },
    sugarcane: { label: "Sugarcane (गन्ना / ऊस)", baseProfitPerAcre: 28000, waterSavedPerAcre: 95000 },
    vegetables: { label: "Fruits & Veggies (फल-सब्जियां / फळे-भाज्या)", baseProfitPerAcre: 32000, waterSavedPerAcre: 38000 },
  };

  const selectedCrop = cropFactors[cropType] || cropFactors.wheat;
  const estimatedProfit = (landAcres * selectedCrop.baseProfitPerAcre).toLocaleString("en-IN");
  const estimatedWater = (landAcres * selectedCrop.waterSavedPerAcre).toLocaleString("en-IN");

  const handleCelebrate = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10B981", "#34D399", "#F59E0B"],
    });
  };

  return (
    <section className="py-20 bg-slate-900/60 border-y border-emerald-900/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-slate-950/90 border border-emerald-500/30 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          
          {/* Top Decorative Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("calculator.badge")}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                {t("calculator.title")}
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-1">
                {t("calculator.subtitle")}
              </p>
            </div>

            <button
              onClick={handleCelebrate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Simulate Harvest Success</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Input Controls */}
            <div className="flex flex-col gap-6">
              
              {/* Land Size Slider */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-emerald-400" />
                    <span>{t("calculator.landSizeLabel")}</span>
                  </label>
                  <span className="text-xl font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30">
                    {landAcres} Acres
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={landAcres}
                  onChange={(e) => setLandAcres(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>1 Acre</span>
                  <span>25 Acres</span>
                  <span>50 Acres</span>
                </div>
              </div>

              {/* Crop Selector */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>{t("calculator.cropTypeLabel")}</span>
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm font-medium focus:border-emerald-500 focus:outline-none"
                >
                  {Object.entries(cropFactors).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Simulated Results Card */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/60 border border-emerald-500/40 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-40 h-40 text-emerald-400" />
              </div>

              <div className="relative z-10 space-y-6">
                
                {/* Profit Result */}
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-emerald-400 mb-1">
                    {t("calculator.estimatedIncrease")}
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-white bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                    {t("calculator.currency")} {estimatedProfit}
                  </div>
                </div>

                {/* Water Saving Result */}
                <div className="pt-4 border-t border-slate-800/80">
                  <div className="text-xs uppercase font-bold tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>{t("calculator.waterSaving")}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-200">
                    {estimatedWater} {t("calculator.liters")}
                  </div>
                </div>

              </div>

              <div className="relative z-10 mt-6 pt-4 text-xs text-slate-400 italic">
                * Based on regional satellite agronomic data and historical mandi yield comparisons.
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
