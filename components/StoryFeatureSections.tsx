"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import {
  Scan,
  FlaskConical,
  CloudRain,
  Sprout,
  MessageSquare,
  Landmark,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Send,
  Droplets,
  Wind,
  Thermometer,
} from "lucide-react";

export const StoryFeatureSections: React.FC = () => {
  const { t } = useLanguage();
  const { canUploadCropImage, incrementGuestUpload } = useAuth();

  // Feature 1 State: Upload simulation
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<boolean>(false);

  // Feature 7 State: Chatbot Q&A simulation
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Namaste! I am KhetSaathi AI. Ask me any question about your crops, soil, or weather." },
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check guest upload cap (Max 1 for guest)
    if (!canUploadCropImage()) {
      incrementGuestUpload();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScannedImage(reader.result as string);
      setIsScanning(true);
      setScanResult(false);

      setTimeout(() => {
        setIsScanning(false);
        setScanResult(true);
        incrementGuestUpload();
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Regarding "${userText}": For best yield in current season, ensure balanced NPK fertilization and monitor soil moisture before evening irrigation.`,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="space-y-24 py-16 bg-slate-950">
      
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CROP DISEASE DETECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="cropScan" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Scan className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Feature 01
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {t("sections.cropScan.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mb-10">
            {t("sections.cropScan.subtitle")}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-emerald-500/40 rounded-3xl p-8 bg-slate-950/70 text-center flex flex-col items-center justify-center relative hover:border-emerald-400 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadSimulate}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {t("sections.cropScan.uploadTitle")}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {t("sections.cropScan.uploadDesc")}
              </p>
              <span className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                Browse Image
              </span>
            </div>

            {/* Scan Result Display */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 min-h-[220px] flex flex-col justify-center">
              {isScanning ? (
                <div className="flex flex-col items-center space-y-3 py-8">
                  <Scan className="w-10 h-10 text-emerald-400 animate-spin" />
                  <span className="text-sm font-bold text-emerald-300">
                    {t("sections.cropScan.scanning")}
                  </span>
                </div>
              ) : scanResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Leaf Spot Fungus Detected (98.4% Confidence)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 text-slate-300">
                    <div className="font-bold text-amber-300">🌿 Organic Remedy:</div>
                    <p>Spray 5% Neem seed kernel extract (NSKE) every 7 days during morning hours.</p>
                    <div className="font-bold text-cyan-300">🧪 Chemical Remedy:</div>
                    <p>Apply Copper Oxychloride 50% WP @ 2.5g per Liter of water.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 text-sm py-8">
                  Upload a crop leaf image to simulate instant AI diagnosis.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: SOIL HEALTH ANALYSIS */}
      {/* ------------------------------------------------------------- */}
      <section id="soilHealth" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <FlaskConical className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Feature 02
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {t("sections.soilHealth.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mb-10">
            {t("sections.soilHealth.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((sIdx) => (
              <div key={sIdx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all">
                <h3 className="text-lg font-extrabold text-amber-300 mb-2">
                  {t(`sections.soilHealth.types.${sIdx}.name`)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t(`sections.soilHealth.types.${sIdx}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: WEATHER & EXTERNAL FACTORS */}
      {/* ------------------------------------------------------------- */}
      <section id="weather" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <CloudRain className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Feature 03
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {t("sections.weather.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mb-10">
            {t("sections.weather.subtitle")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Droplets className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400 uppercase font-bold">{t("sections.weather.rainLabel")}</div>
              <div className="text-2xl font-black text-white mt-1">78%</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Thermometer className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400 uppercase font-bold">{t("sections.weather.tempLabel")}</div>
              <div className="text-2xl font-black text-white mt-1">29°C</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <CloudRain className="w-6 h-6 text-teal-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400 uppercase font-bold">{t("sections.weather.humidityLabel")}</div>
              <div className="text-2xl font-black text-white mt-1">64%</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <Wind className="w-6 h-6 text-sky-400 mx-auto mb-2" />
              <div className="text-xs text-slate-400 uppercase font-bold">{t("sections.weather.windLabel")}</div>
              <div className="text-2xl font-black text-white mt-1">12 km/h</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Farming Impact Alert:</strong> High humidity (64%) and predicted rainfall over the next 48 hours create ideal conditions for fungal leaf spot. Avoid immediate irrigation and delay pesticide spraying until skies clear.
            </span>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4 & 5: FERTILIZER & CROP RECOMMENDATIONS */}
      {/* ------------------------------------------------------------- */}
      <section id="cropAdvisor" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Fertilizer Rec Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-slate-900/80 border border-purple-500/30 backdrop-blur-2xl shadow-2xl"
          >
            <div className="p-3 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400 w-fit mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              {t("sections.fertilizer.title")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {t("sections.fertilizer.subtitle")}
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="font-bold text-purple-300">Recommended NPK Dose:</div>
              <p>120 kg Nitrogen : 60 kg Phosphorus : 40 kg Potash per Hectare.</p>
              <div className="font-bold text-amber-300">Timing:</div>
              <p>Apply 50% Nitrogen at sowing; split remaining 50% at tillering stage.</p>
            </div>
          </motion.div>

          {/* Crop Advisor Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-2xl shadow-2xl"
          >
            <div className="p-3 rounded-2xl bg-teal-950 border border-teal-500/40 text-teal-400 w-fit mb-4">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              {t("sections.cropAdvisor.title")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              {t("sections.cropAdvisor.subtitle")}
            </p>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="font-bold text-teal-300">Top Recommended Crop for Rabi Season:</div>
              <p>Wheat (HD-2967 Variety) - Ideal for Alluvial / Loam Soil in northern plains with projected 22-25 Qtl/Acre output.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 6: GOVERNMENT SCHEMES */}
      {/* ------------------------------------------------------------- */}
      <section id="schemes" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Feature 06
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {t("sections.schemes.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mb-8">
            {t("sections.schemes.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-300 text-sm mb-1">PM-KISAN Samman Nidhi</h4>
              <p className="text-xs text-slate-300">₹6,000 yearly financial support in 3 equal installments.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-300 text-sm mb-1">PM Fasal Bima Yojana (PMFBY)</h4>
              <p className="text-xs text-slate-300">Full crop loss insurance coverage against natural disasters.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 7: MULTILINGUAL FARMING ASSISTANT */}
      {/* ------------------------------------------------------------- */}
      <section id="assistant" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Feature 07
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {t("sections.assistant.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mb-8">
            {t("sections.assistant.subtitle")}
          </p>

          {/* Interactive Chat Box */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="h-48 overflow-y-auto space-y-3 pr-2">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-200 border border-slate-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Ask any farming question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
              >
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </motion.div>
      </section>

    </div>
  );
};
