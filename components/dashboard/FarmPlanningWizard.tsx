"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout,
  AlertTriangle,
  Layers,
  FlaskConical,
  Zap,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Droplets,
  Calendar,
  IndianRupee,
  ShieldAlert,
  MapPin,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface FarmPlanningWizardProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToOptions?: () => void;
}

type WizardPath = "problem" | "new_crop" | "soil" | "fertilizer" | null;

export const FarmPlanningWizard: React.FC<FarmPlanningWizardProps> = ({
  location,
  weather,
  onBackToOptions,
}) => {
  const { t, language } = useLanguage();

  const [selectedPath, setSelectedPath] = useState<WizardPath>(null);
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Form States
  const [currentCrop, setCurrentCrop] = useState("Cotton");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [cropIssue, setCropIssue] = useState("Yellow leaves");
  const [farmAcres, setFarmAcres] = useState<number>(3);
  const [hasResult, setHasResult] = useState<boolean>(false);

  const isHi = language === "hi";
  const isMr = language === "mr";

  const handleSelectPath = (path: WizardPath) => {
    setSelectedPath(path);
    setWizardStep(2);
    setHasResult(false);
  };

  const handleBackStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
      setHasResult(false);
    } else {
      setSelectedPath(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedPath) {
              setSelectedPath(null);
              setWizardStep(1);
              setHasResult(false);
            } else if (onBackToOptions) {
              onBackToOptions();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{t("plantCare.back")}</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-sm">
          {location.district}, {location.state}
        </div>
      </div>

      {/* Path Selection Step 1 */}
      {!selectedPath && (
        <div className="space-y-6">
          <div className="text-center space-y-2 py-4">
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
              {t("wizard.title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Select one of the specialized planning workflows below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Path A */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectPath("problem")}
              className="p-6 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 text-left space-y-4 shadow-xl cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <AlertTriangle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black text-white">{t("wizard.pathA")}</h3>
              <p className="text-xs text-slate-300">Identify nutrient deficiencies or pest issues on active standing crops.</p>
            </motion.button>

            {/* Path B */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectPath("new_crop")}
              className="p-6 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 text-left space-y-4 shadow-xl cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <Sprout className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white">{t("wizard.pathB")}</h3>
              <p className="text-xs text-slate-300">Discover optimal crops matched to your upcoming season & soil.</p>
            </motion.button>
          </div>
        </div>
      )}

      {/* Wizard Form Step 2 */}
      {selectedPath && !hasResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-xl font-black text-white">{t("wizard.step2Title")}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Fill in your field specifications.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">{t("soil.selectSoilType")}</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              >
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Alluvial Loam Soil">Alluvial Loam Soil</option>
                <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Total Land Size (Acres)</label>
              <input
                type="number"
                min="0.5"
                max="50"
                value={farmAcres}
                onChange={(e) => setFarmAcres(parseFloat(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handleBackStep}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
            >
              {t("wizard.prev")}
            </button>
            <button
              onClick={() => setHasResult(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-300 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
            >
              {t("wizard.submit")}
            </button>
          </div>
        </div>
      )}

      {/* Generated Result */}
      {selectedPath && hasResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl max-w-4xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                {t("wizard.step5Title")}
              </span>
              <h3 className="text-2xl font-black text-amber-300 mt-0.5">
                {location.district}, {location.state} • {farmAcres} Acres
              </h3>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              AI Plan Ready
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
            <span className="font-bold text-amber-300 block">Recommended Action Steps:</span>
            <p>1. Apply 50kg DAP + 25kg MOP per acre during sowing based on {soilType} profile.</p>
            <p>2. Monitor soil moisture after current rainfall forecast for optimal seed germination.</p>
            <p>3. Utilize organic vermicompost to increase soil water retention capacity.</p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                setSelectedPath(null);
                setHasResult(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
            >
              Start New Plan
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
