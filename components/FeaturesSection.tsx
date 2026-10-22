"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import {
  Scan,
  Droplets,
  TrendingUp,
  FlaskConical,
  CloudRain,
  CalendarCheck,
  ChevronRight,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      key: "disease",
      icon: Scan,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "hover:border-emerald-500/50",
      glowColor: "text-emerald-400",
      chip: "Computer Vision",
    },
    {
      key: "irrigation",
      icon: Droplets,
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      borderColor: "hover:border-cyan-500/50",
      glowColor: "text-cyan-400",
      chip: "IoT + Weather AI",
    },
    {
      key: "market",
      icon: TrendingUp,
      gradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
      borderColor: "hover:border-amber-500/50",
      glowColor: "text-amber-400",
      chip: "Real-time Mandi",
    },
    {
      key: "soil",
      icon: FlaskConical,
      gradient: "from-purple-500/20 via-emerald-500/10 to-transparent",
      borderColor: "hover:border-purple-500/50",
      glowColor: "text-purple-400",
      chip: "NPK Analytics",
    },
    {
      key: "weather",
      icon: CloudRain,
      gradient: "from-sky-500/20 via-indigo-500/10 to-transparent",
      borderColor: "hover:border-sky-500/50",
      glowColor: "text-sky-400",
      chip: "Micro-Radar",
    },
    {
      key: "planner",
      icon: CalendarCheck,
      gradient: "from-green-500/20 via-amber-500/10 to-transparent",
      borderColor: "hover:border-green-500/50",
      glowColor: "text-green-400",
      chip: "Yield Optimization",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            {t("features.badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            {t("features.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400"
          >
            {t("features.subtitle")}
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl ${item.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-950/50 hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle internal gradient highlight */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner ${item.glowColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                      {item.chip}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                    {t(`features.cards.${item.key}.title`)}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {t(`features.cards.${item.key}.desc`)}
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-amber-300 transition-colors cursor-pointer">
                  <span>Explore Module</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
