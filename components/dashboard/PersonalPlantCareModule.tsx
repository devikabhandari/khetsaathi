"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Upload,
  Camera,
  Trash2,
  RefreshCw,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Download,
  ArrowLeft,
  FileText,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface PersonalPlantCareProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToChoices?: () => void;
}

interface ImageItem {
  id: string;
  url: string;
  name: string;
  resolution: string;
  sizeMb: string;
}

export const PersonalPlantCareModule: React.FC<PersonalPlantCareProps> = ({
  location,
  weather,
  onBackToChoices,
}) => {
  const { t, language } = useLanguage();

  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const isHi = language === "hi";
  const isMr = language === "mr";

  // Handle File Uploads
  const handleFiles = (files: FileList | File[]) => {
    setValidationError(null);
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > 10) {
      setValidationError(
        isHi
          ? "आप केवल अधिकतम 10 चित्र अपलोड कर सकते हैं।"
          : isMr
          ? "तुम्ही जास्तीत जास्त १० फोटो अपलोड करू शकता."
          : "You can upload a maximum of 10 images."
      );
      return;
    }

    const newItems: ImageItem[] = validFiles.map((file, idx) => ({
      id: `img_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      name: file.name,
      resolution: "1920x1080",
      sizeMb: (file.size / (1024 * 1024)).toFixed(1),
    }));

    const updated = [...images, ...newItems];
    setImages(updated);
    if (!activeImageId && updated.length > 0) {
      setActiveImageId(updated[0].id);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  // Camera Handling
  const startCamera = async () => {
    setValidationError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      setValidationError(
        isHi
          ? "कैमरा खोलने में असमर्थ। कृपया ब्राउज़र अनुमति की जांच करें।"
          : isMr
          ? "कॅमेरा उघडण्यात त्रुटी. अनुमती तपासा."
          : "Unable to access camera. Please check browser permissions."
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraVideoRef.current && cameraVideoRef.current.srcObject) {
      const stream = cameraVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!cameraVideoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = cameraVideoRef.current.videoWidth || 1280;
    canvas.height = cameraVideoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(cameraVideoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const newImg: ImageItem = {
        id: `cam_${Date.now()}`,
        url: dataUrl,
        name: `Captured_Leaf_${images.length + 1}.jpg`,
        resolution: `${canvas.width}x${canvas.height}`,
        sizeMb: "1.4",
      };
      const updated = [...images, newImg];
      setImages(updated);
      setActiveImageId(newImg.id);
    }
    stopCamera();
  };

  // Image actions
  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    if (activeImageId === id) {
      setActiveImageId(updated.length > 0 ? updated[0].id : null);
    }
    if (updated.length === 0) setDiagnosisResult(null);
  };

  const clearAllImages = () => {
    setImages([]);
    setActiveImageId(null);
    setDiagnosisResult(null);
  };

  // Image Validation & Plant Diagnosis
  const handleAnalyze = () => {
    if (images.length === 0) return;
    setValidationError(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      // Random mock quality check to demonstrate object/blur validation
      const sampleName = images[0].name.toLowerCase();
      if (sampleName.includes("blur") || sampleName.includes("car") || sampleName.includes("paper") || sampleName.includes("person")) {
        setValidationError(
          isHi
            ? "अमान्य छवि: कृपया स्पष्ट पौधे/पत्ती की फोटो अपलोड करें। कागज़, इंसानों या वाहनों की फोटो मान्य नहीं है।"
            : isMr
            ? "अवैध फोटो: कृपया वनस्पती किंवा पानाचा स्पष्ट फोटो अपलोड करा."
            : "Invalid image: Please upload a clear photo of a plant leaf or stem. Unrelated objects, blurry photos, papers, or humans are rejected."
        );
        return;
      }

      setDiagnosisResult({
        plantName: isHi ? "गुलाब / मिर्च का पौधा" : isMr ? "गुलाब / मिरचीचे रोप" : "Rose / Chilli Garden Plant",
        disease: isHi ? "पाउडरी मिल्ड्यू (कवक रोग)" : isMr ? "भुरी रोग (बुरशीजन्य रोग)" : "Powdery Mildew (Fungal Infection)",
        confidence: "96.4%",
        cause: isHi
          ? "उच्च आर्द्रता (65%+) और पत्तियों पर ठहरा हुआ पानी कवक बीजाणुओं के प्रसार का कारण बनता है।"
          : isMr
          ? "हवेतील जास्त आर्द्रता व पानांवरील पाणी यामुळे बुरशीची वाढ होते."
          : "High relative humidity (>65%) coupled with stagnant leaf surface moisture encourages Erysiphe fungal spore germination.",
        organicRemedy: isHi
          ? "1 लीटर पानी में 5 मिली नीम तेल + 2 ग्राम बेकिंग सोडा घोलकर हर 5 दिन में छिड़कें।"
          : isMr
          ? "१ लिटर पाण्यात ५ मिी कडुनिंब तेल + २ ग्रॅम बेकिंग सोडा मिसळून फवारा."
          : "Spray a solution of 5ml organic Neem Oil + 2g Baking Soda per liter of water every 5 days.",
        chemicalRemedy: isHi
          ? "सख्त प्रकोप के लिए हेक्साकोनाज़ोल 5% EC @ 1.5 मिली प्रति लीटर छिड़कें।"
          : isMr
          ? "हेक्साकोनाझोल ५% EC @ १.५ मिली प्रति लिटर फवारा."
          : "For severe symptoms, spray Hexaconazole 5% EC @ 1.5 ml/L water.",
        prevention: isHi
          ? "शाम को पत्तियों पर सीधे पानी छिड़कने से बचें। हवा का प्रवाह बनाए रखें।"
          : isMr
          ? "संध्याकाळी पानांवर पाणी मारणे टाळा."
          : "Avoid overhead watering during late evening. Ensure adequate plant spacing for ventilation.",
      });
    }, 1200);
  };

  const activeImage = images.find((i) => i.id === activeImageId) || images[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChoices}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{t("plantCare.back")}</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-sm">
          🌿 Personal Plant Care
        </div>
      </div>

      {/* Hero Guidance Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("plantCare.heroTitle")}</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {t("plantCare.heroDesc")}
            </p>
          </div>
        </div>

        {images.length > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-extrabold shadow-md shrink-0">
            {images.length} / 10 {t("plantCare.imagesUploaded")}
          </div>
        )}
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

      {/* Live Camera Modal Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 overflow-hidden space-y-4 p-4 text-center">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              <video ref={cameraVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-2xl border-dashed m-6 pointer-events-none flex items-center justify-center">
                <span className="bg-slate-950/80 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300">
                  {t("plantCare.alignNotice")}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
              >
                {t("plantCare.captureBtn")}
              </button>
              <button
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold"
              >
                {t("plantCare.cancelCamera")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Upload & Preview Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Dropzone & Thumbnails */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 ${
              isDragOver
                ? "border-emerald-400 bg-emerald-950/30 scale-[1.01]"
                : "border-slate-800 bg-slate-900/80 hover:border-emerald-500/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
              <Upload className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">{t("plantCare.dragDropTitle")}</h3>
              <p className="text-xs text-slate-400 mt-1">{t("plantCare.dragDropSubtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer"
              >
                {t("plantCare.uploadBtn")}
              </button>

              <button
                onClick={startCamera}
                className="px-5 py-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-950 cursor-pointer"
              >
                {t("plantCare.cameraBtn")}
              </button>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {images.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Selected Thumbnails ({images.length})</span>
                <button
                  onClick={clearAllImages}
                  className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
                >
                  {t("plantCare.clearAll")}
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                {images.map((img) => {
                  const isActive = img.id === activeImageId;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setActiveImageId(img.id)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isActive ? "border-emerald-400 scale-105 shadow-md" : "border-slate-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-red-400 hover:bg-red-950"
                        title={t("plantCare.deleteImage")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Active Preview & Diagnosis Output */}
        <div className="lg:col-span-6 space-y-4">
          
          {images.length > 0 && activeImage ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-5">
              
              {/* Active Image Large Display */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                <img src={activeImage.url} alt={activeImage.name} className="w-full h-full object-contain" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                  {t("plantCare.validationStatus")}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 text-slate-950 font-black text-xs hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{t("plantCare.analyzing")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{t("plantCare.analyzeBtn")}</span>
                  </>
                )}
              </button>

              {/* Diagnosis Output Report */}
              {diagnosisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 pt-3 border-t border-slate-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase">Detected Plant</span>
                      <h4 className="text-xl font-black text-white">{diagnosisResult.plantName}</h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-black">
                      {diagnosisResult.confidence} {t("plantCare.match")}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-amber-300 block">Condition / Diagnosis:</span>
                    <p className="text-sm font-bold text-white">{diagnosisResult.disease}</p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{diagnosisResult.cause}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-slate-200">
                      <span className="font-bold text-emerald-300 block">🌱 {t("plantCare.organicRemedy")}:</span>
                      <p className="mt-0.5">{diagnosisResult.organicRemedy}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                      <span className="font-bold text-amber-300 block">🧪 {t("plantCare.chemicalRemedy")}:</span>
                      <p className="mt-0.5">{diagnosisResult.chemicalRemedy}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Report downloaded as PDF.")}
                    className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Complete Diagnosis Report</span>
                  </button>
                </motion.div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <Leaf className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">{t("plantCare.awaitingTitle")}</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {t("plantCare.awaitingDesc")}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
