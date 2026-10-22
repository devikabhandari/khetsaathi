"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KhetSaathiLogo } from "./KhetSaathiLogo";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, SkipForward, Sparkles, Play, Pause, RotateCcw, RotateCw } from "lucide-react";

interface PhotorealCropIntroProps {
  onComplete: () => void;
}

export const PhotorealCropIntro: React.FC<PhotorealCropIntroProps> = ({ onComplete }) => {
  const { t } = useLanguage();

  const [currentTime, setCurrentTime] = useState<number>(0); // 0 to 20s
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isPartingCrops, setIsPartingCrops] = useState<boolean>(false);

  // 20-second continuous timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 20) return 0;
        return Math.min(20, +(prev + 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleRewind = () => {
    setCurrentTime((prev) => Math.max(0, +(prev - 3).toFixed(1)));
  };

  const handleForward = () => {
    setCurrentTime((prev) => Math.min(20, +(prev + 3).toFixed(1)));
  };

  // Determine active photoreal scene (1 to 5)
  const getScene = (time: number): { id: number; image: string; alt: string } => {
    if (time < 4) {
      return { id: 1, image: "/hero_sunrise.png", alt: "Photoreal Sunrise Wheat Field" };
    }
    if (time < 9) {
      return { id: 2, image: "/hero_pest.png", alt: "Photoreal Insect Pest Damage Close-up" };
    }
    if (time < 13) {
      return { id: 3, image: "/hero_farmer.png", alt: "Photoreal Indian Farmer Scanning Leaf with Smartphone App" };
    }
    if (time < 18) {
      return { id: 4, image: "/hero_recovery.png", alt: "Photoreal Thriving Green Crop Recovery" };
    }
    return { id: 5, image: "/hero_harvest.png", alt: "Photoreal Golden Harvest Brand Resolution" };
  };

  const activeScene = getScene(currentTime);

  const handleStepIntoFarm = () => {
    setIsPartingCrops(true);
    setTimeout(() => {
      onComplete();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      
      {/* 100% Photorealistic Video Layer (Nature Documentary Camera Motion) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeScene.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ken Burns Slow Cinematic Push-in */}
            <motion.img
              src={activeScene.image}
              alt={activeScene.alt}
              animate={{
                scale: [1.02, 1.08],
                x: activeScene.id % 2 === 0 ? ["0%", "-1.5%"] : ["0%", "1.5%"],
              }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Golden Lighting Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Parting Curtain Transition on Exit */}
      {isPartingCrops && (
        <div className="absolute inset-0 z-40 pointer-events-none flex">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-1/2 h-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-transparent shadow-2xl"
          />
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-1/2 h-full bg-gradient-to-l from-emerald-950 via-emerald-900 to-transparent shadow-2xl"
          />
        </div>
      )}

      {/* Header Bar Controls */}
      <div className="relative z-30 p-4 sm:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <KhetSaathiLogo size={36} showText={true} />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Rewind 3s Button */}
          <button
            onClick={handleRewind}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-slate-950/70 border border-slate-700/80 text-amber-300 hover:text-white hover:bg-slate-900/80 backdrop-blur-xl transition-all shadow-md cursor-pointer text-xs font-bold"
            title="Rewind 3 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>-3s</span>
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-slate-950/70 border border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-900/80 backdrop-blur-xl transition-all shadow-md cursor-pointer"
            title={isPlaying ? "Pause Footage" : "Play Footage"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          {/* Forward 3s Button */}
          <button
            onClick={handleForward}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-slate-950/70 border border-slate-700/80 text-amber-300 hover:text-white hover:bg-slate-900/80 backdrop-blur-xl transition-all shadow-md cursor-pointer text-xs font-bold"
            title="Forward 3 seconds"
          >
            <span>+3s</span>
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Skip Button */}
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/70 border border-amber-500/50 text-amber-300 text-xs font-bold hover:bg-amber-500/20 backdrop-blur-xl transition-all shadow-lg cursor-pointer"
          >
            <span>{t("intro.skip")}</span>
            <SkipForward className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Main Center Area: ZERO text overlays during scenes 1-4. Brand resolution at scene 5 (18-20s) */}
      <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <AnimatePresence>
          {activeScene.id === 5 && (
            <motion.div
              key="scene5-resolution"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl flex flex-col items-center space-y-5 p-8 rounded-3xl bg-slate-950/85 border border-amber-500/40 backdrop-blur-2xl shadow-2xl"
            >
              <KhetSaathiLogo size={64} showText={false} />

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                Khet<span className="text-amber-400">Saathi</span>
              </h1>

              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-amber-100 to-emerald-300 bg-clip-text text-transparent">
                  {t("tagline.primary")}
                </h2>
                <p className="text-sm sm:text-lg text-slate-300 max-w-lg font-medium leading-relaxed">
                  {t("tagline.description")}
                </p>
              </div>

              <motion.button
                onClick={handleStepIntoFarm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 px-9 py-4.5 rounded-2xl font-black text-lg text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:brightness-110 shadow-2xl shadow-amber-500/40 transition-all flex items-center justify-center gap-3 border border-amber-300/60 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-slate-950 animate-bounce" />
                <span>{t("intro.stepIn")}</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Timeline Bar */}
      <div className="relative z-30 p-4 sm:p-6 max-w-lg mx-auto w-full space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-amber-300/90 px-1 uppercase tracking-wider">
          <span>00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)}s</span>
          <span>Photoreal Cinematic Storyboard • Click Bar to Seek</span>
        </div>

        {/* Interactive Clickable Seek Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
            setCurrentTime(+(newRatio * 20).toFixed(1));
          }}
          className="relative w-full bg-slate-950/80 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner cursor-pointer group"
        >
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-100"
            style={{ width: `${(currentTime / 20) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
};
