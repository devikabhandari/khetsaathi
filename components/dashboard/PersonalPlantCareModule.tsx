"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Upload,
  Camera,
  X,
  AlertTriangle,
  ArrowLeft,
  Info,
  CheckCircle2,
  ImageIcon,
  Sun,
  Droplets,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";
import {
  validateImageFile,
  ImageQualityMetrics,
} from "../../lib/imageValidation";

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
  format?: string;
  sharpnessScore?: number;
  avgLuminance?: number;
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
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const isHi = language === "hi";
  const isMr = language === "mr";

  // Handle File Uploads with shared 4-stage validation
  const handleFiles = async (files: FileList | File[]) => {
    setValidationError(null);
    const filesArray = Array.from(files);
    if (filesArray.length === 0) return;

    if (images.length + filesArray.length > 10) {
      setValidationError(
        isHi
          ? "आप केवल अधिकतम 10 चित्र अपलोड कर सकते हैं।"
          : isMr
          ? "तुम्ही जास्तीत जास्त १० फोटो अपलोड करू शकता."
          : "You can upload a maximum of 10 images."
      );
      return;
    }

    const availableSlots = 10 - images.length;
    const toProcess = filesArray.slice(0, availableSlots);
    const newItems: ImageItem[] = [];

    for (let i = 0; i < toProcess.length; i++) {
      const file = toProcess[i];
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        setValidationError(
          (validation.errorMessage || "Image validation failed.") +
          (validation.userGuidance ? " " + validation.userGuidance : "")
        );
        return;
      }

      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const src = evt.target?.result as string;
          const img = new Image();
          img.onload = () => {
            newItems.push({
              id: `img_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
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
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        setValidationError(null);
        const validation = await validateImageFile(blob, `Plant_Photo_${images.length + 1}.jpg`);
        if (!validation.isValid) {
          setValidationError(
            (validation.errorMessage || "Image validation failed.") +
            (validation.userGuidance ? " " + validation.userGuidance : "")
          );
          return;
        }
        stopCamera();
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const newImg: ImageItem = {
          id: `cam_${Date.now()}`,
          url: dataUrl,
          name: `Plant_Photo_${images.length + 1}.jpg`,
          resolution: `${canvas.width} × ${canvas.height} px`,
          sizeMb: validation.metrics?.sizeMb || (blob.size / (1024 * 1024)).toFixed(2),
          format: validation.metrics?.format || "JPEG",
          sharpnessScore: validation.metrics?.sharpnessScore,
          avgLuminance: validation.metrics?.avgLuminance,
        };
        const updated = [...images, newImg];
        setImages(updated);
        setActiveImageId(newImg.id);
      }, "image/jpeg", 0.9);
    }
  };

  // Image actions
  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    if (activeImageId === id) {
      setActiveImageId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const clearAllImages = () => {
    setImages([]);
    setActiveImageId(null);
    setValidationError(null);
  };

  const activeImage = images.find((i) => i.id === activeImageId) || images[0];

  return (
    <div className="space-y-6">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToChoices}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>{t("plantCare.back")}</span>
        </button>

        <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold shadow-sm flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t("plantCare.moduleTitle")}</span>
        </div>
      </div>

      {/* Hero Advisory Header */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-inner shrink-0">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{t("plantCare.heroTitle")}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
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

      {/* Honest Advisory Notice Near Upload Area */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed flex items-start gap-3 shadow-lg">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-100 block">
            {isHi ? "सलाह सूचना" : isMr ? "सल्ला सूचना" : "Advisory Notice"}
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

      {/* Live Camera Modal */}
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
                className="px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                {t("plantCare.cancelCamera")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout: Upload Dropzone & Advisory Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Area */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Dropzone Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-4 ${
              isDragOver
                ? "border-emerald-400 bg-emerald-950/30 scale-[1.01]"
                : "border-slate-800 bg-slate-900/80 hover:border-emerald-500/40"
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

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">{t("plantCare.dragDropTitle")}</h3>
              <p className="text-xs text-slate-400">{t("plantCare.uploadInstruction")}</p>
              <p className="text-[11px] text-slate-500">{t("plantCare.dragDropSubtitle")}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{t("plantCare.uploadBtn")}</span>
              </button>

              <button
                onClick={startCamera}
                className="px-6 py-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-950 cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>{t("plantCare.cameraBtn")}</span>
              </button>
            </div>
          </div>

          {/* Thumbnails Gallery */}
          {images.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  {isHi ? `अपलोड की गई तस्वीरें (${images.length})` : isMr ? `अपलोड केलेले फोटो (${images.length})` : `Uploaded Photos (${images.length})`}
                </span>
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

          {/* Practical Good Agricultural Practices (GAP) Card */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isHi ? "सामान्य पौध स्वास्थ्य एवं स्वच्छता मार्गदर्शन" : isMr ? "सामान्य रोप आरोग्य व काळजी मार्गदर्शन" : "General Plant Health & Hygiene Guidance"}
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHi ? "प्रकाश एवं वायु संचार" : isMr ? "प्रकाश आणि हवा" : "Light & Air Circulation"}</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {isHi
                    ? "पौधों के बीच पर्याप्त दूरी रखें ताकि पत्तियों में हवा का आवागमन हो सके और नमी से फंगस न फैले।"
                    : isMr
                    ? "रोपांमध्ये योग्य अंतर ठेवा जेणेकरून हवा खेळती राहील आणि बुरशीचा प्रादुर्भाव टळेल."
                    : "Ensure spacing between plants for adequate airflow to minimize moisture-induced fungal issues."}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isHi ? "सिंचाई सावधानी" : isMr ? "पाणी व्यवस्थापन" : "Watering Routine"}</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {isHi
                    ? "पानी हमेशा पौधे की जड़ के पास दें। शाम के समय पत्तियों पर पानी छिड़कने से बचें।"
                    : isMr
                    ? "पाणी नेहमी मुळाशी द्या. संध्याकाळी पानांवर पाणी टाकणे टाळा."
                    : "Water at the soil root zone in early morning; avoid spraying foliage during evening hours."}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? "नियमित पत्ती निरीक्षण" : isMr ? "पानांची तपासणी" : "Regular Leaf Inspection"}</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {isHi
                    ? "पत्तियों के निचले हिस्से की साप्ताहिक जांच करें जहां कीट और शुरुआती धब्बे दिखते हैं।"
                    : isMr
                    ? "पानांच्या खालच्या भागाची नियमित पाहणी करा, जिथे कीड किंवा ठिपके आधी दिसतात."
                    : "Inspect the undersides of leaves weekly to catch early signs of pests, spots, or webbing."}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5 text-rose-400" />
                  <span>{isHi ? "स्वच्छ कटाई-छंटाई" : isMr ? "छाटणी व स्वच्छता" : "Sanitation & Pruning"}</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  {isHi
                    ? "सूखी या पीली पत्तियों को साफ कैंची से हटाकर खेत/गमले से दूर नष्ट करें।"
                    : isMr
                    ? "वाळलेली किंवा पिवळी पाने स्वच्छ कात्रीने कापून लांब नष्ट करा."
                    : "Remove and dispose of yellowed or dried leaves using clean shears to prevent spread."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Preview & Honest Verification Status */}
        <div className="lg:col-span-6 space-y-4">
          
          {images.length > 0 && activeImage ? (
            <div className="space-y-4">
              
              {/* Active Image Large Display */}
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>{t("plantCare.imagePreview")}</span>
                  </span>

                  <div className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t("plantCare.validationStatus")}</span>
                  </div>
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
                  <img src={activeImage.url} alt={activeImage.name} className="w-full h-full object-contain" />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-amber-300">
                    {activeImage.name} ({activeImage.sizeMb} MB)
                  </div>
                </div>
              </div>

              {/* Honest Notice of Model Under Development */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 backdrop-blur-2xl shadow-xl space-y-4"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      {isHi ? "अपलोड जांच स्थिति" : isMr ? "अपलोड तपासणी स्थिती" : "Upload Check Status"}
                    </h3>
                    <p className="text-xs text-amber-300/90 font-medium">
                      {t("plantCare.honestValidationStatus")}
                    </p>
                  </div>
                </div>

                {/* Validation Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {isHi ? "फाइल एवं रेजोल्यूशन" : isMr ? "फाइल व रेझोल्यूशन" : "File & Resolution"}
                    </span>
                    <p className="text-xs text-emerald-400 font-bold">
                      {activeImage.resolution} ({activeImage.format || "JPEG"})
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isHi ? `आकार: ${activeImage.sizeMb} MB (अधिकतम 10 MB मान्य)` : isMr ? `आकार: ${activeImage.sizeMb} MB (कमाल 10 MB मान्य)` : `Size: ${activeImage.sizeMb} MB (Within 10 MB limit)`}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {isHi ? "छवि स्पष्टता एवं प्रकाश" : isMr ? "फोटो स्पष्टता व प्रकाश" : "Clarity & Lighting"}
                    </span>
                    <p className="text-xs text-emerald-400 font-bold">
                      {isHi ? "स्पष्ट एवं पर्याप्त प्रकाश" : isMr ? "स्पष्ट व चांगला प्रकाश" : "Clear & Well-Lit"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {activeImage.sharpnessScore !== undefined
                        ? `Sharpness: ${activeImage.sharpnessScore} • Luminance: ${activeImage.avgLuminance || 128}/255`
                        : "Quality checks passed"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {isHi ? "पौधा पहचान सत्यापन" : isMr ? "रोप ओळख तपासणी" : "Plant Verification"}
                    </span>
                    <p className="text-xs text-amber-300 font-bold">
                      {isHi ? "सत्यापन मॉडल अभी सक्रिय नहीं" : isMr ? "तपासणी मॉडेल सक्रिय नाही" : "Detector Under Development"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isHi ? "कोई अनुमानित पहचान नहीं की गई" : isMr ? "कोणतीही अंदाजित ओळख नाही" : "No heuristic guessing applied"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {isHi ? "रोग निदान मॉडल स्थिति" : isMr ? "रोग निदान मॉडेल स्थिती" : "Disease Diagnosis Status"}
                    </span>
                    <p className="text-xs text-amber-300 font-bold">
                      {isHi ? "मॉडल विकास के अधीन" : isMr ? "मॉडेल विकासाधीन" : "Model Under Development"}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {isHi ? "कोई कृत्रिम परिणाम नहीं दिखाया गया" : isMr ? "कोणताही बनावट निकाल नाही" : "Zero fabricated diagnosis"}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <p>
                    {isHi
                      ? "जब खेतसाथी का वास्तविक रोग पहचान मॉडल प्रशिक्षित और सत्यापित होकर उपलब्ध होगा, तब यहाँ स्वचालित रोग निदान, लक्षण विश्लेषण और सत्यापित कृषि उपचार प्रदर्शित किए जाएंगे।"
                      : isMr
                      ? "जेव्हा खेतसाथीचे प्रत्यक्ष रोग निदान मॉडेल पूर्ण प्रशिक्षित होऊन उपलब्ध होईल, तेव्हा येथे स्वयंचलित रोग निदान आणि उपाय दर्शवले जातील."
                      : "When KhetSaathi's genuine plant disease model is trained, verified, and connected, real-time pathogen classification and agricultural remedies will be rendered here."}
                  </p>
                </div>
              </motion.div>

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
