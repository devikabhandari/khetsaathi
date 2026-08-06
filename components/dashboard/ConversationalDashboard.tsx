"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Tractor,
  MapPin,
  CloudRain,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Globe,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useLocationWeather } from "../../hooks/useLocationWeather";
import { LocationPermissionModal } from "../LocationPermissionModal";
import { PersonalPlantCareModule } from "./PersonalPlantCareModule";
import { FarmManagementModule } from "./FarmManagementModule";

export type UsageChoice = "selection" | "personal" | "farm";

export const ConversationalDashboard: React.FC = () => {
  const { t, language } = useLanguage();

  const [usageChoice, setUsageChoice] = useState<UsageChoice>("selection");
  const [locationModalOpen, setLocationModalOpen] = useState<boolean>(false);

  const {
    location,
    currentWeather,
    forecast,
    loading,
    permissionState,
    requestLocation,
    updateLocationManually,
  } = useLocationWeather();

  // Prompt Step 2 Location Modal on entry if not prompted yet
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem("khetsaathi_location_prompted");
    if (!hasPrompted) {
      setLocationModalOpen(true);
      sessionStorage.setItem("khetsaathi_location_prompted", "true");
    }
  }, []);

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.morning") || "Good Morning 👋";
    if (hour < 17) return t("dashboard.afternoon") || "Good Afternoon 👋";
    return t("dashboard.evening") || "Good Evening 👋";
  };

  const getFarmingSeason = () => {
    const month = new Date().getMonth();
    const isHi = language === "hi";
    const isMr = language === "mr";
    if (month >= 5 && month <= 9)
      return isHi ? "खरीफ (मानसून) मौसम" : isMr ? "खरीप (पावसाळा) हंगाम" : "Kharif (Monsoon) Season";
    if (month >= 10 || month <= 2)
      return isHi ? "रबी (सर्दियों) का मौसम" : isMr ? "रब्बी (हिवाळा) हंगाम" : "Rabi (Winter) Season";
    return isHi ? "जायद (गर्मी) का मौसम" : isMr ? "उन्हाळी हंगाम" : "Zaid (Summer) Season";
  };

  return (
    <section id="dashboard" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
              <span>{getGreeting()}</span>
            </h1>
            <p className="text-xs text-slate-300">
              {t("dashboard.subtitle")}
            </p>
          </div>

          <button
            onClick={() => setLocationModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-xs font-bold text-emerald-300 transition-all flex items-center gap-2 shadow-lg cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
            <span>{t("dashboard.updateGps")}</span>
          </button>

        </div>

        {/* Live Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          {/* Location */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t("dashboard.currentLocation")}</span>
              <p className="text-xs font-bold text-amber-300 truncate">
                {location.village}, {location.district}, {location.state}
              </p>
            </div>
          </div>

          {/* Weather */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t("dashboard.todaysWeather")}</span>
              <p className="text-xs font-bold text-emerald-300">
                {currentWeather.temp}°C • {currentWeather.condition}
              </p>
            </div>
          </div>

          {/* Season */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{t("dashboard.currentSeason")}</span>
              <p className="text-xs font-bold text-teal-300">{getFarmingSeason()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic View rendering */}
      <AnimatePresence mode="wait">
        
        {/* STEP 3: "How will you use KhetSaathi?" - ONLY TWO CARDS */}
        {usageChoice === "selection" && (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 py-4">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
                How will you use KhetSaathi?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Select one of the two core services below to get started.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* CARD 1: Personal Plant Care */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUsageChoice("personal")}
                className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 backdrop-blur-2xl shadow-2xl text-left space-y-6 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl group-hover:scale-110 transition-transform">
                    <Leaf className="w-9 h-9 text-emerald-400" />
                  </div>

                  <div>
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                      Use Case 1
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-300 transition-colors">
                      🌿 Personal Plant Care
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                    Suitable for home gardens, indoor plants, nursery trees, and small plantations.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black text-emerald-400 group-hover:text-emerald-300">
                  <span>Open Personal Plant Health Scanner</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* CARD 2: Farm Management */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setUsageChoice("farm")}
                className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border-2 border-amber-500/40 hover:border-amber-400 backdrop-blur-2xl shadow-2xl text-left space-y-6 transition-all group flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl group-hover:scale-110 transition-transform">
                    <Tractor className="w-9 h-9 text-amber-400" />
                  </div>

                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                      Use Case 2
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors">
                      🚜 Farm Management
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-slate-300 leading-relaxed">
                    Suitable for agricultural fields, commercial farming, crop disease investigation, and seasonal crop planning.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black text-amber-400 group-hover:text-amber-300">
                  <span>Open Farm Management Services</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

            </div>
          </motion.div>
        )}

        {/* PERSONAL PLANT CARE MODULE */}
        {usageChoice === "personal" && (
          <motion.div key="personal" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <PersonalPlantCareModule
              location={location}
              weather={currentWeather}
              onBackToChoices={() => setUsageChoice("selection")}
            />
          </motion.div>
        )}

        {/* FARM MANAGEMENT MODULE */}
        {usageChoice === "farm" && (
          <motion.div key="farm" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
            <FarmManagementModule
              location={location}
              weather={currentWeather}
              onBackToChoices={() => setUsageChoice("selection")}
            />
          </motion.div>
        )}

      </AnimatePresence>

      <LocationPermissionModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onDetectLocation={requestLocation}
        onManualSelect={updateLocationManually}
        permissionState={permissionState}
        loading={loading}
      />
    </section>
  );
};
