"use client";

import React from "react";
import { useLanguage, Language } from "../context/LanguageContext";
import { Globe, Check } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", label: "मराठी", flag: "🇮🇳" },
  ];

  return (
    <div className="w-full bg-emerald-950/40 border-y border-emerald-500/20 backdrop-blur-md sticky top-16 z-40 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Globe className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{t("languages.selectLabel")}</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-emerald-950/70 border border-emerald-500/30 rounded-full shadow-inner shadow-black/60">
          {options.map((opt) => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 scale-[1.03]"
                    : "text-emerald-200/80 hover:text-white hover:bg-emerald-900/40"
                }`}
              >
                <span className="text-sm">{opt.flag}</span>
                <span>{opt.label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
