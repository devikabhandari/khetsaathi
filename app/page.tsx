"use client";

import React, { useState } from "react";
import { CinematicFarmIntro } from "../components/CinematicFarmIntro";
import { Navbar } from "../components/Navbar";
import { NaturalHeroSection } from "../components/NaturalHeroSection";
import { LandingAboutSection } from "../components/LandingAboutSection";
import { LandingGovtSchemesSection } from "../components/LandingGovtSchemesSection";
import { Footer } from "../components/Footer";
import { GuestModal } from "../components/GuestModal";
import { GuestLimitModal } from "../components/auth/GuestLimitModal";
import { useLanguage, Language } from "../context/LanguageContext";
import { Globe, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage();
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showLangModal, setShowLangModal] = useState<boolean>(false);
  const [guestModalOpen, setGuestModalOpen] = useState<boolean>(false);

  const handleFinishIntro = () => {
    setShowIntro(false);
    setShowLangModal(true);
  };

  const handleConfirmLanguage = () => {
    setShowLangModal(false);
  };

  const handleOpenGuestModal = () => {
    setGuestModalOpen(true);
  };

  const handleCloseGuestModal = () => {
    setGuestModalOpen(false);
  };

  // STEP 1: Hero Video / Intro
  if (showIntro) {
    return <CinematicFarmIntro onComplete={handleFinishIntro} />;
  }

  // STEP 2: Language Selection Screen
  if (showLangModal) {
    const languageOptions: { code: Language; label: string; subLabel: string; flag: string }[] = [
      { code: "en", label: "English", subLabel: "Default Language", flag: "🇬🇧" },
      { code: "hi", label: "हिन्दी", subLabel: "हिंदी भाषा", flag: "🇮🇳" },
      { code: "mr", label: "मराठी", subLabel: "मराठी भाषा", flag: "🇮🇳" },
    ];

    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 sm:p-6 selection:bg-amber-400 selection:text-slate-950 animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-emerald-950/80 overflow-hidden space-y-6 text-center"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Icon */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/90 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
            <Globe className="w-8 h-8 animate-pulse text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-200 via-emerald-200 to-white bg-clip-text text-transparent">
              Select Preferred Language
            </h2>
            <p className="text-xs text-slate-300">
              अपनी भाषा चुनें • तुमची भाषा निवडा
            </p>
          </div>

          {/* Language Selection Grid */}
          <div className="space-y-3 pt-2">
            {languageOptions.map((opt) => {
              const isSelected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl">{opt.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{opt.label}</h4>
                      <span className="text-[11px] text-slate-400">{opt.subLabel}</span>
                    </div>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                        : "border-slate-700"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-slate-950" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleConfirmLanguage}
            className="w-full py-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-300 to-teal-400 hover:brightness-110 shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50"
          >
            <span>{t("intro.stepIn")}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </motion.div>
      </div>
    );
  }

  // STEP 3: Home Page (Contains ONLY Hero, About preview, Govt Schemes preview, Footer)
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-amber-400 selection:text-slate-950 animate-fadeIn">
      {/* Translucent Sticky Navbar */}
      <Navbar onOpenGuestModal={handleOpenGuestModal} />

      {/* SECTION 1: Hero Section */}
      <NaturalHeroSection />

      {/* SECTION 2: About Preview */}
      <LandingAboutSection />

      {/* SECTION 3: Government Schemes Preview */}
      <LandingGovtSchemesSection />

      {/* SECTION 4: Footer */}
      <Footer />

      {/* Modals */}
      <GuestModal isOpen={guestModalOpen} onClose={handleCloseGuestModal} />
      <GuestLimitModal />
    </main>
  );
}
