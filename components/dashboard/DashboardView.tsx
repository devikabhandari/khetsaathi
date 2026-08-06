"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  FlaskConical,
  CloudRain,
  Sprout,
  Zap,
  Landmark,
  MapPin,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useLocationWeather } from "../../hooks/useLocationWeather";
import { LocationPermissionModal } from "../LocationPermissionModal";
import { CropDiseaseDetectionModule } from "./CropDiseaseDetectionModule";
import { SoilHealthAnalysisModule } from "./SoilHealthAnalysisModule";
import { WeatherIntelligenceModule } from "./WeatherIntelligenceModule";
import { CropRecommendationModule } from "./CropRecommendationModule";
import { FertilizerRecommendationModule } from "./FertilizerRecommendationModule";
import { GovtSchemesModule } from "./GovtSchemesModule";

export type ModuleTab = "disease" | "soil" | "weather" | "crop" | "fertilizer" | "schemes";

interface DashboardViewProps {
  initialTab?: ModuleTab;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ initialTab = "disease" }) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>(initialTab);
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

  const tabs: Array<{ id: ModuleTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "disease", label: "Crop Disease Scan", icon: <Bug className="w-4 h-4" />, badge: "AI Vision" },
    { id: "soil", label: "Soil Health Analysis", icon: <FlaskConical className="w-4 h-4" />, badge: "No Photo" },
    { id: "weather", label: "Weather Intelligence", icon: <CloudRain className="w-4 h-4" />, badge: "Live" },
    { id: "crop", label: "Crop Advisor", icon: <Sprout className="w-4 h-4" /> },
    { id: "fertilizer", label: "Fertilizer Schedule", icon: <Zap className="w-4 h-4" /> },
    { id: "schemes", label: "Govt Schemes", icon: <Landmark className="w-4 h-4" />, badge: "Subsidy" },
  ];

  return (
    <section id="dashboard" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Location & SaaS Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
              KhetSaathi AI Smart Agronomy Platform
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Active Location:{" "}
                <strong className="text-amber-300">
                  {location.village}, {location.district}, {location.state}
                </strong>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/40">
                {currentWeather.temp}°C • {currentWeather.condition}
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setLocationModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-xs font-extrabold text-emerald-300 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-400 ${loading ? "animate-spin" : ""}`} />
          <span>Change / Detect Location</span>
        </button>

      </div>

      {/* Modern Horizontal Module Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-center gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]"
                  : "text-slate-300 hover:text-white hover:bg-slate-950/60"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-extrabold ${
                    isActive
                      ? "bg-slate-950 text-amber-300"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Module Content View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "disease" && <CropDiseaseDetectionModule />}
          {activeTab === "soil" && <SoilHealthAnalysisModule userLocation={location} />}
          {activeTab === "weather" && (
            <WeatherIntelligenceModule
              location={location}
              currentWeather={currentWeather}
              forecast={forecast}
              loading={loading}
              onRefreshLocation={() => setLocationModalOpen(true)}
            />
          )}
          {activeTab === "crop" && (
            <CropRecommendationModule location={location} currentWeather={currentWeather} />
          )}
          {activeTab === "fertilizer" && (
            <FertilizerRecommendationModule location={location} currentWeather={currentWeather} />
          )}
          {activeTab === "schemes" && <GovtSchemesModule location={location} />}
        </motion.div>
      </AnimatePresence>

      {/* Geolocation Permission Modal */}
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
