"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Compass, AlertCircle, CheckCircle2, X, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetectLocation: () => Promise<{ success: boolean; error?: string } | void>;
  onManualSelect: (state: string, district: string) => Promise<void> | void;
  permissionState: "idle" | "requesting" | "granted" | "denied" | "error";
  loading: boolean;
}

const INDIAN_STATES_DISTRICTS: Record<string, string[]> = {
  Maharashtra: ["Pune", "Nashik", "Nagpur", "Satara", "Kolhapur", "Solapur", "Aurangabad", "Ahmednagar", "Sangli", "Amravati"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Firozpur", "Sangrur", "Gurdaspur"],
  "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Kanpur", "Prayagraj", "Gorakhpur", "Bareilly", "Meerut", "Aligarh"],
  Gujarat: ["Ahmedabad", "Rajkot", "Surat", "Vadodara", "Junagadh", "Bhavnagar", "Anand", "Mehsana"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain", "Jabalpur", "Gwalior", "Sagar", "Rewa"],
  Haryana: ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Sonipat", "Kurukshetra"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Sri Ganganagar", "Alwar"],
  Karnataka: ["Bengaluru Rural", "Mysuru", "Belagavi", "Hubballi", "Davangere", "Shimoga"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
};

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onDetectLocation,
  onManualSelect,
  permissionState,
  loading,
}) => {
  const { t } = useLanguage();
  const [showManual, setShowManual] = useState(false);
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  if (!isOpen) return null;

  const handleAllowClick = async () => {
    try {
      const res = await onDetectLocation();
      if (res && res.success === false) {
        // Permission was denied or timed out; keep modal open showing error and retry/manual options
        return;
      }
      onClose();
    } catch (e) {
      console.warn("Location detection error", e);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingManual(true);
    try {
      await onManualSelect(selectedState, selectedDistrict);
      onClose();
    } finally {
      setIsSubmittingManual(false);
    }
  };

  const isFetchingData = loading || isSubmittingManual;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 overflow-hidden"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-4">
          
          {/* Animated Icon Header */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950">
            {isFetchingData ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            ) : (
              <Navigation className="w-8 h-8 animate-pulse text-emerald-400" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black bg-gradient-to-r from-amber-200 via-emerald-200 to-white bg-clip-text text-transparent">
              {t("locationModal.title")}
            </h3>
            <p className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest">
              {t("locationModal.subtitle")}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
            {t("locationModal.desc")}
          </p>

          {/* LOADING STATE ANIMATION */}
          {isFetchingData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center justify-center gap-3 text-emerald-300 font-extrabold text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t("sections.cropScan.scanning") || "Detecting location..."}</span>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {!showManual ? (
                <motion.div
                  key="auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full space-y-3 pt-2"
                >
                  {/* Feature Checklist */}
                  <div className="w-full space-y-2 text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t("locationModal.check1")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t("locationModal.check2")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t("locationModal.check3")}</span>
                    </div>
                  </div>

                  {permissionState === "denied" && (
                    <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{t("locationModal.denied")}</span>
                    </div>
                  )}

                  {/* Button Group: Allow Location vs Not Now */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleAllowClick}
                      className="py-3.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-slate-950" />
                      <span>{permissionState === "denied" ? (t("locationModal.retry") || "Retry Location Detection") : t("locationModal.allow")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowManual(true)}
                      className="py-3.5 px-4 rounded-xl font-bold text-xs text-slate-300 bg-slate-950 border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>{t("locationModal.notNow")}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="manual"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleManualSubmit}
                  className="w-full space-y-4 pt-2 text-left"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t("locationModal.selectState")}</label>
                    <select
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        const dists = INDIAN_STATES_DISTRICTS[e.target.value] || [];
                        setSelectedDistrict(dists[0] || "");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">{t("locationModal.selectDistrict")}</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                    >
                      {(INDIAN_STATES_DISTRICTS[selectedState] || []).map((dt) => (
                        <option key={dt} value={dt}>
                          {dt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowManual(false)}
                      className="w-1/3 py-3 rounded-xl text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-800 hover:text-white cursor-pointer"
                    >
                      {t("locationModal.back")}
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-3 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md cursor-pointer"
                    >
                      {t("locationModal.save")}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          )}

        </div>
      </motion.div>
    </div>
  );
};
