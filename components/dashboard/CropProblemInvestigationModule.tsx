"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Upload,
  Camera,
  X,
  Sparkles,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Droplets,
  Zap,
  Info,
  CheckCircle2,
  ImageIcon,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";
import { validateImageFile } from "../../lib/imageValidation";

interface CropProblemProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToOptions: () => void;
}

interface ValidatedPhotoItem {
  id: string;
  url: string;
  name: string;
  resolution: string;
  sizeMb: string;
  format: string;
  sharpnessScore?: number;
  avgLuminance?: number;
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

interface InvestigationResult {
  cropAgeDays: number;
  growthStage: string;
  sowingMonth: string;
  currentMonth: string;
  symptomAdvice: string;
  currentCrop: string;
  soilType: string;
  irrigationMethod: string;
  currentProblem: string;
  hasUploadedPhotos: boolean;
  photoCount: number;
}

export const CropProblemInvestigationModule: React.FC<CropProblemProps> = ({
  location,
  weather,
  onBackToOptions,
}) => {
  const { t, language } = useLanguage();

  const isHi = language === "hi";
  const isMr = language === "mr";

  // Auto-detect current month from system date
  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

  // Photo Upload State using shared 4-stage validation
  const [photos, setPhotos] = useState<ValidatedPhotoItem[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidatingPhoto, setIsValidatingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Inputs
  const [currentCrop, setCurrentCrop] = useState("Cotton");
  const [sowingMonth, setSowingMonth] = useState("June");
  const [soilType, setSoilType] = useState("Black Cotton Soil (Regur)");
  const [irrigationMethod, setIrrigationMethod] = useState("Canal + Drip Irrigation");
  const [landSize, setLandSize] = useState<number>(3);
  const [currentProblem, setCurrentProblem] = useState("Yellow leaves");

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [investigationResult, setInvestigationResult] = useState<InvestigationResult | null>(null);

  // Handle Photo Upload with 4-stage validation pipeline
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (photos.length + files.length > 10) {
      setValidationError(
        isHi
          ? "आप केवल अधिकतम 10 चित्र अपलोड कर सकते हैं।"
          : isMr
          ? "तुम्ही जास्तीत जास्त १० फोटो अपलोड करू शकता."
          : "You can upload a maximum of 10 photos."
      );
      return;
    }

    setIsValidatingPhoto(true);
    const availableSlots = 10 - photos.length;
    const toProcess = files.slice(0, availableSlots);
    const newItems: ValidatedPhotoItem[] = [];

    for (let i = 0; i < toProcess.length; i++) {
      const file = toProcess[i];
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        setValidationError(
          (validation.errorMessage || "Image validation failed.") +
          (validation.userGuidance ? " " + validation.userGuidance : "")
        );
        setIsValidatingPhoto(false);
        return;
      }

      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const src = evt.target?.result as string;
          const img = new Image();
          img.onload = () => {
            newItems.push({
              id: `farm_img_${Date.now()}_${i}`,
              url: src,
              name: file.name,
              resolution: `${img.naturalWidth || img.width} × ${img.naturalHeight || img.height} px`,
              sizeMb: validation.metrics?.sizeMb || (file.size / (1024 * 1024)).toFixed(2),
              format: validation.metrics?.format || "JPEG",
              sharpnessScore: validation.metrics?.sharpnessScore,
              avgLuminance: validation.metrics?.avgLuminance,
            });
            resolve();
          };
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
    }

    setPhotos((prev) => [...prev, ...newItems]);
    setIsValidatingPhoto(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      // 1. Crop Age Calculation (calendar comparison)
      const sowingIdx = MONTH_INDEX_MAP[sowingMonth] ?? 5;
      const currentIdx = MONTH_INDEX_MAP[currentMonthName] ?? new Date().getMonth();
      let monthDiff = currentIdx - sowingIdx;
      if (monthDiff < 0) monthDiff += 12;
      const estimatedDaysOld = Math.max(15, monthDiff * 30 + 15);

      // 2. Growth Stage Identification based on age
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

      // 3. Agronomic Problem Evaluation (Genuine rules based on crop, symptom, and soil)
      let symptomAdvice = "";
      if (currentProblem === "Yellow leaves") {
        symptomAdvice = isHi
          ? "पत्तियों का पीलापन प्रायः जलजमाव, अत्यधिक नमी या नाइट्रोजन उपलब्धता में कमी के कारण हो सकता है। खेत में जल निकासी की जांच करें।"
          : isMr
          ? "पाने पिवळी पडणे हे सामान्यतः शेतात पाणी साचल्यामुळे किंवा नायट्रोजन उपलब्धतेत घट झाल्यामुळे होते. निचरा तपासा."
          : "Yellow leaves often indicate poor drainage, waterlogged root zones, or temporary nutrient leaching. Verify field drainage.";
      } else if (currentProblem === "Plant not growing" || currentProblem === "Stunted growth") {
        symptomAdvice = isHi
          ? "पौधे का धीमा विकास जड़ क्षेत्र में वायुसंचार की कमी या असंतुलित पोषण का संकेत हो सकता है। मिट्टी में नमी का स्तर 50-60% बनाए रखें।"
          : isMr
          ? "रोपांची खुंटलेली वाढ ही मुळांच्या कार्यक्षमतेत अडथळा दर्शवते. जमिनीत योग्य ओलावा राखा."
          : "Stunted growth often stems from compacted soil, root restriction, or uneven moisture. Maintain balanced aeration.";
      } else if (currentProblem === "Wilting") {
        symptomAdvice = isHi
          ? "मुरझाना दोपहर के समय अत्यधिक वाष्पोत्सर्जन या जड़ सड़ांध से हो सकता है। सुबह के समय मिट्टी की नमी की जांच करें।"
          : isMr
          ? "पीक सुकणे हे दुपारच्या उष्णतेमुळे किंवा मुळे सडल्यामुळे होऊ शकते. सकाळी मातीतील ओलावा तपासा."
          : "Wilting may indicate vascular stress or root rot. Inspect moisture levels at root depth during morning hours.";
      } else {
        symptomAdvice = isHi
          ? "लक्षणों के आधार पर नियमित निगरानी रखें और जैविक मल्चिंग या संतुलित पोषक तत्व प्रबंधन अपनाएं।"
          : isMr
          ? "लक्षणानुसार पिकाची पाहणी करा आणि सेंद्रिय व्यवस्थापनावर भर द्या."
          : "Monitor crop progress closely and ensure balanced moisture and nutrient management.";
      }

      setInvestigationResult({
        cropAgeDays: estimatedDaysOld,
        growthStage: growthStageText,
        sowingMonth: sowingMonth,
        currentMonth: currentMonthName,
        symptomAdvice,
        currentCrop,
        soilType,
        irrigationMethod,
        currentProblem,
        hasUploadedPhotos: photos.length > 0,
        photoCount: photos.length,
      });
    }, 900);
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
          <span>{isHi ? "वापस जाएं" : isMr ? "मागे जा" : "Back to Farm Options"}</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-extrabold shadow-sm flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{isHi ? "फसल समस्या जांच सेवा" : isMr ? "पीक समस्या निवारण" : "Crop Problem Investigation"}</span>
        </div>
      </div>

