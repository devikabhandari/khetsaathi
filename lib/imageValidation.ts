/**
 * KhetSaathi - Universal Image Validation Service
 * 
 * Implements a strict, standardized 4-stage validation pipeline across all image upload locations:
 * - Stage 1: File format & safety (JPEG/PNG/WebP magic numbers, size limit, decoding integrity)
 * - Stage 2: Image clarity & quality (Laplacian variance blur detection, luminance/exposure, resolution)
 * - Stage 3: Plant vs non-plant verification (Explicit status: model is not trained yet, never fabricated)
 * - Stage 4: Disease model readiness (Clear status: model is being prepared, zero mock/fake diagnoses)
 */

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const SUPPORTED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
export const MIN_RESOLUTION_PX = 224; // 224x224 standard computer vision input dimension
export const MIN_LUMINANCE = 28; // Too dark / underexposed threshold
export const MAX_LUMINANCE = 242; // Too bright / overexposed threshold
export const MIN_LAPLACIAN_SHARPNESS = 14.0; // Minimum edge variance to distinguish sharp vs blurry photos

export type ImageValidationStage =
  | "file_safety"
  | "image_quality"
  | "plant_detection"
  | "model_readiness"
  | "complete";

export interface ImageQualityMetrics {
  format: string;
  sizeBytes: number;
  sizeMb: string;
  width: number;
  height: number;
  avgLuminance: number;
  sharpnessScore: number;
  isTooDark: boolean;
  isOverexposed: boolean;
  isBlurry: boolean;
  isLowResolution: boolean;
}

export interface ImageValidationResult {
  isValid: boolean;
  stage: ImageValidationStage;
  errorMessage?: string;
  userGuidance?: string;
  metrics?: ImageQualityMetrics;
  
  // Stage 3: Plant verification state (truthful status, no fake detections)
  plantVerification: {
    isDetectorAvailable: boolean;
    isPlant: boolean | null;
    statusMessage: string;
  };

  // Stage 4: Disease classification model readiness
  modelReadiness: {
    isModelTrainedAndConnected: boolean;
    supportedCrops: string[];
    statusMessage: string;
    diagnosisGenerated: boolean;
  };
}

/**
 * Checks file magic number bytes for true format safety (not just file extension).
 */
export async function verifyImageMagicNumbers(file: Blob): Promise<{ valid: boolean; detectedFormat?: string }> {
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length < 4) return { valid: false };

    // JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { valid: true, detectedFormat: "JPEG" };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return { valid: true, detectedFormat: "PNG" };
    }

    // WebP: RIFF .... WEBP
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes.length >= 12 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { valid: true, detectedFormat: "WEBP" };
    }

    return { valid: false };
  } catch {
    return { valid: false };
  }
}

/**
 * Decodes the image into an HTMLImageElement safely.
 */
export function decodeImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image decoding failed. File may be corrupted or in an unreadable format."));
    img.src = sourceUrl;
  });
}

/**
 * Computes luminance and Laplacian variance (sharpness) via canvas pixel analysis.
 */
export function analyzeImagePixels(img: HTMLImageElement): {
  avgLuminance: number;
  sharpnessScore: number;
} {
  // Normalize canvas to 224x224 for consistent, performant metric evaluation
  const targetSize = 224;
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    return { avgLuminance: 128, sharpnessScore: 50 };
  }

  ctx.drawImage(img, 0, 0, targetSize, targetSize);
  const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
  const data = imgData.data;

  // 1. Calculate average luminance (0.299R + 0.587G + 0.114B)
  // And construct grayscale 2D intensity grid for discrete Laplacian convolution
  const gray: number[][] = [];
  let totalLuminance = 0;
  const totalPixels = targetSize * targetSize;

  for (let y = 0; y < targetSize; y++) {
    const row: number[] = [];
    for (let x = 0; x < targetSize; x++) {
      const idx = (y * targetSize + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLuminance += lum;
      row.push(lum);
    }
    gray.push(row);
  }

  const avgLuminance = totalLuminance / totalPixels;

  // 2. Discrete Laplacian convolution:
  // Kernel:
  // [ 0,  1,  0 ]
  // [ 1, -4,  1 ]
  // [ 0,  1,  0 ]
  let laplacianSum = 0;
  let laplacianSqSum = 0;
  let evaluatedPixels = 0;

  for (let y = 1; y < targetSize - 1; y++) {
    for (let x = 1; x < targetSize - 1; x++) {
      const val =
        gray[y - 1][x] +
        gray[y + 1][x] +
        gray[y][x - 1] +
        gray[y][x + 1] -
        4 * gray[y][x];

      laplacianSum += val;
      laplacianSqSum += val * val;
      evaluatedPixels++;
    }
  }

  const mean = laplacianSum / evaluatedPixels;
  // Variance = E[X^2] - (E[X])^2
  const variance = laplacianSqSum / evaluatedPixels - mean * mean;
  const sharpnessScore = Math.max(0, Math.round(variance * 10) / 10);

  return { avgLuminance, sharpnessScore };
}

/**
 * Universal Image Validation Pipeline:
 * Validates any File or Blob across all 4 stages.
 */
