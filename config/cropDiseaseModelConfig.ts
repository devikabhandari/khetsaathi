/**
 * Central Configuration for Plant Photo Diagnosis AI Model
 *
 * Dataset Ground Truth: PlantVillage
 * - Phase 1 Supported Crops: Tomato, Potato (Active)
 * - Phase 2 Future Crops: Maize (Corn), Bell Pepper (Capsicum) (Prepared in configuration)
 *
 * NOTE: Only crops with `isModelAvailable: true` can be selected by users for diagnosis.
 * Detection scope is limited to the specific trained dataset classes listed below.
 */

export interface DiseaseClassMapping {
  rawDatasetLabel: string; // Exact PlantVillage dataset folder/class name
  displayName: {
    en: string;
    hi: string;
    mr: string;
  };
  isHealthy: boolean;
}

export interface ModelCropConfig {
  id: string;
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  scientificName: string;
  phase: number;
  isModelAvailable: boolean; // Set to true ONLY when trained model weights and validation are completed
  statusNotice?: {
    en: string;
    hi: string;
    mr: string;
  };
  disclaimer: {
    en: string;
    hi: string;
    mr: string;
  };
  supportedClasses: DiseaseClassMapping[];
}

export const CROP_DISEASE_MODEL_CONFIG: Record<string, ModelCropConfig> = {
  tomato: {
    id: "tomato",
    name: {
      en: "Tomato (Solanum lycopersicum)",
      hi: "टमाटर (टमाटर)",
      mr: "टोमॅटो (टोमॅटो)",
    },
    scientificName: "Solanum lycopersicum",
    phase: 1,
    isModelAvailable: false, // Model classes in training/development - no real inference connected yet
    statusNotice: {
      en: "Plant disease diagnosis model is currently under development. No live inference model is connected yet.",
      hi: "पौध रोग निदान मॉडल वर्तमान में विकास के अधीन है। अभी कोई लाइव मॉडल जुड़ा नहीं है।",
      mr: "पीक रोग निदान मॉडेल सध्या विकसित केले जात आहे. अद्याप कोणतेही लाइव्ह मॉडेल जोडलेले नाही.",
    },
    disclaimer: {
      en: "Detection scope is limited strictly to the 10 trained PlantVillage classes below. Does not detect unmodeled viral strains, nutrient deficiencies, or physiological disorders outside these classes.",
      hi: "रोग पहचान केवल नीचे दी गई 10 प्रशिक्षित प्लांटविलेज श्रेणियों तक सीमित है। यह असूचीबद्ध विकारों की पहचान नहीं करता है।",
      mr: "रोग निदान केवळ खालील १० प्रशिक्षित प्लांटव्हिलेज प्रकारांपुरते मर्यादित आहे. इतर रोगांची खात्री देता येत नाही.",
    },
    supportedClasses: [
      {
        rawDatasetLabel: "Tomato___healthy",
        displayName: { en: "Healthy Tomato Leaf", hi: "स्वस्थ टमाटर पत्ती", mr: "निरोगी टोमॅटो पान" },
        isHealthy: true,
      },
      {
        rawDatasetLabel: "Tomato___Bacterial_spot",
        displayName: { en: "Bacterial Spot (Xanthomonas spp.)", hi: "जीवाणु धब्बा (बैक्टीरियल स्पॉट)", mr: "जिवाणू ठिपके (बॅक्टेरियल स्पॉट)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Early_blight",
        displayName: { en: "Early Blight (Alternaria solani)", hi: "अगेती झुलसा (अर्ली ब्लाइट)", mr: "लवकर येणारा करपा (अर्ली ब्लाइट)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Late_blight",
        displayName: { en: "Late Blight (Phytophthora infestans)", hi: "पछेती झुलसा (लेट ब्लाइट)", mr: "उशिरा येणारा करपा (लेट ब्लाइट)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Leaf_Mold",
        displayName: { en: "Leaf Mold (Passalora fulva)", hi: "पत्ती का फफूंद (लीफ मोल्ड)", mr: "पानांवरील बुरशी (लीफ मोल्ड)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Septoria_leaf_spot",
        displayName: { en: "Septoria Leaf Spot (Septoria lycopersici)", hi: "सेप्टोरिया पत्ती धब्बा", mr: "सेप्टोरिया ठिपके" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Spider_mites_Two-spotted_spider_mite",
        displayName: { en: "Spider Mites / Two-Spotted Spider Mite (Tetranychus urticae)", hi: "मकड़ी कीट / दो धब्बों वाली लाल मकड़ी", mr: "लाल कोळी / दोन ठिपक्यांचा कोळी" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Target_Spot",
        displayName: { en: "Target Spot (Corynespora cassiicola)", hi: "टारगेट स्पॉट", mr: "टार्गेट स्पॉट" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Tomato_mosaic_virus",
        displayName: { en: "Tomato Mosaic Virus (ToMV)", hi: "टमाटर मोज़ेक वायरस", mr: "टोमॅटो मोझॅक व्हायरस" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Tomato___Tomato_yellow_leaf_curl_virus",
        displayName: { en: "Tomato Yellow Leaf Curl Virus (TYLCV)", hi: "टमाटर पीला पत्ती मरोड़ वायरस", mr: "टोमॅटो पिवळा पर्णगुच्छ व्हायरस" },
        isHealthy: false,
      },
    ],
  },
  potato: {
    id: "potato",
    name: {
      en: "Potato (Solanum tuberosum)",
      hi: "आलू (आलू)",
      mr: "बटाटा (बटाटा)",
    },
    scientificName: "Solanum tuberosum",
    phase: 1,
    isModelAvailable: false, // Model classes in training/development - no real inference connected yet
    statusNotice: {
      en: "Plant disease diagnosis model is currently under development. No live inference model is connected yet.",
      hi: "पौध रोग निदान मॉडल वर्तमान में विकास के अधीन है। अभी कोई लाइव मॉडल जुड़ा नहीं है।",
      mr: "पीक रोग निदान मॉडेल सध्या विकसित केले जात आहे. अद्याप कोणतेही लाइव्ह मॉडेल जोडलेले नाही.",
    },
    disclaimer: {
      en: "Detection scope is limited strictly to the 3 trained PlantVillage classes below (Healthy, Early Blight, Late Blight). Does not detect tuber diseases or unlisted foliar conditions.",
      hi: "रोग पहचान केवल नीचे दी गई 3 प्रशिक्षित श्रेणियों (स्वस्थ, अगेती झुलसा, पछेती झुलसा) तक सीमित है।",
      mr: "रोग निदान केवळ खालील ३ प्रशिक्षित प्रकारांपुरते (निरोगी, लवकर येणारा करपा, उशिरा येणारा करपा) मर्यादित आहे.",
    },
    supportedClasses: [
      {
        rawDatasetLabel: "Potato___healthy",
        displayName: { en: "Healthy Potato Leaf", hi: "स्वस्थ आलू पत्ती", mr: "निरोगी बटाटा पान" },
        isHealthy: true,
      },
      {
        rawDatasetLabel: "Potato___Early_blight",
        displayName: { en: "Early Blight (Alternaria solani)", hi: "अगेती झुलसा (अर्ली ब्लाइट)", mr: "लवकर येणारा करपा (अर्ली ब्लाइट)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Potato___Late_blight",
        displayName: { en: "Late Blight (Phytophthora infestans)", hi: "पछेती झुलसा (लेट ब्लाइट)", mr: "उशिरा येणारा करपा (लेट ब्लाइट)" },
        isHealthy: false,
      },
    ],
  },
  maize: {
    id: "maize",
    name: {
      en: "Maize / Corn (Zea mays)",
      hi: "मक्का (मक्का)",
      mr: "मका (मका)",
    },
    scientificName: "Zea mays",
    phase: 2,
    isModelAvailable: false, // Model classes in training/testing - disabled for Phase 1
    statusNotice: {
      en: "Phase 2 Crop: Model classes currently in training & validation. Unavailable until verification is complete.",
      hi: "चरण 2 फसल: मॉडल वर्तमान में प्रशिक्षण और परीक्षण में है। सत्यापन पूरा होने तक उपलब्ध नहीं है।",
      mr: "टप्पा २ पीक: मॉडेल सध्या प्रशिक्षण आणि चाचणीमध्ये आहे. पडताळणी पूर्ण होईपर्यंत उपलब्ध नाही.",
    },
    disclaimer: {
      en: "Phase 2 Planned Scope: 4 PlantVillage classes (Healthy, Cercospora Leaf Spot, Common Rust, Northern Leaf Blight).",
      hi: "चरण 2 नियोजित दायरा: 4 प्लांटविलेज श्रेणियां।",
      mr: "टप्पा २ नियोजित व्याप्ती: ४ प्लांटव्हिलेज प्रकार.",
    },
    supportedClasses: [
      {
        rawDatasetLabel: "Corn_(maize)___healthy",
        displayName: { en: "Healthy Corn Leaf", hi: "स्वस्थ मक्का पत्ती", mr: "निरोगी मका पान" },
        isHealthy: true,
      },
      {
        rawDatasetLabel: "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
        displayName: { en: "Cercospora Leaf Spot / Gray Leaf Spot (Cercospora zeae-maydis)", hi: "सर्फोस्पोरा पत्ती धब्बा", mr: "सर्फोस्पोरा ठिपके" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Corn_(maize)___Common_rust_",
        displayName: { en: "Common Rust (Puccinia sorghi)", hi: "कॉमन रस्ट (गेरुआ)", mr: "तांबेरा (रस्ट)" },
        isHealthy: false,
      },
      {
        rawDatasetLabel: "Corn_(maize)___Northern_Leaf_Blight",
        displayName: { en: "Northern Leaf Blight (Exserohilum turcicum)", hi: "उत्तरी पत्ती झुलसा", mr: "नदर्न लीफ ब्लाइट" },
        isHealthy: false,
      },
    ],
  },
  bell_pepper: {
    id: "bell_pepper",
    name: {
      en: "Bell Pepper / Capsicum (Capsicum annuum)",
      hi: "शिमला मिर्च (कैप्सिकम)",
      mr: "ढोबळी मिरची (कॅप्सिकम)",
    },
    scientificName: "Capsicum annuum",
    phase: 2,
    isModelAvailable: false, // Model classes in training/testing - disabled for Phase 1
    statusNotice: {
      en: "Phase 2 Crop: Model classes currently in training & validation. Unavailable until verification is complete.",
      hi: "चरण 2 फसल: मॉडल वर्तमान में प्रशिक्षण और परीक्षण में है। सत्यापन पूरा होने तक उपलब्ध नहीं है।",
      mr: "टप्पा २ पीक: मॉडेल सध्या प्रशिक्षण आणि चाचणीमध्ये आहे. पडताळणी पूर्ण होईपर्यंत उपलब्ध नाही.",
    },
    disclaimer: {
      en: "Phase 2 Planned Scope: 2 PlantVillage classes (Healthy, Bacterial Spot).",
      hi: "चरण 2 नियोजित दायरा: 2 प्लांटविलेज श्रेणियां।",
      mr: "टप्पा २ नियोजित व्याप्ती: २ प्लांटव्हिलेज प्रकार.",
    },
    supportedClasses: [
      {
        rawDatasetLabel: "Pepper__bell___healthy",
        displayName: { en: "Healthy Bell Pepper Leaf", hi: "स्वस्थ शिमला मिर्च पत्ती", mr: "निरोगी ढोबळी मिरची पान" },
        isHealthy: true,
      },
      {
        rawDatasetLabel: "Pepper__bell___Bacterial_spot",
        displayName: { en: "Bacterial Spot (Xanthomonas campestris)", hi: "जीवाणु धब्बा (बैक्टीरियल स्पॉट)", mr: "जिवाणू ठिपके" },
        isHealthy: false,
      },
    ],
  },
};

/**
 * Returns only crops where the AI model is trained and active (Phase 1: Tomato & Potato)
 */
export function getActiveModelCrops(): ModelCropConfig[] {
  return Object.values(CROP_DISEASE_MODEL_CONFIG).filter((crop) => crop.isModelAvailable);
}

/**
 * Returns all configured crops, including future roadmap phases (for display with disabled states)
 */
export function getAllModelCrops(): ModelCropConfig[] {
  return Object.values(CROP_DISEASE_MODEL_CONFIG);
}

/**
 * Checks whether a crop is available for diagnosis in the currently loaded model
 */
export function isCropModelAvailable(cropId: string): boolean {
  return CROP_DISEASE_MODEL_CONFIG[cropId]?.isModelAvailable === true;
}

/**
 * Gets the supported classes for a crop
 */
export function getCropSupportedClasses(cropId: string): DiseaseClassMapping[] {
  return CROP_DISEASE_MODEL_CONFIG[cropId]?.supportedClasses || [];
}

/**
 * Gets config for a specific crop, fallback to tomato if not found
 */
export function getCropModelConfig(cropId: string): ModelCropConfig {
  return CROP_DISEASE_MODEL_CONFIG[cropId] || CROP_DISEASE_MODEL_CONFIG.tomato;
}
