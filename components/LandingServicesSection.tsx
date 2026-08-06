"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bug,
  FlaskConical,
  Sprout,
  Zap,
  CloudRain,
  Landmark,
  Sparkles,
} from "lucide-react";

export const LandingServicesSection: React.FC = () => {
  const services = [
    {
      icon: <Bug className="w-8 h-8 text-emerald-400" />,
      title: "Plant Health Analysis",
      desc: "Instant multi-angle leaf and plant scan to detect disease symptoms, pest infestations, and nutrient deficiencies with organic & chemical treatment options.",
      tag: "Computer Vision",
    },
    {
      icon: <FlaskConical className="w-8 h-8 text-teal-400" />,
      title: "Soil Health Guidance",
      desc: "Calculates NPK nutrient balance, pH acidity/alkalinity, organic carbon %, and water retention using ICAR regional datasets without photo scanning.",
      tag: "Soil Chemistry",
    },
    {
      icon: <Sprout className="w-8 h-8 text-amber-400" />,
      title: "Crop Recommendation",
      desc: "Recommends high-yielding crops tailored to your state, soil profile, water source, and current seasonal weather patterns to maximize farm profit.",
      tag: "Agronomy AI",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Fertilizer Recommendation",
      desc: "Stage-wise fertilizer application schedule (Basal, Top Dressing, Foliar) with exact bag dosages for your farm acreage and safety precautions.",
      tag: "Nutrient Advisory",
    },
    {
      icon: <CloudRain className="w-8 h-8 text-blue-400" />,
      title: "Weather Intelligence",
      desc: "Live Open-Meteo weather tracking current temp, humidity, wind velocity, UV index, air quality (AQI), and 7-day agricultural rain forecasts.",
      tag: "Live Micro-Climate",
    },
    {
      icon: <Landmark className="w-8 h-8 text-amber-300" />,
      title: "Government Scheme Guidance",
      desc: "Automatically discovers eligible Central and State government subsidies, PM-KISAN, crop insurance, and equipment grants based on your location.",
      tag: "Subsidy Matcher",
    },
  ];

  return (
    <section id="services" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Comprehensive Agronomy Services</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-amber-200 via-amber-100 to-emerald-200 bg-clip-text text-transparent">
            Our Services
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            KhetSaathi brings together six specialized agricultural intelligence tools designed to assist farmers throughout the crop lifecycle.
          </p>
        </motion.div>

        {/* 6 Elegant Service Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                    {service.tag}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
