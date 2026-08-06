"use client";

import React from "react";
import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[200px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-white transition-all backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{t("nav.home")}</span>
        </Link>
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl shadow-emerald-950/50">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
              {t("nav.brand")}
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Form Body */}
        {children}

      </div>

    </div>
  );
};
