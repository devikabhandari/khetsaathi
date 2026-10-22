"use client";

import React from "react";
import Link from "next/link";
import { X, Sparkles, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const GuestLimitModal: React.FC = () => {
  const { showGuestLimitModal, closeGuestLimitModal } = useAuth();

  if (!showGuestLimitModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-fadeIn">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-950/40 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={closeGuestLimitModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            Guest Limit Reached (1/1 Upload Used)
          </span>

          <h3 className="text-2xl font-extrabold text-white">
            Unlock Unlimited AI Crop Scans 🌾
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You used your 1 free guest crop disease upload. Create a free account to unlock unlimited scans, save diagnosis history, and get personalized irrigation advice!
          </p>

          <div className="w-full space-y-2 pt-2 text-xs text-slate-300 text-left bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited crop leaf disease scans & remedies</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Saved farm history & diagnostic logs</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized Mandi prices & weather alerts</span>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2.5 pt-2">
            <Link
              href="/signup"
              onClick={closeGuestLimitModal}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Create Free Account in 10 Seconds</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>

            <Link
              href="/login"
              onClick={closeGuestLimitModal}
              className="w-full py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center"
            >
              Already Have an Account? Log In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
