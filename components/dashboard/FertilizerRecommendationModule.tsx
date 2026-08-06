"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Droplet,
  Calendar,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface FertilizerModuleProps {
  location: LocationInfo;
  currentWeather: WeatherData;
}

export const FertilizerRecommendationModule: React.FC<FertilizerModuleProps> = ({ location, currentWeather }) => {
  const { t, language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState("Paddy / Rice");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [farmAcres, setFarmAcres] = useState<number>(2);

  const isHi = language === "hi";
  const isMr = language === "mr";

  const getFertilizerSchedule = () => {
    const acres = Math.max(0.5, farmAcres);

    if (selectedCrop.includes("Paddy")) {
      return {
        totalNPKRatio: "120 : 60 : 60 NPK kg/Hectare",
        expectedYieldBoost: "+18% Yield Gain",
        stages: [
          {
            stageName: isHi ? "चरण 1: बेसल खुराक (रोपाई / बुवाई के समय)" : isMr ? "टप्पा १: पायाभूत मात्रा (लागवडीवेळी)" : "Stage 1: Basal Dose (At Transplanting / Sowing)",
            timing: isHi ? "दिन 0 - खेत की अंतिम तैयारी के दौरान" : isMr ? "दिवस ० - शेवटच्या नांगरणीवेळी" : "Day 0 - During final field preparation",
            products: [
              { name: "DAP (18-46-0)", dosePerAcre: "50 kg (1 Bag)", totalForFarm: `${Math.round(1 * acres)} Bags` },
              { name: "MOP (60% K2O)", dosePerAcre: "25 kg (0.5 Bag)", totalForFarm: `${Math.round(0.5 * acres * 10) / 10} Bags` },
              { name: "Zinc Sulphate (21%)", dosePerAcre: "10 kg", totalForFarm: `${Math.round(10 * acres)} kg` },
            ],
            precautions: isHi ? "जिंक सल्फेट को डीएपी के साथ सीधे न मिलाएं।" : isMr ? "झिंक सल्फेट व डीएपी एकत्र करू नका." : "Do not mix Zinc Sulphate directly with DAP to avoid insoluble Zinc Phosphate formation.",
          },
          {
            stageName: isHi ? "चरण 2: पहला टॉप ड्रेसिंग (कल्ले निकलने की अवस्था)" : isMr ? "टप्पा २: पहिली मात्रा (फुटवे फुटतेवेळी)" : "Stage 2: 1st Top Dressing (Active Tillering Stage)",
            timing: isHi ? "रोपाई के 20 - 25 दिन बाद" : isMr ? "लागवडीनंतर २० - २५ दिवसांनी" : "Day 20 - 25 after transplanting",
            products: [
              { name: "Neem Coated Urea", dosePerAcre: "45 kg (1 Bag)", totalForFarm: `${Math.round(1 * acres)} Bags` },
            ],
            precautions: isHi ? "अतिरिक्त पानी निकालने के बाद गीली मिट्टी में प्रयोग करें।" : isMr ? "जमिनीवर पाणी साचलेले असताना फवारू नका." : "Apply in moist soil after draining excess surface water.",
          },
        ],
      };
    } else {
      return {
        totalNPKRatio: "150 : 60 : 60 NPK kg/Hectare",
        expectedYieldBoost: "+22% Yield & Quality Boost",
        stages: [
          {
            stageName: isHi ? "चरण 1: बेसल खुराक (बुवाई)" : isMr ? "टप्पा १: पायाभूत मात्रा (पेरणी)" : "Stage 1: Basal Dose (Sowing)",
            timing: isHi ? "दिन 0 - बीज बुवाई के समय" : isMr ? "दिवस ० - पेरणीवेळी" : "Day 0 - Seed placement time",
            products: [
              { name: "DAP (18-46-0)", dosePerAcre: "60 kg (1.2 Bags)", totalForFarm: `${Math.round(1.2 * acres)} Bags` },
              { name: "MOP (60% K2O)", dosePerAcre: "30 kg (0.6 Bag)", totalForFarm: `${Math.round(0.6 * acres)} Bags` },
            ],
            precautions: isHi ? "उर्वरक को बीज की पंक्ति से 5 सेमी दूर और गहराई पर डालें।" : isMr ? "बियाण्यापासून ५ सेंमी अंतरावर खत टाका." : "Drill fertilizers 5 cm below and 5 cm away from seed row.",
          },
        ],
      };
    }
  };

  const schedule = getFertilizerSchedule();

  return (
    <div className="space-y-6">
      {/* Hero Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <Zap className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("fertilizer.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("fertilizer.heroDesc")}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-extrabold shadow-md shrink-0">
          Target Gain: {schedule.expectedYieldBoost}
        </div>
      </div>

      {/* Input Toolbar */}
      <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xl">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("fertilizer.selectCrop")}</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          >
            <option value="Paddy / Rice">Paddy / Rice</option>
            <option value="Cotton">Cotton</option>
            <option value="Wheat">Wheat</option>
            <option value="Sugarcane">Sugarcane</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("fertilizer.selectSoil")}</label>
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
          <label className="block text-xs font-bold text-slate-300 mb-1">{t("fertilizer.farmAcres")}</label>
          <input
            type="number"
            min="0.5"
            max="50"
            step="0.5"
            value={farmAcres}
            onChange={(e) => setFarmAcres(parseFloat(e.target.value) || 1)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Schedule Output */}
      <div className="space-y-4">
        {schedule.stages.map((stage, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <h3 className="text-base font-black text-amber-300">{stage.stageName}</h3>
              <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400">
                ⏰ {stage.timing}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stage.products.map((prod, pIdx) => (
                <div key={pIdx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-xs font-black text-white block">{prod.name}</span>
                  <span className="text-[11px] text-amber-300 font-bold block">Dose: {prod.dosePerAcre}</span>
                  <span className="text-[10px] text-slate-400 block">Total for {farmAcres} Acres: {prod.totalForFarm}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-300 font-medium pt-1">
              ⚠️ <span className="font-bold text-amber-400">Precaution:</span> {stage.precautions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
