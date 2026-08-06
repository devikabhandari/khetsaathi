"use client";

import React, { useState, useRef, useEffect } from "react";
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
  ShieldAlert,
  Leaf,
  Bug,
  Info,
  Clock,
  Sparkles,
  Cpu,
  Layers,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

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
  contrast: number;
  brightness: number;
  greenness: number;
}

export const CropDiseaseDetectionModule: React.FC<{
  apiResponse?: BackendAiDiagnosisResponse | null;
}> = ({ apiResponse = null }) => {
  const { t } = useLanguage();
  const { canUploadCropImage, incrementGuestUpload } = useAuth();

  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setQualityError(null);
    setIsValidated(false);
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
      setQualityError("Could not access camera. Please check browser permissions or upload images from gallery.");
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

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    stopCamera();
    processSingleImageData(dataUrl, canvas);
  };

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!canUploadCropImage()) {
      incrementGuestUpload();
      return;
    }

    const availableSlots = 10 - uploadedImages.length;
    if (availableSlots <= 0) {
      setQualityError("Maximum limit of 10 images reached. Remove an image to add a new one.");
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(img, 0, 0);
          processSingleImageData(src, canvas);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Processing & Feature Extraction
  const processSingleImageData = (src: string, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    let totalBrightness = 0;
    let diffSum = 0;
    let greenCount = 0;
    const step = 8;
    let count = 0;

    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length - step * 4; i += step * 4) {
        const r1 = data[i];
        const g1 = data[i + 1];
        const b1 = data[i + 2];
        const bness1 = 0.299 * r1 + 0.587 * g1 + 0.114 * b1;

        const r2 = data[i + step * 4];
        const g2 = data[i + step * 4 + 1];
        const b2 = data[i + step * 4 + 2];
        const bness2 = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;

        totalBrightness += bness1;
        diffSum += Math.abs(bness1 - bness2);

        // Foliar plant hue check
        if (g1 > 35 || (g1 > r1 && g1 > b1) || (r1 > 40 && g1 > 30)) {
          greenCount++;
        }
        count++;
      }
    }

    const newItem: UploadedItem = {
      id: "img_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      src,
      width: canvas.width,
      height: canvas.height,
      contrast: diffSum / (count || 1),
      brightness: totalBrightness / (count || 1),
      greenness: greenCount / (count || 1),
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

    incrementGuestUpload();
  };

  // Trigger Multi-Point Image Validation
  useEffect(() => {
    if (uploadedImages.length === 0) {
      setQualityError(null);
      setIsValidated(false);
      return;
    }

    setIsValidating(true);
    setQualityError(null);
    setIsValidated(false);

    const timer = setTimeout(() => {
      validateAllImages(uploadedImages);
      setIsValidating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [uploadedImages]);

  // Strict Validation Rules Engine
  const validateAllImages = (items: UploadedItem[]) => {
    // 1. Check for non-crop / non-plant image (Low foliage/plant color ratio)
    const nonPlantItem = items.find((item) => item.greenness < 0.08);
    if (nonPlantItem) {
      setQualityError("This image does not appear to contain a crop or plant. Please upload clear images of the affected crop.");
      return;
    }

    // 2. Check for blurry / poor lighting / resolution issues
    const invalidQualityItem = items.find(
      (item) => item.contrast < 3.2 || item.brightness < 20 || item.brightness > 248 || item.width < 180 || item.height < 180
    );
    if (invalidQualityItem) {
      setQualityError("Image quality is too low for accurate analysis. Please capture clearer images in natural daylight.");
      return;
    }

    // 3. Check for multiple plants mismatch (comparing variance in greenness & contrast profiles)
    if (items.length > 1) {
      const avgGreenness = items.reduce((acc, it) => acc + it.greenness, 0) / items.length;
      const mismatch = items.find((it) => Math.abs(it.greenness - avgGreenness) > 0.45);
      if (mismatch) {
        setQualityError("Please upload images of only one crop or plant at a time.");
        return;
      }
    }

    setQualityError(null);
    setIsValidated(true);
  };

  // Gallery Controls
  const handleRemoveSingleImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleTriggerReplaceImage = (id: string) => {
    setReplaceTargetId(id);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(img, 0, 0);
        processSingleImageData(src, canvas);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleCancelAllUploads = () => {
    setUploadedImages([]);
    setQualityError(null);
    setIsValidated(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-inner">
            <Bug className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🌿 Crop Health Scanner</span>
              <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Multi-Image (1-10)
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Upload between 1 and 10 clear images of the same plant from different angles for multi-layer validation.
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-lg">
            <span>{uploadedImages.length} / 10 Images Uploaded</span>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
            <Cpu className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Model Standby</span>
          </div>
        </div>
      </div>

      {/* User Guidance Note */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Agronomy Tip:</strong> For better accuracy, upload multiple clear images of the same plant from different angles (leaf, stem, fruit, or affected area).
        </span>
      </div>

      {/* Grid: Upload & Responsive Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            
            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleFilesUpload}
              className="hidden"
            />

            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              onChange={handleReplaceFileChange}
              className="hidden"
            />

            {/* Initial Buttons (when 0 images uploaded) */}
            {uploadedImages.length === 0 && !isCameraActive && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-4 px-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-950/60 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Upload className="w-4.5 h-4.5 text-emerald-400" />
                  <span>🖼 Upload Images (1-10)</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="py-4 px-4 rounded-2xl bg-slate-950 border border-amber-500/40 text-xs font-bold text-amber-300 hover:bg-amber-950/60 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Camera className="w-4.5 h-4.5 text-amber-400" />
                  <span>📷 Open Camera</span>
                </button>
              </div>
            )}

            {/* Live Camera View */}
            {isCameraActive && (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-dashed border-emerald-400/40 pointer-events-none rounded-2xl m-4 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-md">
                    Position Affected Plant Area in Frame
                  </span>
                </div>
                <div className="absolute bottom-4 flex gap-2">
                  <button
                    onClick={capturePhoto}
                    className="py-2.5 px-6 rounded-full bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg hover:bg-emerald-300 transition-all cursor-pointer"
                  >
                    📸 Capture Snapshot
                  </button>
                  <button
                    onClick={stopCamera}
                    className="py-2.5 px-4 rounded-full bg-slate-950 text-slate-300 border border-slate-700 text-xs font-bold hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Responsive Gallery Grid of Selected Images */}
            {uploadedImages.length > 0 && !isCameraActive && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {uploadedImages.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-square group shadow-md"
                      >
                        <img
                          src={item.src}
                          alt={`Plant angle ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                          #{index + 1}
                        </span>

                        {/* Thumbnail Action Overlay */}
                        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerReplaceImage(item.id)}
                            title="Replace Image"
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-emerald-400 hover:border-emerald-500 transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSingleImage(item.id)}
                            title="Delete Image"
                            className="p-2 rounded-xl bg-red-950 border border-red-500/50 text-red-300 hover:bg-red-900 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Global Action Toolbar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedImages.length >= 10}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-bold hover:border-emerald-500/50 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>➕ Add More</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={uploadedImages.length >= 10}
                    className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-bold hover:border-amber-500/50 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>📷 Capture Again</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelAllUploads}
                    className="py-2.5 px-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>❌ Cancel</span>
                  </button>
                </div>
              </div>
            )}

            {uploadedImages.length === 0 && !isCameraActive && (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center text-slate-500 space-y-3">
                <Leaf className="w-12 h-12 text-slate-600 mb-1" />
                <p className="text-sm font-bold text-slate-300">No Plant Images Uploaded</p>
                <p className="text-xs text-slate-400 max-w-xs">
                  Upload between 1 and 10 photos of the same plant (leaf, stem, fruit) to run multi-angle quality checks.
                </p>
              </div>
            )}

            {/* Validation Error Banner */}
            {qualityError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs space-y-1 shadow-lg"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Validation Check Alert</span>
                </div>
                <p className="leading-relaxed opacity-95">{qualityError}</p>
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Column: Honest AI Analysis Status & 11 API Cards */}
        <div className="lg:col-span-6">
          {uploadedImages.length > 0 && isValidated && !qualityError ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl space-y-6"
            >
              {/* Validation Status Block */}
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✅ Images validated successfully.</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>✅ Ready for AI Analysis.</span>
                </div>
                <div className="pt-2 border-t border-emerald-500/20 text-xs text-amber-300 font-semibold space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>ℹ️ AI diagnosis model is currently unavailable.</span>
                  </p>
                  <p className="text-[11px] text-slate-300 font-normal leading-relaxed">
                    Live disease prediction, confidence score, remedies and recommendations will appear here once the backend AI model is connected.
                  </p>
                </div>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Backend AI Model Schema Cards</span>
                </h3>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-amber-950 text-amber-300 border border-amber-500/40">
                  Model Not Connected
                </span>
              </div>

              {/* 11 Disabled Result Cards (Labelled "Waiting for AI Model") */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* 1. Crop Name */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Crop Name</span>
                  <p className="text-xs font-extrabold text-amber-300 italic">
                    {apiResponse?.crop_name || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 2. Plant Name */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Plant Name</span>
                  <p className="text-xs font-extrabold text-amber-300 italic">
                    {apiResponse?.plant_name || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 3. Disease */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Disease</span>
                  <p className="text-xs font-extrabold text-amber-300 italic">
                    {apiResponse?.disease || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 4. Confidence */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Confidence Score</span>
                  <p className="text-xs font-extrabold text-emerald-300 italic">
                    {apiResponse?.confidence ? `${apiResponse.confidence}%` : "Waiting for AI Model"}
                  </p>
                </div>

                {/* 5. Severity */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Severity</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.severity || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 6. Cause */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Cause</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.cause || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 7. Organic Remedy */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Organic Remedy</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.organic_remedy || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 8. Chemical Remedy */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Chemical Remedy</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.chemical_remedy || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 9. Weather Impact */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Weather Impact</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.weather_impact || "Waiting for AI Model"}
                  </p>
                </div>

                {/* 10. Fertilizer Recommendation */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                  <span className="text-[11px] font-bold text-slate-400">Fertilizer Recommendation</span>
                  <p className="text-xs font-semibold text-slate-300 italic">
                    {apiResponse?.fertilizer || "Waiting for AI Model"}
                  </p>
                </div>

              </div>

              {/* 11. Prevention Tips & Recovery Time */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 opacity-70">
                <span className="text-[11px] font-bold text-slate-400">Prevention Tips & Expected Recovery Time</span>
                <p className="text-xs font-semibold text-slate-300 italic">
                  {apiResponse?.prevention || "Waiting for AI Model"}
                </p>
              </div>

            </motion.div>
          ) : (
            <div className="h-full min-h-[350px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">Awaiting Validated Image Input</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Upload 1 to 10 photos of the same plant. Once multi-angle quality and foliage validation pass, the status will show ready for AI model execution.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
