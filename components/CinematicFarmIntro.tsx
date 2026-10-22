"use client";

import React from "react";
import { PhotorealCropIntro } from "./PhotorealCropIntro";

interface CinematicFarmIntroProps {
  onComplete: () => void;
}

export const CinematicFarmIntro: React.FC<CinematicFarmIntroProps> = ({ onComplete }) => {
  return <PhotorealCropIntro onComplete={onComplete} />;
};
