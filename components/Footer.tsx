"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Sprout, Mail, Phone, GraduationCap, Globe, Share2, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-400">
          
          {/* Brand & Project Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-amber-400 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div className="font-extrabold text-base text-white">{t("nav.brand")}</div>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Academic & College Project Info */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>{t("footer.project")}</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              {t("footer.projectDesc")}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white">{t("footer.support")}</h4>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@khetsaathi.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>1800-KHET-SAATHI (Toll Free)</span>
              </div>
            </div>
          </div>

          {/* Navigation & Social Links */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-sm text-white">{t("footer.quickLinks")}</h4>
            <div className="flex flex-col gap-1 text-slate-300">
              <a href="/#about" className="hover:text-emerald-400 transition-colors">{t("nav.about")}</a>
              <a href="/#schemes" className="hover:text-emerald-400 transition-colors">{t("nav.schemes")}</a>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub Portal" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn Project Page" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Project Documentation" className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 text-center text-slate-500 text-[11px]">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
};
