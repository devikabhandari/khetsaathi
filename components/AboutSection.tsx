"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Cpu, CheckCircle2, ShieldCheck, Globe, Zap, Radio } from "lucide-react";

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  const techFeatures = [
    { title: "Computer Vision", desc: "Edge AI leaf scanning using CNNs trained on 500k+ Indian crop disease datasets." },
    { title: "Satellite Telemetry", desc: "Sentinel & Landsat multi-spectral imagery for soil moisture & vegetation health." },
    { title: "Localized LLM Agronomists", desc: "Generative AI trained on ICAR & agricultural research in native languages." },
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            {t("about.badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            {t("about.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400"
          >
            {t("about.subtitle")}
          </motion.p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Left Column: Vision & Key Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                <Globe className="w-6 h-6 text-emerald-400" />
                <span>{t("about.visionTitle")}</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
                {t("about.visionDesc")}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800">
                {[0, 1, 2, 3].map((idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-200">
                      {t(`about.points.${idx}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Architecture Highlights (Tesla Style Tech Specs) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>KhetSaathi AI Stack</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Telemetry</span>
              </span>
            </div>

            {techFeatures.map((tech, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all backdrop-blur-xl group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {tech.title}
                  </h4>
                  <Zap className="w-4 h-4 text-amber-400 opacity-80" />
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