export async function validateImageFile(
  file: File | Blob,
  fileName?: string
): Promise<ImageValidationResult> {
  const name = fileName || (file instanceof File ? file.name : "camera_capture.jpg");
  const ext = name.split(".").pop()?.toLowerCase() || "";

  // -------------------------------------------------------------
  // STAGE 1: File Format, Magic Bytes, File Size & Safety
  // -------------------------------------------------------------
  if (!file || file.size === 0) {
    return {
      isValid: false,
      stage: "file_safety",
      errorMessage: "Uploaded file is empty (0 bytes). Please upload a valid image.",
      userGuidance: "Please select an actual photograph from your device.",
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 1.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      stage: "file_safety",
      errorMessage: `File size (${sizeMb} MB) exceeds the 10 MB limit.`,
      userGuidance: "Please compress or choose an image smaller than 10 MB.",
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 1.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  // Verify magic bytes
  const headerCheck = await verifyImageMagicNumbers(file);
  if (!headerCheck.valid) {
    return {
      isValid: false,
      stage: "file_safety",
      errorMessage: "Unsupported or invalid image format. Only JPEG, PNG, and WebP images are allowed.",
      userGuidance: "Ensure your file is a genuine JPG, PNG, or WebP photo and has not been corrupted.",
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 1.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  // Verify decoding integrity
  let objectUrl: string | null = null;
  let imgElement: HTMLImageElement;
  try {
    objectUrl = URL.createObjectURL(file);
    imgElement = await decodeImage(objectUrl);
  } catch {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    return {
      isValid: false,
      stage: "file_safety",
      errorMessage: "Failed to decode image. The file may be corrupt, truncated, or unreadable.",
      userGuidance: "Please try saving or taking the photo again.",
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 1.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  const naturalWidth = imgElement.naturalWidth || imgElement.width;
  const naturalHeight = imgElement.naturalHeight || imgElement.height;

  // -------------------------------------------------------------
  // STAGE 2: Image Clarity, Resolution, Exposure & Sharpness
  // -------------------------------------------------------------
  if (naturalWidth < MIN_RESOLUTION_PX || naturalHeight < MIN_RESOLUTION_PX) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    return {
      isValid: false,
      stage: "image_quality",
      errorMessage: "This image is too small to analyze reliably.",
      userGuidance: `Minimum required resolution is ${MIN_RESOLUTION_PX} × ${MIN_RESOLUTION_PX}px (Current: ${naturalWidth} × ${naturalHeight}px).`,
      metrics: {
        format: headerCheck.detectedFormat || ext.toUpperCase(),
        sizeBytes: file.size,
        sizeMb: (file.size / (1024 * 1024)).toFixed(2),
        width: naturalWidth,
        height: naturalHeight,
        avgLuminance: 0,
        sharpnessScore: 0,
        isTooDark: false,
        isOverexposed: false,
        isBlurry: false,
        isLowResolution: true,
      },
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 2.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  // Analyze pixels for luminance and Laplacian edge sharpness
  const { avgLuminance, sharpnessScore } = analyzeImagePixels(imgElement);
  if (objectUrl) URL.revokeObjectURL(objectUrl);

  const isTooDark = avgLuminance < MIN_LUMINANCE;
  const isOverexposed = avgLuminance > MAX_LUMINANCE;
  const isBlurry = sharpnessScore < MIN_LAPLACIAN_SHARPNESS;

  const metrics: ImageQualityMetrics = {
    format: headerCheck.detectedFormat || ext.toUpperCase(),
    sizeBytes: file.size,
    sizeMb: (file.size / (1024 * 1024)).toFixed(2),
    width: naturalWidth,
    height: naturalHeight,
    avgLuminance: Math.round(avgLuminance),
    sharpnessScore,
    isTooDark,
    isOverexposed,
    isBlurry,
    isLowResolution: false,
  };

  if (isTooDark) {
    return {
      isValid: false,
      stage: "image_quality",
      errorMessage: "The image is too dark. Try taking the photo in better lighting.",
      userGuidance: "Please take the photo in better lighting or natural daylight.",
      metrics,
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 2.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  if (isOverexposed) {
    return {
      isValid: false,
      stage: "image_quality",
      errorMessage: "The image is overexposed. Try taking the photo in softer, even lighting.",
      userGuidance: "Try taking the photo in softer, indirect lighting to prevent glare.",
      metrics,
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 2.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  if (isBlurry) {
    return {
      isValid: false,
      stage: "image_quality",
      errorMessage: "This photo is too blurry. Please take another photo.",
      userGuidance: "Hold the camera steady and focus on the plant leaf.",
      metrics,
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Validation stopped at Stage 2.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage: "No diagnosis generated.",
        diagnosisGenerated: false,
      },
    };
  }

  // -------------------------------------------------------------
  // STAGE 3: Plant vs Non-Plant Classification
  // Explicitly note: The model is not trained yet.
  // We do NOT substitute greenness heuristics or fake ML predictions.
  // -------------------------------------------------------------
  const plantVerification = {
    isDetectorAvailable: false,
    isPlant: null,
    statusMessage: "Visual plant-vs-non-plant verification model is not connected or trained yet. Automated plant verification is currently offline.",
  };

  // -------------------------------------------------------------
  // STAGE 4: Model Readiness & Disease Detection
  // Truthful reporting: Image passed format and clarity checks,
  // but disease model is still under development. No fake diagnosis!
  // -------------------------------------------------------------
  const modelReadiness = {
    isModelTrainedAndConnected: false,
    supportedCrops: ["Tomato", "Potato"],
    statusMessage:
      "Your image passed the available upload checks, but plant disease diagnosis is not available yet. The AI model is still under development. No diagnosis has been generated.",
    diagnosisGenerated: false,
  };

  return {
    isValid: true,
    stage: "complete",
    metrics,
    plantVerification,
    modelReadiness,
  };
}
