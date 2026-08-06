"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Compass, Eye, Cpu, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const LandingAboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>{t("about.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
            {t("about.title")}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("about.desc")}
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">{t("about.missionTitle")}</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {t("about.missionDesc")}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{t("about.missionBadge")}</span>
            </div>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white">{t("about.visionTitle")}</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {t("about.visionDesc")}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>{t("about.visionBadge")}</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
