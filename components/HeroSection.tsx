"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage, Language } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { FarmSunriseCanvas } from "./FarmSunriseCanvas";
import { ArrowRight, UserCheck, Sun, Globe, Check } from "lucide-react";

export const HeroSection: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { loginAsGuest } = useAuth();

  const langOptions: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", label: "मराठी", flag: "🇮🇳" },
  ];

  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden pt-12 pb-16 bg-slate-950">
      {/* Scene 1: Animated Sunrise Canvas Background */}
      <FarmSunriseCanvas />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-8 sm:pt-16">
        
        {/* Sunrise Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md mb-6"
        >
          <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>{t("hero.sunriseTag")}</span>
        </motion.div>

        {/* Headline: KhetSaathi */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-4 drop-shadow-lg"
        >
          <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </motion.h1>

        {/* Subtitle: AI Powered Farming. Rooted in Nature. */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-amber-300 mb-6 tracking-wide drop-shadow"
        >
          {t("hero.subtitle")}
        </motion.h2>

        {/* Description: Helping Farmers Make Better Decisions Through Artificial Intelligence */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl text-base sm:text-xl text-slate-100 font-medium leading-relaxed mb-10 text-shadow"
        >
          {t("hero.description")}
        </motion.p>

        {/* Scene 2 Buttons: Get Started & Continue as Guest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16"
        >
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:brightness-110 shadow-2xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
          >
            <span>{t("hero.getStarted")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
          </Link>

          <button
            onClick={() => loginAsGuest()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-white bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900/90 backdrop-blur-xl transition-all shadow-xl flex items-center justify-center gap-2.5"
          >
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>{t("hero.guestMode")}</span>
          </button>
        </motion.div>

      </div>

      {/* Scene 3: Prominent Language Selector Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 w-full max-w-4xl mx-auto px-4"
      >
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{t("languages.selectLabel")}</span>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-950/80 border border-slate-800 rounded-full w-full sm:w-auto justify-center">
            {langOptions.map((opt) => {
              const isActive = language === opt.code;
              return (
                <button
                  key={opt.code}
                  onClick={() => setLanguage(opt.code)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.03]"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <span className="text-sm">{opt.flag}</span>
                  <span>{opt.label}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-slate-950" />}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

    </section>
  );
};
