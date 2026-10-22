"use client";

import React from "react";
import { motion } from "framer-motion";
import { Landmark, IndianRupee, CheckCircle2, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const LandingGovtSchemesSection: React.FC = () => {
  const { t } = useLanguage();

  const featuredSchemes = [
    {
      title: "PM-KISAN Nidhi",
      benefit: "₹ 6,000 / Year direct income support transferred in 3 installments.",
      badge: "Direct Benefit Transfer",
    },
    {
      title: "PM Fasal Bima Yojana (PMFBY)",
      benefit: "Comprehensive crop loss insurance at minimal 1.5% - 2% premium rates.",
      badge: "Crop Insurance",
    },
    {
      title: "Micro-Irrigation Subsidy (PMKSY)",
      benefit: "75% - 80% subsidy for installing drip & sprinkler irrigation systems.",
      badge: "Water Conservation",
    },
    {
      title: "Farm Mechanization (SMAM)",
      benefit: "Up to 50% subsidy on purchasing tractors, power tillers & implements.",
      badge: "Equipment Grant",
    },
  ];

  return (
    <section id="schemes" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide shadow-lg">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>{t("schemesPreview.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
            {t("schemesPreview.title")}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {t("schemesPreview.desc")}
          </p>
        </motion.div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSchemes.map((scheme, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-amber-500/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40">
                  {scheme.badge}
                </span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>

              <h3 className="text-xl font-black text-white">{scheme.title}</h3>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {t("schemesPreview.assistance")}
                </span>
                <p className="text-xs text-slate-200 font-semibold leading-relaxed">{scheme.benefit}</p>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("schemesPreview.autoMatch")}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