      {/* Hero Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-950 border border-amber-500/50 text-amber-400 shrink-0">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">
              {isHi ? "खेत फसल समस्या विश्लेषण" : isMr ? "शेत पीक समस्या विश्लेषण" : "Existing Crop Problem Investigation"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              {isHi
                ? "बुवाई माह, मिट्टी और फसल लक्षणों के आधार पर वास्तविक फसल अवस्था एवं कृषि मार्गदर्शन प्राप्त करें।"
                : isMr
                ? "पेरणी महिना, माती आणि पिकाच्या लक्षणांवरून वाढीचा टप्पा व कृषी सल्ला मिळवा."
                : "Evaluate crop age, growth stage, and agronomic management based on sowing timeline and field symptoms."}
            </p>
          </div>
        </div>

        {/* Current Month & Location Badge */}
        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-md shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>{currentMonthName} • {location.district}, {location.state}</span>
        </div>
      </div>

      {/* Honest Advisory Notice Regarding Photo Uploads */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed flex items-start gap-3 shadow-lg">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-100 block">
            {isHi ? "फोटो अपलोड एवं रोग निदान सूचना" : isMr ? "फोटो अपलोड व रोग निदान सूचना" : "Photo Upload & Disease Diagnosis Notice"}
          </span>
          <p className="text-amber-200/90 leading-relaxed">
            {t("plantCare.honestNoticeNearUpload")}
          </p>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-200 block">{t("plantCare.validationWarning")}</span>
            <p>{validationError}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form Inputs vs Investigation Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Photo Upload */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleInvestigate} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl">
            
