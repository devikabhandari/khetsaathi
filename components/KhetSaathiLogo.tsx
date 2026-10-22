"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const KhetSaathiLogo: React.FC<LogoProps> = ({
  className = "",
  size = 40,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Premium Emblem SVG: Sun + Leaf + Farmland Furrow Lines + Seed Sprout */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md hover:scale-105 transition-transform duration-300"
      >
        <defs>
          <linearGradient id="sunGlow" x1="50" y1="10" x2="50" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="leafGrad" x1="30" y1="30" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#52B788" />
            <stop offset="100%" stopColor="#1B4332" />
          </linearGradient>

          <linearGradient id="soilGrad" x1="10" y1="70" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* 1. Rising Sun */}
        <circle cx="50" cy="42" r="24" fill="url(#sunGlow)" />

        {/* Sun Rays */}
        <path d="M50 8L50 14" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M26 18L30 22" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M74 18L70 22" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M16 42L22 42" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M84 42L78 42" stroke="#FBBF24" strokeWidth="3.5" strokeLinecap="round" />

        {/* 2. Farmland Soil Furrow Curves */}
        <path
          d="M10 74 C 30 68, 70 68, 90 74 L 90 88 C 70 82, 30 82, 10 88 Z"
          fill="url(#soilGrad)"
        />
        <path d="M15 78 C 35 73, 65 73, 85 78" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M22 83 C 40 79, 60 79, 78 83" stroke="#D97706" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* 3. Sprouting Seed & Vibrant Leaf */}
        <path
          d="M48 68 C 42 45, 62 25, 78 28 C 75 48, 55 68, 48 68 Z"
          fill="url(#leafGrad)"
          stroke="#52B788"
          strokeWidth="1.5"
        />
        {/* Leaf Vein */}
        <path d="M52 64 Q 60 46 72 32" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />

        {/* Small Left Sprout Blade */}
        <path
          d="M48 68 C 36 58, 30 46, 34 38 C 44 42, 47 56, 48 68 Z"
          fill="#40916C"
        />

        {/* Seed Base */}
        <ellipse cx="48" cy="70" rx="4" ry="3" fill="#F59E0B" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
            Khet<span className="text-amber-400">Saathi</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase -mt-1">
            Har Mausam • Har Fasal
          </span>
        </div>
      )}
    </div>
  );
};
