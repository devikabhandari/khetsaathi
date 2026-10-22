"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  Sprout,
  CloudRain,
  Sun,
  Scan,
  CloudAlert,
  FlaskConical,
  Award,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export const CropJourneyStory: React.FC = () => {
  const { t } = useLanguage();

  const journeySteps = [
    {
      key: "seed",
      icon: Sprout,
      color: "text-amber-400",
      bgGradient: "from-amber-950/40 via-slate-900 to-slate-950",
      borderColor: "border-amber-500/30",
    },
    {
      key: "rain",
      icon: CloudRain,
      color: "text-cyan-400",
      bgGradient: "from-cyan-950/40 via-slate-900 to-slate-950",
      borderColor: "border-cyan-500/30",
    },
    {
      key: "plant",
      icon: Sun,
      color: "text-emerald-400",
      bgGradient: "from-emerald-950/40 via-slate-900 to-slate-950",
      borderColor: "border-emerald-500/30",
    },
    {
      key: "disease",
      icon: Scan,
      color: "text-rose-400",
      bgGradient: "from-rose-950/40 via-slate-900 to-slate-950",
      borderColor: "border-rose-500/30",
    },
    {
      key: "weather",
      icon: CloudAlert,
      color: "text-sky-400",
      bgGradient: "from-sky-950/40 via-slate-900 to-slate-950",
      borderColor: "border-sky-500/30",
    },
    {
      key: "fertilizer",
      icon: FlaskConical,
      color: "text-purple-400",
      bgGradient: "from-purple-950/40 via-slate-900 to-slate-950",
      borderColor: "border-purple-500/30",
    },
    {
      key: "cropRec",
      icon: Sparkles,
      color: "text-teal-400",
      bgGradient: "from-teal-950/40 via-slate-900 to-slate-950",
      borderColor: "border-teal-500/30",
    },
    {
      key: "success",
      icon: Award,
      color: "text-amber-300",
      bgGradient: "from-amber-900/50 via-emerald-950 to-slate-950",
      borderColor: "border-amber-400/50",
    },
  ];

  return (
    <section id="journey" className="py-24 bg-slate-950 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-950/30 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            {t("story.badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
          >
            {t("story.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal"
          >
            {t("story.subtitle")}
          </motion.p>
        </div>

        {/* Timeline Story Vertical Path */}
        <div className="relative border-l-2 border-emerald-900/60 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
          
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === journeySteps.length - 1;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                {/* Timeline Point Icon Node */}
                <div
                  className={`absolute -left-[35px] sm:-left-[55px] top-1.5 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-950 border ${step.borderColor} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${step.color}`} />
                </div>

                {/* Story Card */}
                <div
                  className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${step.bgGradient} border ${step.borderColor} backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <h3 className={`text-xl sm:text-2xl font-extrabold text-white mb-2 flex items-center justify-between`}>
                    <span>{t(`story.steps.${step.key}.title`)}</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {t(`story.steps.${step.key}.desc`)}
                  </p>
                </div>

                {/* Arrow Connector Down */}
                {!isLast && (
                  <div className="flex justify-center my-4 opacity-40">
                    <ChevronDown className="w-5 h-5 text-emerald-400 animate-bounce" />
                  </div>
                )}
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