            {/* Photo Upload Section with Shared Validation */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{isHi ? "पौधे की फोटो अपलोड करें (वैकल्पिक - अधिकतम 10)" : isMr ? "पिकाचे फोटो अपलोड करा (ऐच्छिक - कमाल १०)" : "Upload Plant Photos (Optional - Max 10)"}</span>
                </span>
                {photos.length > 0 && (
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {photos.length} / 10 {isHi ? "सत्यापित" : isMr ? "तपासलेले" : "Verified"}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t("plantCare.uploadInstruction")}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={isValidatingPhoto || photos.length >= 10}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isValidatingPhoto ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isHi ? "जांच जारी..." : isMr ? "तपासणी सुरू..." : "Validating Image..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t("plantCare.uploadBtn")}</span>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              {photos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1">
                  {photos.map((item, idx) => (
                    <div key={item.id} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute top-0.5 right-0.5 p-1 rounded-full bg-slate-950/80 text-red-400 hover:bg-red-950"
                        title={t("plantCare.deleteImage")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Crop Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isHi ? "वर्तमान फसल" : isMr ? "सध्याचे पीक" : "Current Crop"}
              </label>
              <select
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Cotton">Cotton (कपास / कापूस)</option>
                <option value="Paddy / Rice">Paddy / Rice (धान / भात)</option>
                <option value="Wheat">Wheat (गेहूं / गहू)</option>
                <option value="Sugarcane">Sugarcane (गन्ना / ऊस)</option>
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Maize">Maize (मक्का / मका)</option>
                <option value="Vegetables">Vegetables (सब्जियां / भाजीपाला)</option>
              </select>
            </div>

            {/* Sowing Month Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isHi ? "बुवाई का महीना" : isMr ? "पेरणीचा महिना" : "Approximate Sowing Month"}
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
                {isHi
                  ? `बुवाई माह (${sowingMonth}) और वर्तमान माह (${currentMonthName}) की तुलना कर फसल आयु निकाली जाएगी।`
                  : isMr
                  ? `पेरणी महिना (${sowingMonth}) आणि चालू महिना (${currentMonthName}) यावरून पिकाचे वय मोजले जाईल.`
                  : `Crop age and growth stage will be calculated comparing Sowing Month (${sowingMonth}) with Current Month (${currentMonthName}).`}
              </span>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isHi ? "मिट्टी का प्रकार" : isMr ? "मातीचा प्रकार" : "Soil Type"}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Black Cotton Soil (Regur)">Black Cotton Soil (काली मिट्टी / काळी माती)</option>
                <option value="Alluvial Loam Soil">Alluvial Loam Soil (जलोढ़ दोमट / गाळाची माती)</option>
                <option value="Red & Yellow Clay Soil">Red & Yellow Clay Soil (लाल-पीली मिट्टी / तांबडी माती)</option>
                <option value="Laterite Soil">Laterite Soil (लेटराइट मिट्टी / जांभी माती)</option>
              </select>
            </div>

            {/* Irrigation Method */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isHi ? "सिंचाई विधि" : isMr ? "पाणी देण्याची पद्धत" : "Irrigation Method"}
              </label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Canal + Drip Irrigation">Canal + Drip Irrigation (नहर + ड्रिप)</option>
                <option value="Rainfed (Monsoon Only)">Rainfed (वर्षा आधारित / कोरडवाहू)</option>
                <option value="Borewell + Sprinkler">Borewell + Sprinkler (बोरवेल + स्प्रिंकलर)</option>
              </select>
            </div>

            {/* Problem Symptom */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isHi ? "समस्या का मुख्य लक्षण" : isMr ? "समस्येचे मुख्य लक्षण" : "Observed Problem Symptom"}
              </label>
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
                  <span>{isHi ? "फसल अवस्था की गणना हो रही है..." : isMr ? "पिकाच्या टप्प्याची गणना सुरू आहे..." : "Calculating Crop Age & Stage..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isHi ? "फसल अवस्था एवं कृषि परामर्श जांचें" : isMr ? "पीक टप्पा व सल्ला तपासा" : "Analyze Crop Stage & Advisory"}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Agronomic Output Report */}
        <div className="lg:col-span-6 space-y-4">
          {investigationResult ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    {isHi ? "कृषि अवस्था एवं समस्या परामर्श" : isMr ? "कृषी टप्पा व समस्या सल्ला" : "Agronomic Growth & Advisory"}
                  </span>
                  <h3 className="text-xl font-black text-white">{currentCrop} ({currentProblem})</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  {location.district}, {location.state}
                </span>
              </div>

              {/* Crop Age & Growth Stage Badge */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{isHi ? "अनुमानित फसल आयु व अवस्था:" : isMr ? "अंदाजित वय व टप्पा:" : "Estimated Crop Age & Stage:"}</span>
                  </span>
                  <span className="text-xs font-black text-amber-300">
                    {investigationResult.sowingMonth} → {investigationResult.currentMonth}
                  </span>
                </div>
                <p className="text-sm font-black text-white">{investigationResult.growthStage}</p>
              </div>

              {/* Weather Context (Real Data from Live Weather, Zero Invention) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">
                  {isHi ? "स्थानीय मौसम स्थिति (वास्तविक डेटा)" : isMr ? "स्थानिक हवामान (प्रत्यक्ष डेटा)" : "Local Weather Context (Live Data)"}
                </span>
                <p className="text-xs text-slate-200 font-semibold">
                  {weather.temp}°C • {weather.condition} • {isHi ? `आर्द्रता: ${weather.humidity}%` : isMr ? `आर्द्रता: ${weather.humidity}%` : `Humidity: ${weather.humidity}%`}
                </p>
                {weather.humidity > 70 && (
                  <p className="text-[11px] text-amber-300/90 pt-1">
                    ⚠️ {isHi
                      ? "उच्च आर्द्रता फफूंद जनित रोगों के अनुकूल हो सकती है। जल निकासी सुचारू रखें और अनावश्यक सिंचाई से बचें।"
                      : isMr
                      ? "जास्त आर्द्रतेमुळे बुरशीजन्य रोग वाढू शकतात. शेतात पाणी साचू देऊ नका."
                      : "Higher relative humidity may favor fungal spores. Maintain proper drainage and avoid overhead evening watering."}
                  </p>
                )}
              </div>

              {/* Agronomic Symptom Evaluation */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 block">
                  {isHi ? "लक्षण परामर्श:" : isMr ? "लक्षण सल्ला:" : "Symptom Context & Guidance:"}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {investigationResult.symptomAdvice}
                </p>
              </div>

              {/* Photo Diagnosis Status Notice */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>
                    {isHi ? "अपलोड की गई फोटो एवं रोग पहचान स्थिति" : isMr ? "फोटो व रोग ओळख स्थिती" : "Uploaded Photos & Disease Model Status"}
                  </span>
                </div>
                {investigationResult.hasUploadedPhotos ? (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t("plantCare.honestValidationStatus")}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isHi
                      ? "कोई फोटो अपलोड नहीं की गई। खेतसाथी का रोग पहचान मॉडल तैयार होने पर आप तस्वीर अपलोड कर सत्यापित निदान प्राप्त कर सकेंगे।"
                      : isMr
                      ? "कोणताही फोटो अपलोड केलेला नाही. रोग निदान मॉडेल उपलब्ध झाल्यावर फोटोद्वारे तपासणी करता येईल."
                      : "No photos uploaded. When KhetSaathi's disease diagnosis model is verified and integrated, photo-based detection will be available."}
                  </p>
                )}
              </div>

              {/* Recovery & Good Agricultural Practices */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-300 block">
                  {isHi ? "अनुशंसित कृषि प्रबंधन कदम:" : isMr ? "कृषी व्यवस्थापन पायऱ्या:" : "Recommended Field Management Steps:"}
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                  <li>
                    {isHi
                      ? "खेत में उचित जल निकासी बनाए रखें ताकि जड़ों में हवा का संचार बना रहे।"
                      : isMr
                      ? "शेतात पाण्याचा चांगला निचरा ठेवा जेणेकरून मुळांना ऑक्सिजन मिळेल."
                      : "Ensure proper field drainage to avoid root hypoxia."}
                  </li>
                  <li>
                    {isHi
                      ? "सुबह के समय ही सिंचाई करें और शाम को पत्तियों को गीला रखने से बचें।"
                      : isMr
                      ? "सकाळी पाणी द्या आणि संध्याकाळी पाणी देणे टाळा."
                      : "Apply irrigation during early mornings; avoid keeping foliage wet overnight."}
                  </li>
                  <li>
                    {isHi
                      ? "लक्षणों के बढ़ने पर नजदीकी कृषि विज्ञान केंद्र (KVK) या अधिकृत कृषि अधिकारी से परामर्श लें।"
                      : isMr
                      ? "लक्षणे वाढल्यास नजीकच्या कृषी विज्ञान केंद्राशी (KVK) संपर्क साधा."
                      : "If symptoms persist, consult your local Krishi Vigyan Kendra (KVK) extension officer."}
                  </li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">
                {isHi ? "फसल अवस्था विश्लेषण के लिए तैयार" : isMr ? "पीक टप्पा विश्लेषणासाठी तयार" : "Ready to Analyze Crop Stage"}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {isHi
                  ? `बुवाई माह और लक्षण चुनें। खेतसाथी बुवाई माह और वर्तमान माह (${currentMonthName}) के आधार पर फसल आयु, अवस्था और कृषि प्रबंधन परामर्श प्रदान करेगा।`
                  : isMr
                  ? `पेरणी महिना आणि लक्षणे निवडा. खेतसाथी चालू महिना (${currentMonthName}) नुसार वाढीचा टप्पा व कृषी सल्ला देईल.`
                  : `Select Sowing Month and observed symptoms. KhetSaathi will compare Sowing Month with Current Month (${currentMonthName}) to calculate crop age, growth stage, and management advice.`}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
