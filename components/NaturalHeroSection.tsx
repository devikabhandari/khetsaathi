"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage, Language } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { KhetSaathiLogo } from "./KhetSaathiLogo";
import { Globe, Check, ArrowRight, UserCheck, Sprout, HeartHandshake, Film } from "lucide-react";

export const NaturalHeroSection: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { loginAsGuest } = useAuth();
  const [heroTime, setHeroTime] = useState<number>(0);

  // Auto-looping 20s photoreal video background timer
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroTime((prev) => (prev >= 20 ? 0 : +(prev + 0.1).toFixed(1)));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const getPhotorealImage = (time: number): string => {
    if (time < 4) return "/hero_sunrise.png";
    if (time < 9) return "/hero_pest.png";
    if (time < 13) return "/hero_farmer.png";
    if (time < 18) return "/hero_recovery.png";
    return "/hero_harvest.png";
  };

  const currentImage = getPhotorealImage(heroTime);

  const langOptions: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", label: "मराठी", flag: "🇮🇳" },
  ];

  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden pt-12 pb-16 bg-slate-950">
      
      {/* Photorealistic Documentary Ambient Layer (Zero text overlays inside footage) */}
      <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
        <AnimatePresence mode="sync">
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Photoreal Crop Lifecycle"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/80" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-8">
        
        {/* Emblem Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md mb-6"
        >
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>Saathi Har Kisan Ka • साथी हर किसान का</span>
        </motion.div>

        {/* Brand Logo & Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-4"
        >
          <KhetSaathiLogo size={60} showText={true} />
        </motion.div>

        {/* Emotional Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent mb-4 drop-shadow-md"
        >
          {t("tagline.primary")}
        </motion.h1>

        {/* Secondary Tagline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-xl sm:text-3xl font-extrabold text-amber-300 mb-6"
        >
          {t("tagline.secondary")}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl text-base sm:text-xl text-slate-200 font-medium leading-relaxed mb-8"
        >
          {t("tagline.description")}
        </motion.p>

        {/* Storyboard Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-10 px-4 py-2 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-xl flex items-center gap-3 text-xs text-amber-200 font-medium shadow-xl"
        >
          <Film className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            {heroTime < 4 && "00:00 - 00:04 • Sunrise & Healthy Crop"}
            {heroTime >= 4 && heroTime < 9 && "00:04 - 00:09 • Insect Infestation"}
            {heroTime >= 9 && heroTime < 13 && "00:09 - 00:13 • Farmer & Khetsaathi Scan"}
            {heroTime >= 13 && heroTime < 18 && "00:13 - 00:18 • Thriving Recovery"}
            {heroTime >= 18 && "00:18 - 00:20 • Khetsaathi Companion"}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* CTAs */}
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
            <Sprout className="w-5 h-5 text-slate-950" />
            <span>{t("nav.getStarted")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
          </Link>

          <button
            onClick={() => loginAsGuest()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-white bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900/90 backdrop-blur-xl transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <span>{t("nav.guestMode")}</span>
          </button>
        </motion.div>

      </div>

      {/* Language Selector Bar */}
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
