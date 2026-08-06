"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bug,
  FlaskConical,
  Sprout,
  Zap,
  CloudRain,
  Landmark,
  Cpu,
  ShieldCheck,
  Award,
  Globe,
  HeartHandshake,
} from "lucide-react";
import { KhetSaathiLogo } from "./KhetSaathiLogo";

export const AboutPageContent: React.FC = () => {
  const pillars = [
    {
      icon: <Bug className="w-7 h-7 text-emerald-400" />,
      title: "1. Plant & Crop Disease Detection",
      desc: "Instant computer vision analysis for plant leaves, stems, and fruits. Identifies fungal, bacterial, and viral infections along with step-by-step organic and chemical remedies.",
    },
    {
      icon: <FlaskConical className="w-7 h-7 text-teal-400" />,
      title: "2. Soil Health Guidance",
      desc: "Integrates ICAR historical soil cards and regional datasets. Calculates macronutrient NPK balances, pH levels, organic carbon, and water holding capacity without requiring photo scanning.",
    },
    {
      icon: <Sprout className="w-7 h-7 text-amber-400" />,
      title: "3. Crop Recommendation Advisor",
      desc: "Combines real-time location GPS, seasonal climate patterns, market price trends, and water availability to recommend the highest-yielding and most profitable crops.",
    },
    {
      icon: <Zap className="w-7 h-7 text-yellow-400" />,
      title: "4. Stage-Wise Fertilizer Schedule",
      desc: "Calculates stage-split fertilizer doses (Basal, Tillering, Flowering, Foliar) tailored to farm acreage, crop type, and soil composition with safety precautions.",
    },
    {
      icon: <CloudRain className="w-7 h-7 text-blue-400" />,
      title: "5. Weather Intelligence",
      desc: "Live Open-Meteo API weather feeds tracking temperature, humidity %, precipitation, wind speed, UV index, air quality (AQI), and 7-day agricultural forecasts.",
    },
    {
      icon: <Landmark className="w-7 h-7 text-amber-300" />,
      title: "6. Government Subsidies & Schemes",
      desc: "Auto-filters official Indian agricultural schemes (PM-KISAN, PMFBY, SMAM, PMKSY, state-specific subsidies) matching user state, land size, and crop.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 pt-4"
      >
        <div className="flex justify-center">
          <KhetSaathiLogo size={64} showText={true} />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md">
          <HeartHandshake className="w-4 h-4 text-amber-400" />
          <span>Empowering Every Indian Farmer • साथी हर किसान का</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent max-w-3xl mx-auto leading-tight">
          Combining AI, Soil Chemistry & Live Weather for Precision Agriculture
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          KhetSaathi is a modern agricultural intelligence platform designed to simplify farm decision-making. By combining localized GPS weather feeds, ICAR soil datasets, computer vision, and government policy integration, KhetSaathi provides simple, honest, and actionable guidance for every field.
        </p>
      </motion.div>

      {/* 6 Core Pillars Grid */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
            Core Technological Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">How KhetSaathi Helps Farmers Succeed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-black text-white">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Data Fusion Explanation Block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl space-y-6"
      >
        <div className="flex items-center gap-3 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
          <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span>Neural Data Fusion Engine</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
          From Seed Sowing to Bumper Harvest
        </h3>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          Unlike static tools, KhetSaathi synthesizes environmental variables simultaneously. When a farmer inputs a crop issue or plans a new crop, our platform evaluates current humidity trends to anticipate disease vectors, cross-references soil water retention profiles, and cross-checks government subsidies—generating ONE unified, easy-to-understand recommendation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
            <span className="font-extrabold text-emerald-300 block">Simple & Intuitive</span>
            <p className="text-slate-400">Conversational screens asking one question at a time so any farmer can navigate effortlessly.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
            <span className="font-extrabold text-amber-300 block">Honest AI Integrity</span>
            <p className="text-slate-400">Clear status indicators when backend models are on standby, avoiding fake predictions.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
            <span className="font-extrabold text-teal-300 block">Regional Language Native</span>
            <p className="text-slate-400">Instant multi-language support across English, Hindi (हिन्दी), and Marathi (मराठी).</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
