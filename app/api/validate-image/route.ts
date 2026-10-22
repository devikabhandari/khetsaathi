import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          isValid: false,
          stage: "file_safety",
          errorMessage: "No image file provided in request.",
        },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        {
          isValid: false,
          stage: "file_safety",
          errorMessage: "Uploaded file is empty (0 bytes).",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          isValid: false,
          stage: "file_safety",
          errorMessage: `File size exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        },
        { status: 400 }
      );
    }

    // Server-side magic bytes validation
    const buffer = Buffer.from(await file.slice(0, 16).arrayBuffer());
    if (buffer.length < 4) {
      return NextResponse.json(
        {
          isValid: false,
          stage: "file_safety",
          errorMessage: "Invalid file buffer. Corrupted or unreadable image.",
        },
        { status: 400 }
      );
    }

    let detectedFormat: "JPEG" | "PNG" | "WEBP" | null = null;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      detectedFormat = "JPEG";
    } else if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      detectedFormat = "PNG";
    } else if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer.length >= 12 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      detectedFormat = "WEBP";
    }

    if (!detectedFormat) {
      return NextResponse.json(
        {
          isValid: false,
          stage: "file_safety",
          errorMessage: "Unsupported format. Only authentic JPEG, PNG, and WebP images are permitted.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      isValid: true,
      stage: "file_safety",
      format: detectedFormat,
      sizeBytes: file.size,
      sizeMb: (file.size / (1024 * 1024)).toFixed(2),
      plantVerification: {
        isDetectorAvailable: false,
        isPlant: null,
        statusMessage: "Plant classification model is not connected or trained yet.",
      },
      modelReadiness: {
        isModelTrainedAndConnected: false,
        supportedCrops: ["Tomato", "Potato"],
        statusMessage:
          "Your image passed the available upload checks, but plant disease diagnosis is not available yet. The AI model is still under development. No diagnosis has been generated.",
        diagnosisGenerated: false,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      {
        isValid: false,
        stage: "file_safety",
        errorMessage: "Server image validation failed: " + msg,
      },
      { status: 500 }
    );
  }
}
