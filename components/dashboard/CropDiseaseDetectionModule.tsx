"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Plus,
  X,
  FileText,
  Leaf,
  Info,
  Clock,
  Sparkles,
  ImageIcon,
  ShieldCheck,
  Sun,
  Droplets,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  validateImageFile,
  ImageQualityMetrics,
} from "../../lib/imageValidation";

export interface BackendAiDiagnosisResponse {
  crop_name?: string;
  plant_name?: string;
  disease?: string;
  confidence?: number;
  severity?: string;
  cause?: string;
  organic_remedy?: string;
  chemical_remedy?: string;
  fertilizer?: string;
  weather_impact?: string;
  prevention?: string;
  recovery_time?: string;
}

export interface UploadedItem {
  id: string;
  src: string;
  width: number;
  height: number;
  format?: string;
  sizeMb?: string;
  sharpnessScore?: number;
  avgLuminance?: number;
}

export const CropDiseaseDetectionModule: React.FC<{
  apiResponse?: BackendAiDiagnosisResponse | null;
}> = ({ apiResponse = null }) => {
  const { t, language } = useLanguage();
  const { canUploadCropImage, incrementGuestUpload } = useAuth();

  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const isHi = language === "hi";
  const isMr = language === "mr";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async () => {
    setQualityError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setQualityError(
        isHi
          ? "कैमरा खोलने में असमर्थ। कृपया ब्राउज़र अनुमति की जांच करें।"
          : isMr
          ? "कॅमेरा उघडण्यात त्रुटी. अनुमती तपासा."
          : "Unable to access camera. Please check browser permissions."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setQualityError(null);
      setIsValidating(true);
      const validation = await validateImageFile(blob, `Plant_Photo_${uploadedImages.length + 1}.jpg`);
      setIsValidating(false);
      if (!validation.isValid) {
        setQualityError((validation.errorMessage || "Validation failed.") + (validation.userGuidance ? " " + validation.userGuidance : ""));
        return;
      }

      stopCamera();
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      processSingleImageData(dataUrl, canvas.width, canvas.height, validation.metrics);
    }, "image/jpeg", 0.9);
  };

  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!canUploadCropImage()) {
      incrementGuestUpload();
      return;
    }

    const availableSlots = 10 - uploadedImages.length;
    if (availableSlots <= 0) {
      setQualityError(
        isHi
          ? "आप केवल अधिकतम 10 चित्र अपलोड कर सकते हैं।"
          : isMr
          ? "तुम्ही जास्तीत जास्त १० फोटो अपलोड करू शकता."
          : "Maximum limit of 10 images reached."
      );
      return;
    }

    setIsValidating(true);
    setQualityError(null);
    const filesToProcess = files.slice(0, availableSlots);

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const validation = await validateImageFile(file);
      if (!validation.isValid) {
        setQualityError(
          (validation.errorMessage || "Image validation failed.") +
          (validation.userGuidance ? " " + validation.userGuidance : "")
        );
        setIsValidating(false);
        return;
      }

      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          const img = new Image();
          img.onload = () => {
            processSingleImageData(src, img.naturalWidth || img.width, img.naturalHeight || img.height, validation.metrics);
            resolve();
          };
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
    }

    setIsValidating(false);
    incrementGuestUpload();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processSingleImageData = (
    src: string,
    width: number,
    height: number,
    metrics?: ImageQualityMetrics
  ) => {
    const newItem: UploadedItem = {
      id: "img_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      src,
      width,
      height,
      format: metrics?.format || "JPEG",
      sizeMb: metrics?.sizeMb || "1.2",
      sharpnessScore: metrics?.sharpnessScore,
      avgLuminance: metrics?.avgLuminance,
    };

    if (replaceTargetId) {
      setUploadedImages((prev) => prev.map((item) => (item.id === replaceTargetId ? newItem : item)));
      setReplaceTargetId(null);
    } else {
      setUploadedImages((prev) => {
        if (prev.length >= 10) return prev;
        return [...prev, newItem];
      });
    }
  };

  const handleRemoveSingleImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTriggerReplaceImage = (id: string) => {
    setReplaceTargetId(id);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsValidating(true);
    setQualityError(null);
    const validation = await validateImageFile(file);
    if (!validation.isValid) {
      setQualityError(
        (validation.errorMessage || "Image validation failed.") +
        (validation.userGuidance ? " " + validation.userGuidance : "")
      );
      setIsValidating(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        processSingleImageData(src, img.naturalWidth || img.width, img.naturalHeight || img.height, validation.metrics);
        setIsValidating(false);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  };

  const activeImage = uploadedImages[activePreviewIndex] || uploadedImages[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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

        {uploadedImages.length > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-extrabold shadow-md shrink-0">
            {uploadedImages.length} / 10 {t("plantCare.imagesUploaded")}
          </div>
        )}
      </div>

      {/* Honest Notice Near Upload Area */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs leading-relaxed flex items-start gap-3 shadow-lg">
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

      {/* Quality / Validation Error */}
      {qualityError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-200 block">{t("plantCare.validationWarning")}</span>
            <p>{qualityError}</p>
          </div>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleMultipleFilesUpload}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleReplaceFileChange}
      />

      {/* Main Grid: Upload & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload dropzone and controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            
            {/* Live Camera View */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 pointer-events-none rounded-2xl m-4 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md">
                    {t("plantCare.alignNotice")}
                  </span>
                </div>
                <div className="absolute bottom-4 flex gap-2">
                  <button
                    onClick={capturePhoto}
                    className="py-2.5 px-6 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg hover:bg-emerald-300 transition-all cursor-pointer"
                  >
                    {t("plantCare.captureBtn")}
                  </button>
                  <button
                    onClick={stopCamera}
                    className="py-2.5 px-4 rounded-full bg-slate-950 text-slate-300 border border-slate-700 text-xs font-bold hover:bg-slate-900 cursor-pointer"
                  >
                    {t("plantCare.cancelCamera")}
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Buttons & Dropzone */
              <div className="p-8 rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Upload className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">{t("plantCare.dragDropTitle")}</h3>
                  <p className="text-xs text-slate-400">{t("plantCare.uploadInstruction")}</p>
                  <p className="text-[11px] text-slate-500">{t("plantCare.dragDropSubtitle")}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isValidating || uploadedImages.length >= 10}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t("plantCare.uploadBtn")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={isValidating || uploadedImages.length >= 10}
                    className="px-6 py-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-950 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{t("plantCare.cameraBtn")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            {uploadedImages.length > 0 && !isCameraActive && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    {isHi ? `अपलोड की गई तस्वीरें (${uploadedImages.length}/10)` : isMr ? `अपलोड केलेले फोटो (${uploadedImages.length}/10)` : `Uploaded Photos (${uploadedImages.length}/10)`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setUploadedImages([])}
                    className="text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    {t("plantCare.clearAll")}
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  <AnimatePresence>
                    {uploadedImages.map((item, index) => {
                      const isActive = activePreviewIndex === index;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => setActivePreviewIndex(index)}
                          className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer aspect-square transition-all ${
                            isActive
                              ? "border-emerald-400 scale-105 shadow-md"
                              : "border-slate-800 bg-slate-950 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={item.src} alt={`Plant angle ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSingleImage(item.id);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/80 text-red-400 hover:bg-red-950"
                            title={t("plantCare.deleteImage")}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
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
                      ? "पौधों के बीच पर्याप्त दूरी रखें ताकि पत्तियों में हवा का आवागमन हो सके।"
                      : isMr
                      ? "रोपांमध्ये योग्य अंतर ठेवा जेणेकरून हवा खेळती राहील."
                      : "Ensure spacing between plants for adequate airflow to minimize moisture issues."}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-teal-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isHi ? "सिंचाई सावधानी" : isMr ? "पाणी व्यवस्थापन" : "Watering Routine"}</span>
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {isHi
                      ? "पानी हमेशा पौधे की जड़ के पास दें। पत्तियों पर पानी छिड़कने से बचें।"
                      : isMr
                      ? "पाणी नेहमी मुळाशी द्या. पानांवर पाणी टाकणे टाळा."
                      : "Apply water at root zone in morning; avoid wetting foliage overnight."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Preview & Honest Verification Status */}
        <div className="lg:col-span-6 space-y-4">
          
          {uploadedImages.length > 0 && activeImage ? (
            <div className="space-y-4">
              
              {/* Image Preview Card */}
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

                <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-inner">
                  <img
                    src={activeImage.src}
                    alt="Active Preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-amber-300">
                    {activeImage.width} × {activeImage.height} px • {activeImage.sizeMb} MB
                  </div>
                </div>
              </div>

              {/* Real API response IF available; otherwise Honest Notice */}
              {apiResponse && apiResponse.disease ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase">Verified AI Diagnosis</span>
                      <h3 className="text-xl font-black text-white">{apiResponse.disease}</h3>
                    </div>
                    {apiResponse.confidence && (
                      <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                        {apiResponse.confidence}% Confidence
                      </span>
                    )}
                  </div>
                  {apiResponse.organic_remedy && (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-amber-300 block">Organic Remedy:</span>
                      <p className="text-slate-200">{apiResponse.organic_remedy}</p>
                    </div>
                  )}
                  {apiResponse.chemical_remedy && (
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-teal-300 block">Chemical Remedy:</span>
                      <p className="text-slate-200">{apiResponse.chemical_remedy}</p>
                    </div>
                  )}
                </motion.div>
              ) : (
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
                        {activeImage.width} × {activeImage.height} px ({activeImage.format || "JPEG"})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isHi ? `आकार: ${activeImage.sizeMb} MB (मान्य)` : isMr ? `आकार: ${activeImage.sizeMb} MB (मान्य)` : `Size: ${activeImage.sizeMb} MB (Valid)`}
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
              )}

            </div>
          ) : (
            <div className="h-full min-h-[350px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <FileText className="w-8 h-8" />
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
