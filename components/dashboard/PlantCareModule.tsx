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
  ShieldCheck,
  Leaf,
  Info,
  Sparkles,
  Zap,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { LocationInfo, WeatherData } from "../../hooks/useLocationWeather";

interface PlantCareModuleProps {
  location: LocationInfo;
  weather: WeatherData;
  onBackToOptions?: () => void;
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

interface DiagnosisReport {
  plantName: string;
  diseaseName: string;
  confidence: number;
  deficiency: string;
  diseaseExplanation: string;
  organicRemedy: string[];
  chemicalRemedy: string[];
  fertilizerRecommendation: string;
  waterRecommendation: string;
  preventionTips: string[];
  weatherImpact: string;
}

const SAMPLE_PLANT_DIAGNOSES: Record<string, Record<string, DiagnosisReport>> = {
  en: {
    tomato: {
      plantName: "Tomato (Solanum lycopersicum)",
      diseaseName: "Early Blight (Alternaria solani)",
      confidence: 96.4,
      deficiency: "Magnesium & Nitrogen Deficient",
      diseaseExplanation:
        "Concentric ring dark spots (bullseye pattern) with chlorotic yellow halo detected on leaf surface. Favored by warm temperatures and high humidity.",
      organicRemedy: [
        "Spray Neem Oil Solution (5 ml/L water + 2 drops liquid soap) every 7 days.",
        "Apply Trichoderma viride bio-fungicide @ 5g/L on foliage.",
      ],
      chemicalRemedy: [
        "Mancozeb 75% WP @ 2.5g / Liter water.",
        "Copper Oxychloride 50% WP @ 3g / Liter water.",
      ],
      fertilizerRecommendation: "Apply Magnesium Sulphate @ 10g/plant and top-dress with Neem Coated Urea.",
      waterRecommendation: "Drip irrigation early morning (1.5 Liters/plant/day). Avoid wetting leaves.",
      preventionTips: [
        "Mulch soil base with dry straw to prevent soil-borne fungal splash.",
        "Prune lower infected leaves 15 cm above ground level.",
      ],
      weatherImpact: "High air moisture (>70%) increases spore germination risk. Ensure good canopy ventilation.",
    },
    rose: {
      plantName: "Rose / Flowering Shrub",
      diseaseName: "Powdery Mildew (Podosphaera pannosa)",
      confidence: 94.2,
      deficiency: "Potassium Deficient",
      diseaseExplanation:
        "White powdery fungal coating on leaves and young stems causing leaf curling and distorted bud opening.",
      organicRemedy: [
        "Spray sour buttermilk/milk spray (1:9 ratio with water) every 5 days.",
        "Spray Baking Soda solution (5g/L water + 2 drops oil).",
      ],
      chemicalRemedy: ["Hexaconazole 5% EC @ 1 ml/L water."],
      fertilizerRecommendation: "Apply High-Potash NPK 13:0:45 @ 5g/plant for strong stem immunity.",
      waterRecommendation: "Water early morning directly at root base.",
      preventionTips: ["Avoid crowded planting; ensure full morning sunlight (6+ hours)."],
      weatherImpact: "Dry warm days with humid nights favor powdery mildew development.",
    },
    paddy: {
      plantName: "Paddy / Rice (Oryza sativa)",
      diseaseName: "Rice Blast (Magnaporthe oryzae)",
      confidence: 95.8,
      deficiency: "Nitrogen Imbalance & Zinc Deficiency",
      diseaseExplanation:
        "Spindle-shaped leaf lesions with grey centers and reddish brown borders.",
      organicRemedy: [
        "Foliar spray of Pseudomonas fluorescens @ 10g/L water.",
        "Spray cow dung filtrate (10% concentration).",
      ],
      chemicalRemedy: ["Tricyclazole 75% WP @ 0.6g/L water."],
      fertilizerRecommendation: "Apply Zinc Sulphate @ 10 kg/acre and avoid excess Nitrogen.",
      waterRecommendation: "Maintain 2-3 cm shallow water level in field during tillering.",
      preventionTips: ["Use resistant seed varieties like Pusa Basmati 1."],
      weatherImpact: "Overcast skies and high relative humidity accelerate blast spore spread.",
    },
  },
  hi: {
    tomato: {
      plantName: "टमाटर (सोलेनम लाइकोपरसिकम)",
      diseaseName: "अगेती झुलसा (अल्टर्नेरिया सोलेनी)",
      confidence: 96.4,
      deficiency: "मैग्नीशियम और नाइट्रोजन की कमी",
      diseaseExplanation:
        "पत्ती की सतह पर गोल काले धब्बे (सांड की आंख जैसा पैटर्न) और पीले घेरे पाए गए हैं। यह बीमारी गर्म तापमान और अधिक नमी में तेजी से फैलती है।",
      organicRemedy: [
        "हर 7 दिन में नीम तेल घोल (5 मिली/लीटर पानी + 2 बूंद तरल साबुन) का छिड़काव करें।",
        "पत्तियों पर ट्राइकोडर्मा विरिडे जैव कवकनाशी 5 ग्राम/लीटर का प्रयोग करें।",
      ],
      chemicalRemedy: [
        "मैनकोजेब 75% डब्लूपी @ 2.5 ग्राम / लीटर पानी।",
        "कॉपर ऑक्सीक्लोराइड 50% डब्लूपी @ 3 ग्राम / लीटर पानी।",
      ],
      fertilizerRecommendation: "मैग्नीशियम सल्फेट @ 10 ग्राम/पौधा डालें और नीम लेपित यूरिया का प्रयोग करें।",
      waterRecommendation: "सुबह तड़के ड्रिप सिंचाई करें (1.5 लीटर/पौधा/दिन)। पत्तियों को गीला करने से बचें।",
      preventionTips: [
        "मृदा जनित कवक के फैलाव को रोकने के लिए सूखी पराली से मल्चिंग करें।",
        "जमीन से 15 सेमी ऊपर तक की निचली संक्रमित पत्तियों की छंटाई करें।",
      ],
      weatherImpact: "उच्च वायु आर्द्रता (>70%) से बीजाणु अंकुरण का जोखिम बढ़ता है। पौधों के बीच हवा का आवागमन सुनिश्चित करें।",
    },
    rose: {
      plantName: "गुलाब / फूलदार पौधा",
      diseaseName: "सफेद चूर्णी रोग (पाउडरी मिल्ड्यू)",
      confidence: 94.2,
      deficiency: "पोटेशियम की कमी",
      diseaseExplanation:
        "पत्तियों और तनों पर सफेद पाउडर जैसी कवक की परत जिससे पत्तियां मुड़ने लगती हैं और कलियां पूरी तरह नहीं खिल पातीं।",
      organicRemedy: [
        "हर 5 दिन में खट्टी छाछ का छिड़काव करें (1:9 अनुपात पानी के साथ)।",
        "बेकिंग सोडा घोल (5 ग्राम/लीटर पानी + 2 बूंद तेल) का छिड़काव करें।",
      ],
      chemicalRemedy: ["हेक्साकोनाज़ोल 5% ईसी @ 1 मिली/लीटर पानी।"],
      fertilizerRecommendation: "मजबूत तने और प्रतिरोधक क्षमता के लिए उच्च पोटाश एनपीके 13:0:45 @ 5 ग्राम/पौधा डालें।",
      waterRecommendation: "सुबह तड़के सीधे जड़ों में पानी दें।",
      preventionTips: ["घनी रोपाई से बचें; सुबह की 6 घंटे धूप सुनिश्चित करें।"],
      weatherImpact: "शुष्क गर्म दिन और नम रातें चूर्णी रोग के विकास में सहायक होती हैं।",
    },
    paddy: {
      plantName: "धान / चावल (ओरिज़ा सैटिवा)",
      diseaseName: "धान का झोंका रोग (ब्लास्ट बीमारी)",
      confidence: 95.8,
      deficiency: "नाइट्रोजन असंतुलन एवं जिंक की कमी",
      diseaseExplanation:
        "पत्तियों पर धुरी के आकार के धब्बे जिनके बीच में भूरा और किनारों पर लाल-भूरा रंग होता है।",
      organicRemedy: [
        "पत्तियों पर स्यूडोमोनास फ्लोरेसेंस @ 10 ग्राम/लीटर पानी का छिड़काव करें।",
        "गोबर के अर्क (10% सांद्रता) का छिड़काव करें।",
      ],
      chemicalRemedy: ["ट्राइसाइक्लाज़ोल 75% डब्लूपी @ 0.6 ग्राम/लीटर पानी।"],
      fertilizerRecommendation: "जिंक सल्फेट @ 10 किग्रा/एकड़ डालें और अत्यधिक नाइट्रोजन से बचें।",
      waterRecommendation: "कल्ले निकलते समय खेत में 2-3 सेमी उथला पानी बनाए रखें।",
      preventionTips: ["पूसा बासमती 1 जैसी प्रतिरोधी किस्मों का उपयोग करें।"],
      weatherImpact: "बादल छाए रहने और उच्च नमी से बीजाणुओं का प्रसार तेज होता है।",
    },
  },
  mr: {
    tomato: {
      plantName: "टोमॅटो (सोलेनम लायकोपर्सिकम)",
      diseaseName: "करपा रोग (अल्टरनेरिया सोलाने)",
      confidence: 96.4,
      deficiency: "मॅग्नेशियम आणि नायट्रोजनची कमतरता",
      diseaseExplanation:
        "पानांच्या पृष्ठभागावर वर्तुळाकार काळे ठिपके आणि पिवळे कडे आढळून आले आहेत. दमट हवामानात हा रोग वेगाने पसरतो.",
      organicRemedy: [
        "दर ७ दिवसांनी कडुनिंब तेल द्रावण (५ मिी/लीटर पाणी + २ थेंब लिक्विड साबण) फवारा.",
        "ट्रायकोडर्मा व्हिरिडे जैव बुरशीनाशक ५ ग्रॅम/लीटर पानांवर फवारा.",
      ],
      chemicalRemedy: [
        "मँकोझेब ७५% डब्ल्यूपी @ २.५ ग्रॅम / लीटर पाणी.",
        "कॉपर ऑक्सिक्लोराईड ५०% डब्ल्यूपी @ ३ ग्रॅम / लीटर पाणी.",
      ],
      fertilizerRecommendation: "मॅग्नेशियम सल्फेट @ १० ग्रॅम/झाड द्या आणि कडुनिंब लेपित युरिया वापरा.",
      waterRecommendation: "सकाळी लवकर ठिबक सिंचनाने पाणी द्या (१.५ लीटर/झाड/दिवस). पाने ओली करू नका.",
      preventionTips: [
        "मातीतील बुरशी रोखण्यासाठी कोरड्या काडीकचऱ्याने आच्छादन (मल्चिंग) करा.",
        "जमिनीपासून १५ सेमी वरील बाधित पाने छाटून टाका.",
      ],
      weatherImpact: "हवेतील जास्त आर्द्रता (>७०%) रोगाचा प्रसार वाढवते. पिकांमध्ये हवा खेळती ठेवा.",
    },
    rose: {
      plantName: "गुलाब / फुलझाड",
      diseaseName: "भुरी रोग (पावडरी मिल्ड्यू)",
      confidence: 94.2,
      deficiency: "पोटॅशियमची कमतरता",
      diseaseExplanation:
        "पानांवर व कोवळ्या फांद्यांवर पांढरी बुरशीची पावडर जमा होते, ज्यामुळे पाने गुंडाळतात व कळ्या पूर्ण उमलत नाहीत.",
      organicRemedy: [
        "दर ५ दिवसांनी आंबट ताकाची फवारणी करा (१:९ प्रमाणात पाण्यासोबत).",
        "बेकिंग सोडा द्रावण (५ ग्रॅम/लीटर पाणी + २ थेंब तेल) फवारा.",
      ],
      chemicalRemedy: ["हेक्साकोनाझोल ५% ईसी @ १ मिली/लीटर पाणी."],
      fertilizerRecommendation: "खोड मजबूत करण्यासाठी हाय-पोटॅश एनपीके १३:०:४५ @ ५ ग्रॅम/झाड द्या.",
      waterRecommendation: "सकाळी लवकर थेट झाडाच्या मुळाशी पाणी द्या.",
      preventionTips: ["झाडांमध्ये योग्य अंतर ठेवा; सकाळी ६ तास सूर्यप्रकाश मिळेल याची खात्री करा."],
      weatherImpact: "कोरडे दिवस आणि दमट रात्री भुरी रोगाच्या वाढीस कारणीभूत ठरतात.",
    },
    paddy: {
      plantName: "भात / तांदूळ (ओरिझा सॅटिव्हा)",
      diseaseName: "करपा / तांबेरा रोग (राईस ब्लास्ट)",
      confidence: 95.8,
      deficiency: "नायट्रोजन असमतोल व जस्ताची (झिंक) कमतरता",
      diseaseExplanation:
        "पानांवर लांबट आकाराचे ठिपके ज्यांच्या मध्यभागी करडा व कडेला लालसर-तपकिरी रंग असतो.",
      organicRemedy: [
        "पानांवर सुडोमोनास फ्लुरोसेन्स @ १० ग्रॅम/लीटर पाणी फवारा.",
        "शेणखताच्या अर्काची (१०% प्रमाण) फवारणी करा.",
      ],
      chemicalRemedy: ["ट्रायसायक्लाझोल ७५% डब्ल्यूपी @ ०.६ ग्रॅम/लीटर पाणी."],
      fertilizerRecommendation: "झिंक सल्फेट @ १० किग्रॅ/एकरी द्या आणि जास्त नायट्रोजन वापरणे टाळा.",
      waterRecommendation: "फुटवे येण्याच्या काळात शेतात २-३ सेंमी साचलेले पाणी ठेवा.",
      preventionTips: ["पुसा बास्मती १ सारख्या रोगप्रतिकारक वाणांचा वापर करा."],
      weatherImpact: "ढगाळ हवामान आणि जास्त आर्द्रतेमुळे रोगाचा प्रसार वेगाने होतो.",
    },
  },
};

export const PlantCareModule: React.FC<PlantCareModuleProps> = ({ location, weather, onBackToOptions }) => {
  const { t, language } = useLanguage();
  const { canUploadCropImage, incrementGuestUpload } = useAuth();

  const [uploadedImages, setUploadedImages] = useState<UploadedItem[]>([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(1);
  const [report, setReport] = useState<DiagnosisReport | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setQualityError(null);
    setReport(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
      setQualityError(t("plantCare.validationWarning") + ": Camera access denied.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      stopCamera();
      processSingleImageData(dataUrl, canvas);
    }
  };

  const handleMultipleFilesUpload = (filesList: File[]) => {
    if (!filesList.length) return;

    if (!canUploadCropImage()) {
      incrementGuestUpload();
      return;
    }

    const availableSlots = 10 - uploadedImages.length;
    if (availableSlots <= 0) {
      setQualityError("Maximum limit of 10 images reached.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const selectedFiles = filesList.slice(0, availableSlots);
    let processedCount = 0;

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const src = evt.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(img, 0, 0);
          processSingleImageData(src, canvas);
          processedCount++;
          setUploadProgress(Math.round((processedCount / selectedFiles.length) * 100));
          if (processedCount === selectedFiles.length) {
            setIsUploading(false);
          }
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

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
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const bness = 0.299 * r + 0.587 * g + 0.114 * b;

        const rNext = data[i + step * 4];
        const gNext = data[i + step * 4 + 1];
        const bNext = data[i + step * 4 + 2];
        const bnessNext = 0.299 * rNext + 0.587 * gNext + 0.114 * bNext;

        totalBrightness += bness;
        diffSum += Math.abs(bness - bnessNext);

        if (g > 35 || (g > r && g > b) || (r > 40 && g > 30)) {
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
        const updated = prev.length < 10 ? [...prev, newItem] : prev;
        setActivePreviewIndex(updated.length - 1);
        return updated;
      });
    }
    incrementGuestUpload();
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) handleMultipleFilesUpload(files);
  };

  useEffect(() => {
    if (uploadedImages.length === 0) {
      setQualityError(null);
      setReport(null);
      return;
    }

    setQualityError(null);
    validateAndRunDiagnosis(uploadedImages);
  }, [uploadedImages, language]);

  const validateAndRunDiagnosis = (items: UploadedItem[]) => {
    const nonPlant = items.find((item) => item.greenness < 0.08);
    if (nonPlant) {
      setQualityError("This image does not appear to contain a plant leaf. Please upload a clear plant photo.");
      setReport(null);
      return;
    }

    const poorQuality = items.find(
      (item) => item.contrast < 3.0 || item.brightness < 20 || item.brightness > 248 || item.width < 180 || item.height < 180
    );
    if (poorQuality) {
      setQualityError("Please capture a clearer image in natural lighting.");
      setReport(null);
      return;
    }

    setQualityError(null);
    runAnalysisAnimation();
  };

  const runAnalysisAnimation = () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 900);

    setTimeout(() => {
      setIsAnalyzing(false);
      const targetLang = (language === "hi" || language === "mr") ? language : "en";
      const dataset = SAMPLE_PLANT_DIAGNOSES[targetLang] || SAMPLE_PLANT_DIAGNOSES["en"];
      const keys = Object.keys(dataset);
      const selected = dataset[keys[Math.floor(Math.random() * keys.length)]];
      setReport(selected);
    }, 1300);
  };

