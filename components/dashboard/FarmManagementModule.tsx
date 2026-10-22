"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sprout, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";
import { CropProblemInvestigationModule } from "./CropProblemInvestigationModule";
import { PlanNextCropModule } from "./PlanNextCropModule";

interface FarmManagementProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToChoices?: () => void;
}

type FarmOption = "problem" | "next_crop" | null;

export const FarmManagementModule: React.FC<FarmManagementProps> = ({
  location,
  weather,
  onBackToChoices,
}) => {
  const { t, language } = useLanguage();

  const [selectedOption, setSelectedOption] = useState<FarmOption>(null);

  const isHi = language === "hi";
  const isMr = language === "mr";

  if (selectedOption === "problem") {
    return (
      <CropProblemInvestigationModule
        location={location}
        weather={weather}
        onBackToOptions={() => setSelectedOption(null)}
      />
    );
  }

  if (selectedOption === "next_crop") {
    return (
      <PlanNextCropModule
        location={location}
        weather={weather}
        onBackToOptions={() => setSelectedOption(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChoices}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Use Case Selection</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-sm">
          🚜 Farm Management Workflow
        </div>
      </div>

      {/* Guidance Header */}
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
          Select Farm Management Service
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Choose the service that matches your current farm requirement below.
        </p>
      </div>

      {/* ONLY TWO OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        
        {/* Option 1: Existing Crop Has A Problem */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedOption("problem")}
          className="p-8 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 text-left space-y-5 shadow-2xl transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                Option 1
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Existing Crop Has A Problem
              </h3>
            </div>

            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Upload optional crop leaf photos and investigate soil deficiencies, yellowing, or growth issues on your current standing crop.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black text-amber-400">
            <span>Investigate Crop & Soil Problem</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.button>

        {/* Option 2: Plan Next Crop */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedOption("next_crop")}
          className="p-8 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 text-left space-y-5 shadow-2xl transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
              <Sprout className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                Option 2
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Plan Next Crop
              </h3>
            </div>

            <p className="text-xs font-semibold text-slate-300 leading-relaxed">
              Find AI-recommended crops, expected yields, water requirements, and government schemes for your upcoming seasonal harvest.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black text-emerald-400">
            <span>Calculate Next Suitable Crop</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.button>

      </div>
    </div>
  );
};
