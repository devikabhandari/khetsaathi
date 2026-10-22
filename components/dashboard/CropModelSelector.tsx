"use client";

import React, { useState } from "react";
import {
  CROP_DISEASE_MODEL_CONFIG,
  getAllModelCrops,
  getCropModelConfig,
  isCropModelAvailable,
  ModelCropConfig,
} from "../../config/cropDiseaseModelConfig";
import { useLanguage } from "../../context/LanguageContext";
import { CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, Sparkles, ShieldCheck } from "lucide-react";

interface CropModelSelectorProps {
  selectedCropId: string;
  onSelectCrop: (cropId: string) => void;
  className?: string;
}

export const CropModelSelector: React.FC<CropModelSelectorProps> = ({
  selectedCropId,
  onSelectCrop,
  className = "",
}) => {
  const { t, language } = useLanguage();
  const [showClasses, setShowClasses] = useState<boolean>(false);
  const [attemptedUnavailable, setAttemptedUnavailable] = useState<string | null>(null);

  const langKey = language === "hi" ? "hi" : language === "mr" ? "mr" : "en";
  const allCrops = getAllModelCrops();
  const currentCrop: ModelCropConfig = getCropModelConfig(selectedCropId);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    if (!isCropModelAvailable(newId)) {
      setAttemptedUnavailable(newId);
      return;
    }
    setAttemptedUnavailable(null);
    onSelectCrop(newId);
  };

  return (
    <div className={`p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-4 ${className}`}>
      
      {/* Title & Active Model Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="space-y-0.5">
          <label htmlFor="crop-model-select" className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t("plantCare.selectCropLabel") || "Select Crop for Photo Diagnosis"}</span>
          </label>
          <p className="text-[11px] text-slate-400">
            Phase 1 AI vision dataset scope: Tomato & Potato only.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t("plantCare.phase1Badge") || "Phase 1 Supported"}</span>
          </span>
        </div>
      </div>

      {/* Dropdown Selector */}
      <div className="space-y-1.5">
        <select
          id="crop-model-select"
          value={selectedCropId}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs font-bold text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all cursor-pointer"
        >
          {allCrops.map((crop) => {
            const cropTitle = crop.name[langKey] || crop.name.en;
            if (crop.isModelAvailable) {
              return (
                <option key={crop.id} value={crop.id} className="bg-slate-950 text-emerald-300 font-bold py-2">
                  ✅ {cropTitle} — Phase {crop.phase} Active ({crop.supportedClasses.length} {t("plantCare.classesCount") || "classes supported"})
                </option>
              );
            }
            return (
              <option key={crop.id} value={crop.id} disabled className="bg-slate-900 text-slate-500 italic py-2">
                🔒 {cropTitle} — Phase {crop.phase} ({t("plantCare.phase2Badge") || "Model in Training - Unavailable"})
              </option>
            );
          })}
        </select>

        {attemptedUnavailable && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t("plantCare.cropModelUnavailableWarning") || "Model for this crop is not available yet. Please select Tomato or Potato for Phase 1 diagnosis."}</span>
          </div>
        )}
      </div>

      {/* Scope Disclaimer Notice (Must not imply every disease can be detected) */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-start gap-2 text-amber-300 font-bold text-[11px]">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{currentCrop.disclaimer[langKey] || currentCrop.disclaimer.en}</span>
        </div>
      </div>

      {/* Supported Classes Breakdown Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowClasses(!showClasses)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-slate-300 flex items-center justify-between transition-all cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t("plantCare.modelScopeTitle") || "Model-Supported Disease Classes"}:{" "}
              <strong className="text-emerald-400">{currentCrop.supportedClasses.length} {t("plantCare.classesCount") || "classes"}</strong>
            </span>
          </span>
          {showClasses ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {showClasses && (
          <div className="mt-2 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2 animate-fadeIn">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {t("plantCare.modelScopeNote") ||
                "Detection scope is strictly limited to these trained dataset classes. It does not detect unmodeled diseases or non-modeled pathogens."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentCrop.supportedClasses.map((item) => (
                <div
                  key={item.rawDatasetLabel}
                  className={`p-2.5 rounded-xl border text-[11px] font-semibold space-y-0.5 ${
                    item.isHealthy
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span>{item.displayName[langKey] || item.displayName.en}</span>
                    {item.isHealthy && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 font-bold">
                        Healthy
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block">
                    Dataset label: {item.rawDatasetLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
