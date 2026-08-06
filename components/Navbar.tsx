"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage, Language } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { KhetSaathiLogo } from "./KhetSaathiLogo";
import { Menu, X, UserCheck, LogOut, User as UserIcon, Globe } from "lucide-react";

interface NavbarProps {
  onOpenGuestModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGuestModal }) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout, loginAsGuest } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langOptions: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिन्दी" },
    { code: "mr", label: "मराठी" },
  ];

  // Unauthenticated links
  const publicNavLinks = [
    { name: t("nav.home") || "Home", href: "/" },
    { name: t("nav.about") || "About", href: "/#about" },
    { name: t("nav.schemes") || "Government Schemes", href: "/#schemes" },
  ];

  // Authenticated links
  const appNavLinks = [
    { name: t("nav.dashboard") || "Dashboard", href: "/dashboard" },
    { name: t("nav.cropScan") || "Plant Diagnosis", href: "/dashboard?tab=plant" },
    { name: t("nav.soilHealth") || "Soil Intelligence", href: "/dashboard?tab=soil" },
    { name: t("nav.cropAdvisor") || "Crop Planner", href: "/dashboard?tab=planner" },
    { name: t("nav.schemes") || "Government Schemes", href: "/dashboard?tab=schemes" },
  ];

  const currentNavLinks = user ? appNavLinks : publicNavLinks;

  const handleGuestAction = () => {
    loginAsGuest();
    if (onOpenGuestModal) onOpenGuestModal();
    window.location.href = "/dashboard";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href={user ? "/dashboard" : "/"}>
          <KhetSaathiLogo size={34} showText={true} />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-6">
          {currentNavLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-semibold text-slate-300 hover:text-amber-300 transition-colors relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Language Switcher & Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          
          {/* Global Language Switcher Pill */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-full shadow-inner">
            <Globe className="w-3.5 h-3.5 ml-2 text-emerald-400 shrink-0" />
            {langOptions.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLanguage(opt.code)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  language === opt.code
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-xs font-semibold text-amber-300">
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.displayName}</span>
                {user.isGuest && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                    Guest
                  </span>
                )}
              </div>

              <button
                onClick={() => logout()}
                className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer"
                title={t("nav.logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                {t("nav.login")}
              </Link>

              <button
                onClick={handleGuestAction}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/60 hover:border-amber-500/50 hover:text-white transition-all shadow-sm cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{t("nav.guestMode")}</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-emerald-900/40 backdrop-blur-2xl px-4 pt-3 pb-6 flex flex-col gap-4">
          
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language:</span>
            </span>
            <div className="flex items-center gap-1">
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === opt.code
                      ? "bg-emerald-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            {currentNavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-amber-300 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-sm font-semibold text-amber-300">{user.displayName}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-red-400 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-300 hover:text-white"
                >
                  {t("nav.login")}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGuestAction();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-200 bg-slate-900 border border-slate-700"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>{t("nav.guestMode")}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
