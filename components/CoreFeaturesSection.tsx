"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  Scan,
  CloudRain,
  FlaskConical,
  Sprout,
  MessageSquare,
  Landmark,
  CheckCircle2,
} from "lucide-react";

export const CoreFeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const coreTools = [
    {
      key: "disease",
      icon: Scan,
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/60",
      borderColor: "border-emerald-500/40",
      tag: "Computer Vision AI",
      details: ["Disease / Pest / Deficiency", "Organic & Chemical Remedies", "Preventive Agronomy Tips"],
    },
    {
      key: "weather",
      icon: CloudRain,
      color: "text-cyan-400",
      bgColor: "bg-cyan-950/60",
      borderColor: "border-cyan-500/40",
      tag: "Micro-Climate Forecast",
      details: ["Rain Probability & Wind Speed", "Temperature & Humidity Alerts", "Impact Explanations on Crops"],
    },
    {
      key: "fertilizer",
      icon: FlaskConical,
      color: "text-purple-400",
      bgColor: "bg-purple-950/60",
      borderColor: "border-purple-500/40",
      tag: "NPK & Soil Nutrition",
      details: ["Crop & Soil Type Match", "Exact Dose & Quantity", "Optimal Application Timing"],
    },
    {
      key: "crop",
      icon: Sprout,
      color: "text-amber-400",
      bgColor: "bg-amber-950/60",
      borderColor: "border-amber-500/40",
      tag: "Regional Yield AI",
      details: ["State & District Specific", "Seasonal Soil Matching", "Highest Profitability Suggestions"],
    },
    {
      key: "chatbot",
      icon: MessageSquare,
      color: "text-teal-400",
      bgColor: "bg-teal-950/60",
      borderColor: "border-teal-500/40",
      tag: "Multilingual Agronomist",
      details: ["Natural English Answers", "प्राकृतिक हिन्दी उत्तर", "नैसर्गिक मराठी उत्तरे"],
    },
    {
      key: "schemes",
      icon: Landmark,
      color: "text-sky-400",
      bgColor: "bg-sky-950/60",
      borderColor: "border-sky-500/40",
      tag: "Farmer Welfare",
      details: ["PM-KISAN Income Support", "PMFBY Crop Insurance", "Kisan Credit Card Loan Support"],
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            {t("features.badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        {/* The 6 Clean Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-8 rounded-3xl bg-slate-900/60 border ${tool.borderColor} backdrop-blur-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${tool.bgColor} border ${tool.borderColor} shadow-inner`}>
                      <Icon className={`w-7 h-7 ${tool.color}`} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {tool.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3">
                    {t(`features.items.${tool.key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {t(`features.items.${tool.key}.desc`)}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {tool.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${tool.color} shrink-0`} />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
