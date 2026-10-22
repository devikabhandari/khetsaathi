"use client";

import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { X, UserCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuestModal: React.FC<GuestModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 overflow-hidden">
        
        {/* Top Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
            <UserCheck className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-extrabold text-white">
            {t("guestModal.title")}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed">
            {t("guestModal.desc")}
          </p>

          <div className="w-full space-y-2 pt-2 text-xs text-slate-400 text-left bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t("guestModal.check1")}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t("guestModal.check2")}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t("guestModal.check3")}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{t("guestModal.close")}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