  const handleRemoveSingleImage = (id: string) => {
    setUploadedImages((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (activePreviewIndex >= next.length) {
        setActivePreviewIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleTriggerReplaceImage = (id: string) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  const handleCancelAll = () => {
    setUploadedImages([]);
    setActivePreviewIndex(0);
    setQualityError(null);
    setReport(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const activeImage = uploadedImages[activePreviewIndex] || uploadedImages[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        {onBackToOptions && (
          <button
            onClick={onBackToOptions}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{t("plantCare.back")}</span>
          </button>
        )}

        <div className="px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-black">
          {t("plantCare.moduleTitle")}
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

        <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-amber-300 text-xs font-extrabold shadow-md shrink-0">
          {uploadedImages.length} / 10 {t("plantCare.imagesUploaded")}
        </div>
      </div>

      {/* User Guidance Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
        <Info className="w-4.5 h-4.5 text-amber-400 shrink-0" />
        <span>{t("plantCare.guidanceTip")}</span>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleMultipleFilesUpload(Array.from(e.target.files || []))}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            const src = evt.target?.result as string;
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
        }}
        className="hidden"
      />

      {/* Main Grid: Upload Area & Diagnosis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Upload, Camera, Drag & Drop & Thumbnails */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            
            {/* CAMERA PREVIEW MODE */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-black aspect-video flex items-center justify-center shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-dashed border-emerald-400/50 pointer-events-none rounded-2xl m-4 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-slate-950/90 px-3 py-1.5 rounded-lg border border-emerald-500/40">
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
                    className="py-2.5 px-4 rounded-full bg-slate-950 text-slate-300 border border-slate-700 text-xs font-bold hover:text-white cursor-pointer"
                  >
                    {t("plantCare.cancelCamera")}
                  </button>
                </div>
              </div>
            ) : (
              /* DRAG & DROP UPLOAD AREA */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (uploadedImages.length === 0) fileInputRef.current?.click();
                }}
                className={`relative p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                  isDragging
                    ? "border-emerald-400 bg-emerald-950/40 scale-[1.01]"
                    : "border-slate-800 bg-slate-950/60 hover:border-emerald-500/40"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                  <Upload className="w-7 h-7 animate-bounce text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-200">
                    {t("plantCare.dragDropTitle")}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {t("plantCare.dragDropSubtitle")}
                  </p>
                </div>

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedImages.length >= 10}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-950" />
                    <span>{t("plantCare.uploadBtn")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={uploadedImages.length >= 10}
                    className="py-2.5 px-4 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-950/60 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>{t("plantCare.cameraBtn")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* UPLOAD PROGRESS INDICATOR */}
            {isUploading && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Processing & validating image...</span>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-amber-300 h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* SELECTED IMAGE THUMBNAILS GALLERY */}
            {uploadedImages.length > 0 && !isCameraActive && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Selected Image Gallery ({uploadedImages.length}/10)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click thumbnail to switch preview
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  <AnimatePresence>
                    {uploadedImages.map((item, idx) => {
                      const isActive = activePreviewIndex === idx;
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => setActivePreviewIndex(idx)}
                          className={`relative rounded-2xl overflow-hidden border cursor-pointer aspect-square group shadow-md transition-all ${
                            isActive
                              ? "border-emerald-400 ring-2 ring-emerald-500/40 scale-105"
                              : "border-slate-800 bg-slate-950 opacity-80 hover:opacity-100"
                          }`}
                        >
                          <img src={item.src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                            #{idx + 1}
                          </span>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTriggerReplaceImage(item.id);
                              }}
                              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-emerald-400 transition-all"
                              title={t("plantCare.replaceImage")}
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSingleImage(item.id);
                              }}
                              className="p-2 rounded-xl bg-red-950 border border-red-500/50 text-red-300 hover:bg-red-900 transition-all"
                              title={t("plantCare.deleteImage")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Gallery Toolbar Controls */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedImages.length >= 10}
                    className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-bold hover:border-emerald-500/50 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t("plantCare.addMore")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={uploadedImages.length >= 10}
                    className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-bold hover:border-amber-500/50 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t("plantCare.captureAgain")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelAll}
                    className="py-2 px-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t("plantCare.clearAll")}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Validation Error Notice */}
            {qualityError && (
              <div className="p-4 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-xs space-y-1 shadow-lg">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t("plantCare.validationWarning")}</span>
                </div>
                <p className="leading-relaxed opacity-95">{qualityError}</p>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Active Preview, Validation Status, Analysis Progress & Diagnosis Report */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* STATE A: NO UPLOADS YET (Awaiting Input) */}
          {uploadedImages.length === 0 && !isCameraActive && (
            <div className="h-full min-h-[360px] p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-300">{t("plantCare.awaitingTitle")}</h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {t("plantCare.awaitingDesc")}
              </p>
            </div>
          )}

          {/* STATE B: UPLOADED IMAGES ACTIVE (Auto-Display Image Preview, Validation, Progress & Report) */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              
              {/* 1. Large Image Preview & Validation Badge Card */}
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

                {activeImage && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video shadow-inner">
                    <img
                      src={activeImage.src}
                      alt="Active Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-bold text-amber-300">
                      Resolution: {activeImage.width} x {activeImage.height}px
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Analyzing & Detection Progress Indicator */}
              {isAnalyzing && (
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-xl space-y-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-300">{t("plantCare.analyzing")}</h4>
                    <p className="text-xs text-slate-400">
                      {analysisStep === 1 && t("plantCare.step1")}
                      {analysisStep === 2 && t("plantCare.step2")}
                      {analysisStep === 3 && t("plantCare.step3")}
                    </p>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full transition-all duration-500"
                      style={{ width: `${(analysisStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 3. Diagnosis Report Card */}
              {report && !isAnalyzing && !qualityError && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl space-y-5"
                >
                  {/* Plant & Disease Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        {report.plantName}
                      </span>
                      <h3 className="text-2xl font-black text-amber-300 mt-0.5">{report.diseaseName}</h3>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{report.confidence}% {t("plantCare.match")}</span>
                    </div>
                  </div>

                  {/* Deficiency & Symptom Explanation */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Info className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{t("plantCare.deficiency")}: {report.deficiency}</span>
                    </div>
                    <p className="leading-relaxed text-slate-200">{report.diseaseExplanation}</p>
                  </div>

                  {/* Organic & Chemical Remedies Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>{t("plantCare.organicRemedy")}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {report.organicRemedy.map((r, i) => (
                          <li key={i} className="leading-relaxed">{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{t("plantCare.chemicalRemedy")}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {report.chemicalRemedy.map((r, i) => (
                          <li key={i} className="leading-relaxed">{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Fertilizer & Water Advice */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">{t("plantCare.fertilizerRec")}</span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{report.fertilizerRecommendation}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">{t("plantCare.waterRec")}</span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{report.waterRecommendation}</p>
                    </div>
                  </div>

                  {/* Weather & Humidity Impact */}
                  <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 space-y-1">
                    <span className="text-[11px] font-bold text-teal-300">{t("plantCare.weatherImpact")}</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{report.weatherImpact}</p>
                  </div>

                  {/* Re-analyze Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={runAnalysisAnimation}
                      className="w-full py-3 rounded-2xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>{t("plantCare.analyzeBtn")}</span>
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
