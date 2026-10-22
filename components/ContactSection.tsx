"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Phone, Mail, Send, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#10B981", "#34D399", "#22C55E"],
    });
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4"
          >
            {t("contact.badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            {t("contact.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-400"
          >
            {t("contact.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Support Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center gap-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Helpline (Toll Free)</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">1800-KHET-SAATHI</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex items-center gap-4 hover:border-emerald-500/40 transition-all">
              <div className="p-3.5 rounded-2xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Email Support</div>
                <div className="text-sm sm:text-base font-bold text-white mt-0.5">support@khetsaathi.ai</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
              <div className="font-bold text-sm text-white mb-1">🌾 Regional Agri Officer Support</div>
              Our AI assistants & field agronomists support over 14 Indian states in regional dialects.
            </div>

          </div>

          {/* Form */}
          <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-2xl">
            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Thank You! / धन्यवाद!</h3>
                <p className="text-slate-300 text-sm max-w-md">
                  Your inquiry has been received. Our agricultural expert will call your mobile number shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-emerald-300 hover:bg-slate-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t("contact.phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Message / Inquiry
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("contact.messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{t("contact.send")}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
