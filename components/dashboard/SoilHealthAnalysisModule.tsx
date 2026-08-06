"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Sprout,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Droplet,
  Layers,
  Sparkles,
  ShieldCheck,
  Award,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo } from "../../hooks/useLocationWeather";

interface SoilHealthModuleProps {
  userLocation: LocationInfo;
}

const INDIAN_STATES = [
  "Maharashtra",
  "Punjab",
  "Uttar Pradesh",
  "Gujarat",
  "Madhya Pradesh",
  "Haryana",
  "Rajasthan",
  "Karnataka",
  "Telangana",
  "Bihar",
  "Tamil Nadu",
  "West Bengal",
];

export const SoilHealthAnalysisModule: React.FC<SoilHealthModuleProps> = ({ userLocation }) => {
  const { t, language } = useLanguage();

  const [state, setState] = useState(userLocation.state || "Maharashtra");
  const [district, setDistrict] = useState(userLocation.district || "Pune");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [prevCrop, setPrevCrop] = useState("Paddy / Rice");
  const [farmSize, setFarmSize] = useState<number>(3);

  const [result, setResult] = useState<any | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  useEffect(() => {
    if (userLocation.state) setState(userLocation.state);
    if (userLocation.district) setDistrict(userLocation.district);
  }, [userLocation]);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      setIsCalculating(false);
      calculateSoilProfile();
    }, 900);
  };

  const calculateSoilProfile = () => {
    let nitrogenVal = 210;
    let phosphorusVal = 34;
    let potassiumVal = 280;
    let phVal = 7.2;
    let ocVal = 0.65;
    let qualityScore = 82;

    if (soilType.includes("Black")) {
      potassiumVal = 340;
      nitrogenVal = 195;
      phVal = 7.8;
      ocVal = 0.65;
      qualityScore = 82;
    } else if (soilType.includes("Red")) {
      phosphorusVal = 22;
      nitrogenVal = 170;
      phVal = 6.2;
      ocVal = 0.45;
      qualityScore = 68;
    } else if (soilType.includes("Alluvial")) {
      nitrogenVal = 245;
      phosphorusVal = 42;
      potassiumVal = 310;
      phVal = 7.0;
      ocVal = 0.78;
      qualityScore = 90;
    }

    const isHi = language === "hi";
    const isMr = language === "mr";

    const fertilityText =
      qualityScore >= 80
        ? isHi ? "उच्च उर्वरता" : isMr ? "उच्च सुपीकता" : "High Fertility"
        : qualityScore >= 65
        ? isHi ? "मध्यम उर्वरता" : isMr ? "मध्यम सुपीकता" : "Medium Fertility"
        : isHi ? "कम उर्वरता" : isMr ? "कमी सुपीकता" : "Low Fertility";

    const gradeText =
      qualityScore >= 85
        ? t("soil.gradeA")
        : qualityScore >= 70
        ? t("soil.gradeB")
        : t("soil.gradeC");

    const phStatusText =
      phVal > 7.5
        ? isHi ? "हल्का क्षारीय (अल्कलाइन)" : isMr ? "किंचित अल्कलाइन" : "Slightly Alkaline"
        : phVal < 6.5
        ? isHi ? "हल्का अम्लीय (एसिडिक)" : isMr ? "किंचित आम्लयुक्त" : "Slightly Acidic"
        : isHi ? "उदासीन (संतुलित)" : isMr ? "उदासीन (संतुलित)" : "Neutral Range";

    const recCrops = season.includes("Kharif")
      ? isHi
        ? ["कपास", "बासमती धान", "सोयाबीन", "अरहर / तुअर", "मक्का"]
        : isMr
        ? ["कापूस", "बासमती भात", "सोयाबीन", "तूर", "मका"]
        : ["Hybrid Cotton", "Basmati Paddy", "Soybean", "Tur / Arhar", "Maize"]
      : isHi
      ? ["शरबती गेहूं", "चना", "सरसों", "सब्जियां"]
      : isMr
      ? ["गहू", "हरभरा", "मोहरी", "भाज्या"]
      : ["Sharbati Wheat", "Chickpea / Gram", "Mustard / Sarson", "Vegetables"];

    const fertilizerTips = isHi
      ? [
          `प्रति एकड़ ${Math.round(farmSize * 45)} किग्रा यूरिया और 25 किग्रा डीएपी का प्रयोग करें।`,
          "नाइट्रोजन स्थिरीकरण के लिए एज़ोटोबैक्टर और पीएसबी जैव उर्वरक डालें।",
          "जिंक सल्फेट (21%) @ 10 किग्रा प्रति एकड़ छिड़कें।",
        ]
      : isMr
      ? [
          `प्रति एकरी ${Math.round(farmSize * 45)} किग्रॅ युरिया आणि २५ किग्रॅ डीएपी द्या.`,
          "जिवाणू खतांसाठी ॲझोटोबॅक्टर व पीएसबी वापरा.",
          "झिंक सल्फेट (२१%) @ १० किग्रॅ प्रति एकरी द्या.",
        ]
      : [
          `Apply ${Math.round(farmSize * 45)} kg Urea and 25 kg DAP per acre.`,
          "Incorporate Azotobacter and PSB bio-fertilizers for Nitrogen fixation.",
          "Broadcast Zinc Sulphate (21%) @ 10 kg/acre.",
        ];

    const soilTips = isHi
      ? [
          "मिट्टी में कार्बन बढ़ाने के लिए 2-3 टन वर्मीकंपोस्ट/गोबर की खाद डालें।",
          "पीएच स्तर संतुलित रखने के लिए जिप्सम (250 किग्रा/एकड़) का प्रयोग करें।",
          "मृदा क्षरण रोकने और नमी बनाए रखने के लिए फसल चक्र अपनाएं।",
        ]
      : isMr
      ? [
          "सेंद्रिय कार्बन वाढवण्यासाठी २-३ टन सेंद्रिय खत/कंपोस्ट टाका.",
          "मातीचा सामू संतुलित ठेवण्यासाठी जिप्सम वापरा.",
          "मातीची धूप रोखण्यासाठी पीक पालट पद्धत वापरा.",
        ]
      : [
          "Apply 2-3 Tons Farmyard Manure (FYM) or Vermicompost per acre.",
          "Use Gypsum @ 250 kg/acre to amend soil alkalinity if pH exceeds 7.8.",
          "Practice crop rotation with pulse legumes to enhance root nitrogen nodulation.",
        ];

    setResult({
      fertilityStatus: fertilityText,
      soilQualityIndex: qualityScore,
      qualityGrade: gradeText,
      nitrogen: {
        actual: nitrogenVal,
        target: 280,
        status: isHi ? "कम" : isMr ? "कमी" : "Low",
      },
      phosphorus: {
        actual: phosphorusVal,
        target: 45,
        status: isHi ? "इष्टतम" : isMr ? "योग्य" : "Optimal",
      },
      potassium: {
        actual: potassiumVal,
        target: 300,
        status: isHi ? "उच्च" : isMr ? "उच्च" : "High",
      },
      ph: phVal,
      phStatus: phStatusText,
      organicCarbon: ocVal,
      ocStatus: isHi ? "मध्यम-उच्च" : isMr ? "मध्यम-उच्च" : "Medium-High",
      waterHoldingCapacity: isHi ? "उच्च (55 - 60% नमी धारण क्षमता)" : isMr ? "उच्च (५५ - ६०% पाणी साठवण क्षमता)" : "High (55 - 60% Moisture Retention)",
      recommendedCrops: recCrops,
      fertilizerSummary: fertilizerTips,
      soilImprovementTips: soilTips,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <FlaskConical className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("soil.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("soil.heroDesc")}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-extrabold shadow-md shrink-0">
          ICAR Geo-Soil Card v2.4
        </div>
      </div>

      {/* Main Grid: Form Input & Soil Card Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleAnalyze} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t("soil.moduleTitle")}</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t("soil.selectState")}</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t("soil.selectSoilType")}</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil</option>
                <option value="Alluvial Loam Soil">Alluvial Loam Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
                <option value="Sandy Loam Soil">Sandy Loam Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t("soil.selectSeason")}</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                <option value="Rabi (Winter)">Rabi (Winter)</option>
                <option value="Zaid (Summer)">Zaid (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t("soil.selectPrevCrop")}</label>
              <select
                value={prevCrop}
                onChange={(e) => setPrevCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Pulses / Gram">Pulses / Gram</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Farm Land Size (Acres)</label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>{t("soil.analyzing")}</span>
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4 text-slate-950" />
                  <span>{t("soil.analyzeBtn")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Soil Card */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl space-y-6"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {state} • {district}
                  </span>
                  <h3 className="text-2xl font-black text-amber-300 mt-0.5">{result.qualityGrade}</h3>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center gap-2 shadow-md">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{result.soilQualityIndex}/100 Score ({result.fertilityStatus})</span>
                </div>
              </div>

              {/* NPK Bar Status */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>{t("soil.npkBalance")}</span>
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">{t("soil.nitrogen")}</span>
                    <span className="text-lg font-black text-emerald-300">{result.nitrogen.actual}</span>
                    <span className="text-[10px] text-amber-400 font-bold block">{result.nitrogen.status}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">{t("soil.phosphorus")}</span>
                    <span className="text-lg font-black text-teal-300">{result.phosphorus.actual}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">{result.phosphorus.status}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 block">{t("soil.potassium")}</span>
                    <span className="text-lg font-black text-amber-300">{result.potassium.actual}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">{result.potassium.status}</span>
                  </div>
                </div>
              </div>

              {/* pH & Organic Carbon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400">{t("soil.phLevel")}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{result.ph}</span>
                    <span className="text-xs font-bold text-emerald-400">({result.phStatus})</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400">{t("soil.organicCarbon")}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white">{result.organicCarbon}%</span>
                    <span className="text-xs font-bold text-amber-400">({result.ocStatus})</span>
                  </div>
                </div>
              </div>

              {/* Recommended Crops */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Optimal Recommended Crops for Soil Profile:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedCrops.map((crop: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs font-bold text-emerald-200">
                      🌿 {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fertilizer & Soil Improvement Tips */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400">{t("soil.recommendations")}</span>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {result.soilImprovementTips.map((tip: string, i: number) => (
                    <li key={i} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Soil Health Card Ready for Calculation</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Select your soil parameters on the left and click &quot;Generate Soil Health Card&quot; to inspect NPK balances and recommendations.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
