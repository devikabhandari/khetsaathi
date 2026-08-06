"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Upload,
  Camera,
  X,
  Sparkles,
  FlaskConical,
  Sprout,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Droplets,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface CropProblemProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToOptions: () => void;
}

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PROBLEM_DROPDOWN = [
  "Plant not growing",
  "Yellow leaves",
  "Low yield",
  "Stunted growth",
  "Wilting",
  "No flowering",
  "Poor germination",
  "Other",
];

const MONTH_INDEX_MAP: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const CropProblemInvestigationModule: React.FC<CropProblemProps> = ({
  location,
  weather,
  onBackToOptions,
}) => {
  const { t, language } = useLanguage();

  // Auto-detect current month from system date
  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

  // Photo Upload State
  const [images, setImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Form Inputs
  const [currentCrop, setCurrentCrop] = useState("Cotton");
  const [sowingMonth, setSowingMonth] = useState("June");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [irrigationMethod, setIrrigationMethod] = useState("Canal + Drip Irrigation");
  const [landSize, setLandSize] = useState<number>(3);
  const [currentProblem, setCurrentProblem] = useState("Yellow leaves");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [investigationResult, setInvestigationResult] = useState<any | null>(null);

  const isHi = language === "hi";
  const isMr = language === "mr";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls].slice(0, 10));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      // Crop Age Calculation
      const sowingIdx = MONTH_INDEX_MAP[sowingMonth] ?? 5;
      const currentIdx = MONTH_INDEX_MAP[currentMonthName] ?? new Date().getMonth();
      let monthDiff = currentIdx - sowingIdx;
      if (monthDiff < 0) monthDiff += 12;
      const estimatedDaysOld = Math.max(15, monthDiff * 30 + 15);

      // Stage Estimation
      let growthStageText = "";
      if (estimatedDaysOld <= 30) {
        growthStageText = isHi
          ? `अंकुरण एवं प्रारंभिक वानस्पतिक अवस्था (~${estimatedDaysOld} दिन की फसल)`
          : isMr
          ? `अंकुरण व सुरुवातीची वाढ (~${estimatedDaysOld} दिवसांचे पीक)`
          : `Germination & Early Vegetative Stage (~${estimatedDaysOld} Days Old)`;
      } else if (estimatedDaysOld <= 75) {
        growthStageText = isHi
          ? `सक्रिय कल्ले एवं पुष्पन अवस्था (~${estimatedDaysOld} दिन की फसल)`
          : isMr
          ? `फुटवे व फुलोरा टप्पा (~${estimatedDaysOld} दिवसांचे पीक)`
          : `Active Tillering & Flowering Stage (~${estimatedDaysOld} Days Old)`;
      } else {
        growthStageText = isHi
          ? `फली निर्माण एवं परिपक्वता अवस्था (~${estimatedDaysOld} दिन की फसल)`
          : isMr
          ? `फळधारणा व पक्वता टप्पा (~${estimatedDaysOld} दिवसांचे पीक)`
          : `Pod Formation & Grain Filling Stage (~${estimatedDaysOld} Days Old)`;
      }

      setInvestigationResult({
        cropAgeDays: estimatedDaysOld,
        growthStage: growthStageText,
        sowingMonth: sowingMonth,
        currentMonth: currentMonthName,
        possibleSoilIssue: isHi
          ? `${sowingMonth} में बोई गई फसल के लिए ${currentMonthName} में मृदा नाइट्रोजन निक्षालन (Leaching) एवं हल्की क्षारीयता (pH 7.8)`
          : isMr
          ? `${sowingMonth} मध्ये पेरलेल्या पिकासाठी ${currentMonthName} मध्ये नायट्रोजन कमी आणि सामू (pH 7.8)`
          : `Nitrogen leaching in ${currentMonthName} for crop sown in ${sowingMonth} with slight soil alkalinity (pH 7.8)`,
        npkStatus: {
          nitrogen: isHi ? "कम (185 kg/acre)" : isMr ? "कमी (१८५ kg/acre)" : "Deficient (185 kg/acre)",
          phosphorus: isHi ? "इष्टतम (34 kg/acre)" : isMr ? "योग्य (३४ kg/acre)" : "Optimal (34 kg/acre)",
          potassium: isHi ? "पर्याप्त (290 kg/acre)" : isMr ? "पुरेसे (२९० kg/acre)" : "Sufficient (290 kg/acre)",
        },
        estimatedPh: 7.8,
        likelyDeficiency: isHi ? "नाइट्रोजन (N) एवं जिंक (Zn) की कमी" : isMr ? "नायट्रोजन (N) व झिंक (Zn) कमतरता" : "Nitrogen (N) & Zinc (Zn) Deficiency",
        seasonalDiseaseRisk: isHi
          ? `${currentMonthName} के मौसम में उच्च आर्द्रता के कारण पत्तियों का कवक रोग (Leaf Spot / Blight)`
          : isMr
          ? `${currentMonthName} मध्ये जास्त आर्द्रतेमुळे बुरशीजन्य रोगाचा धोका`
          : `High Fungal Leaf Spot / Blight Risk due to ${currentMonthName} humidity & moisture`,
        fertilizerSchedule: isHi
          ? `अवस्था के अनुसार: नीम लेपित यूरिया @ 45 किग्रा/एकड़ + जिंक सल्फेट 21% @ 5 किग्रा/एकड़।`
          : isMr
          ? `टप्प्यानुसार: युरिया @ ४५ किग्रॅ/एकरी + झिंक सल्फेट २१% @ ५ किग्रॅ/एकरी.`
          : `Stage-specific: Neem Coated Urea @ 45 kg/acre + Zinc Sulphate (21%) @ 5 kg/acre.`,
        irrigationNeeds: isHi
          ? `${growthStageText} के दौरान मध्यम सिंचाई (मृदा नमी 50-60% बनाए रखें)।`
          : isMr
          ? `पुष्पन टप्प्यात मध्यम पाणी देणे आवश्यक.`
          : `Maintain 50-60% soil moisture during ${growthStageText}.`,
        organicSuggestions: isHi
          ? "10 ग्राम प्रति लीटर वर्मीवॉश या 5% नीम खली अर्क का पर्णीय छिड़काव करें।"
          : isMr
          ? "१० ग्रॅम प्रति लिटर वर्मीवॉश किंवा ५% कडुनिंब अर्क फवारा."
          : "Foliar spray of 10g/L Vermiwash or 5% Neem Cake extract.",
        recoverySteps: isHi
          ? [
              "खेत से अतिरिक्त पानी की निकासी सुनिश्चित करें।",
              "सुबह के समय यूरिया का छिड़काव करें।",
              "7 दिन बाद पत्तियों के हरेपन की पुनः जांच करें।",
            ]
          : isMr
          ? [
              "शेतात साचलेले अतिरिक्त पाणी काढून टाका.",
              "सकाळी युरियाची फवारणी करा.",
              "७ दिवसांनंतर पानांचा रंग तपासा.",
            ]
          : [
              "Ensure field drainage to prevent root hypoxia.",
              "Apply Neem-Coated Urea in moist soil during early morning hours.",
              "Re-assess crop foliage greening after 7 to 10 days.",
            ],
      });
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToOptions}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Farm Options</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-sm">
          Option 1: Existing Crop Problem Investigation
        </div>
      </div>

      {/* Hero Guidance */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-950 border border-amber-500/50 text-amber-400 shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Existing Crop Problem Investigation</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Diagnose crop age, growth stage, soil deficiencies, and seasonal disease risks.
            </p>
          </div>
        </div>

        {/* Current Month Display Badge */}
        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-md shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Current Month (Auto-detected): {currentMonthName}</span>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs Investigation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Photo Upload */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleInvestigate} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
            
            {/* Photo Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Upload Plant Photos (Optional - Max 10)</span>
              </span>

              <div className="flex items-center gap-3">
                <label className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900 cursor-pointer">
                  Upload Photos
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
                {images.length > 0 && (
                  <span className="text-xs text-slate-400 font-semibold">{images.length} images selected</span>
                )}
              </div>

              {images.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-slate-950/80 text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Crop</label>
              <select
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Cotton">Cotton</option>
                <option value="Paddy / Rice">Paddy / Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Soybean">Soybean</option>
                <option value="Maize">Maize</option>
                <option value="Vegetables">Vegetables</option>
              </select>
            </div>

            {/* Approximate Sowing Month Dropdown (12 Months) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Approximate Sowing Month (Select from Dropdown)
              </label>
              <select
                value={sowingMonth}
                onChange={(e) => setSowingMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none"
              >
                {ALL_MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block mt-1">
                AI will compare Sowing Month ({sowingMonth}) with Current Month ({currentMonthName}) to calculate crop age and growth stage.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (Regur)</option>
                <option value="Alluvial Loam Soil">Alluvial Loam Soil</option>
                <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil</option>
                <option value="Laterite Soil">Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Irrigation Method</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Canal + Drip Irrigation">Canal + Drip Irrigation</option>
                <option value="Rainfed (Monsoon Only)">Rainfed (Monsoon Only)</option>
                <option value="Borewell + Sprinkler">Borewell + Sprinkler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Current Problem Symptom</label>
              <select
                value={currentProblem}
                onChange={(e) => setCurrentProblem(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                {PROBLEM_DROPDOWN.map((prob) => (
                  <option key={prob} value={prob}>{prob}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Calculating Crop Age & Growth Stage...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Diagnose Crop Stage & Problem</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Output Report */}
        <div className="lg:col-span-6 space-y-4">
          {investigationResult ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase">AI Diagnosis & Growth Analysis</span>
                  <h3 className="text-xl font-black text-white">{currentCrop} ({currentProblem})</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  {location.district}, {location.state}
                </span>
              </div>

              {/* Crop Age & Growth Stage Badge Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Estimated Crop Age & Stage:</span>
                  </span>
                  <span className="text-xs font-black text-amber-300">Sown: {investigationResult.sowingMonth} → Now: {investigationResult.currentMonth}</span>
                </div>
                <p className="text-sm font-black text-white">{investigationResult.growthStage}</p>
              </div>

              {/* Possible Soil Issue */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 block">Possible Soil & Climate Issue:</span>
                <p className="text-xs text-slate-200 font-semibold">{investigationResult.possibleSoilIssue}</p>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Likely Deficiency</span>
                  <span className="font-bold text-amber-300">{investigationResult.likelyDeficiency}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Seasonal Disease Risk</span>
                  <span className="font-bold text-red-300">{investigationResult.seasonalDiseaseRisk}</span>
                </div>
              </div>

              {/* Fertilizer & Irrigation Schedules */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stage-Specific Fertilizer Schedule:</span>
                  </span>
                  <p className="mt-0.5">{investigationResult.fertilizerSchedule}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                  <span className="font-bold text-teal-300 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-teal-400" />
                    <span>Irrigation Needs for Stage:</span>
                  </span>
                  <p className="mt-0.5">{investigationResult.irrigationNeeds}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">Recovery Steps:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  {investigationResult.recoverySteps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Ready to Calculate Growth Stage</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Select Sowing Month and Problem Symptom on the left. AI will use Sowing Month vs Current Month ({currentMonthName}) to calculate crop age, growth stage, fertilizer timing, and seasonal disease risks.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
