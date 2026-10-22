"use client";

import React, { useEffect, useRef } from "react";

export const FarmSunriseCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Flocking Birds Simulation with aerodynamic wing motion
    const birds = Array.from({ length: 7 }, (_, i) => ({
      x: (width * 0.1) + i * 45,
      y: (height * 0.14) + Math.sin(i) * 20,
      speed: 1.2 + (i % 3) * 0.25,
      size: 0.9 + (i % 4) * 0.25,
      wingPhase: i * 0.8,
    }));

    // Wind Wave parameters
    let time = 0;

    const render = () => {
      time += 0.018;
      ctx.clearRect(0, 0, width, height);

      // =========================================================================
      // PASS 1: Volumetric Golden Hour Sky & Rayleigh Scattering
      // =========================================================================
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      skyGrad.addColorStop(0, "#1E293B"); // Deep twilight top
      skyGrad.addColorStop(0.25, "#334155"); // Atmospheric slate
      skyGrad.addColorStop(0.5, "#9A3412"); // Warm terracotta horizon
      skyGrad.addColorStop(0.75, "#D97706"); // Golden amber
      skyGrad.addColorStop(1, "#FEF08A"); // Luminous sun glow
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.65);

      // Sun Disc with Lens Glow
      const sunX = width * 0.48;
      const sunY = height * 0.42;

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, width * 0.5);
      sunGlow.addColorStop(0, "rgba(254, 240, 138, 1)");
      sunGlow.addColorStop(0.2, "rgba(245, 158, 11, 0.6)");
      sunGlow.addColorStop(0.5, "rgba(217, 119, 6, 0.25)");
      sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height * 0.65);

      // Sun Disc
      ctx.beginPath();
      ctx.arc(sunX, sunY, 48, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFBEB";
      ctx.shadowColor = "#F59E0B";
      ctx.shadowBlur = 60;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Volumetric Sun Rays (Golden Hour Shimmer)
      ctx.save();
      ctx.fillStyle = "rgba(254, 240, 138, 0.05)";
      for (let r = 0; r < 6; r++) {
        const rayAngle = (r * Math.PI) / 6 + Math.sin(time * 0.5 + r) * 0.05;
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(sunX + Math.cos(rayAngle - 0.15) * width, sunY + Math.sin(rayAngle - 0.15) * height);
        ctx.lineTo(sunX + Math.cos(rayAngle + 0.15) * width, sunY + Math.sin(rayAngle + 0.15) * height);
        ctx.fill();
      }
      ctx.restore();

      // =========================================================================
      // PASS 2: Distant Mountains with Aerial Perspective Fog
      // =========================================================================
      ctx.fillStyle = "#451A03"; // Distant mountain silhouette
      ctx.beginPath();
      ctx.moveTo(0, height * 0.48);
      ctx.quadraticCurveTo(width * 0.2, height * 0.42, width * 0.4, height * 0.46);
      ctx.quadraticCurveTo(width * 0.7, height * 0.52, width, height * 0.44);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Atmospheric Fog Belt
      const fogGrad = ctx.createLinearGradient(0, height * 0.44, 0, height * 0.54);
      fogGrad.addColorStop(0, "rgba(254, 240, 138, 0)");
      fogGrad.addColorStop(0.5, "rgba(253, 230, 138, 0.35)");
      fogGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height * 0.44, width, height * 0.1);

      // =========================================================================
      // PASS 3: Photorealistic Indian Trees (Neem, Banyan, Coconut, Mango)
      // =========================================================================
      ctx.fillStyle = "#1E1B18"; // Dark rich timber silhouette

      // 1. Coconut Palm (Far Left)
      const px = width * 0.12;
      const py = height * 0.47;
      ctx.beginPath();
      ctx.moveTo(px, py + 40);
      ctx.quadraticCurveTo(px + 15, py, px + 8, py - 45);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#1E1B18";
      ctx.stroke();
      // Palm Fronds
      for (let f = 0; f < 7; f++) {
        const fa = (f * Math.PI) / 3.5 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(px + 8, py - 45);
        ctx.quadraticCurveTo(px + 8 + Math.cos(fa) * 35, py - 45 + Math.sin(fa) * 35 + 10, px + 8 + Math.cos(fa) * 50, py - 45 + Math.sin(fa) * 50 + 20);
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 2. Majestic Banyan Tree (Center-Right Horizon)
      const bx = width * 0.76;
      const by = height * 0.48;
      // Banyan Trunk with Prop Roots
      ctx.beginPath();
      ctx.moveTo(bx - 12, by + 40);
      ctx.lineTo(bx - 8, by - 15);
      ctx.lineTo(bx + 8, by - 15);
      ctx.lineTo(bx + 12, by + 40);
      ctx.fill();
      // Banyan Prop Roots
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 25, by - 5); ctx.lineTo(bx - 28, by + 40);
      ctx.moveTo(bx + 25, by - 5); ctx.lineTo(bx + 26, by + 40);
      ctx.stroke();
      // Banyan Spreading Canopy
      ctx.beginPath();
      ctx.arc(bx, by - 35, 42, 0, Math.PI * 2);
      ctx.arc(bx - 32, by - 25, 32, 0, Math.PI * 2);
      ctx.arc(bx + 35, by - 25, 32, 0, Math.PI * 2);
      ctx.arc(bx - 15, by - 48, 28, 0, Math.PI * 2);
      ctx.arc(bx + 18, by - 48, 28, 0, Math.PI * 2);
      ctx.fill();

      // 3. Neem Tree Silhouette (Far Left-Center)
      const nx = width * 0.32;
      const ny = height * 0.49;
      ctx.beginPath();
      ctx.arc(nx, ny - 25, 26, 0, Math.PI * 2);
      ctx.arc(nx - 18, ny - 15, 20, 0, Math.PI * 2);
      ctx.arc(nx + 18, ny - 15, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(nx - 4, ny - 10, 8, 30);

      // =========================================================================
      // PASS 4: Multi-Textured Indian Soil Bed (Alluvial Cracks & Moisture Sheen)
      // =========================================================================
      const soilGrad = ctx.createLinearGradient(0, height * 0.52, 0, height);
      soilGrad.addColorStop(0, "#3D2314"); // Wet alluvial earth top
      soilGrad.addColorStop(0.4, "#26160C"); // Deep rich soil
      soilGrad.addColorStop(1, "#0F0B08"); // Deep ground
      ctx.fillStyle = soilGrad;
      ctx.fillRect(0, height * 0.52, width, height * 0.48);

      // Natural Soil Cracks Texture
      ctx.strokeStyle = "rgba(120, 53, 15, 0.35)";
      ctx.lineWidth = 1.2;
      const crackSpacing = 90;
      for (let cx = 20; cx < width; cx += crackSpacing) {
        const cy = height * 0.65 + (cx % 30);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 15, cy + 12);
        ctx.lineTo(cx + 8, cy + 25);
        ctx.lineTo(cx + 22, cy + 38);
        ctx.stroke();
      }

      // Soil Wet Sheen Highlights
      const sheenGrad = ctx.createLinearGradient(0, height * 0.53, 0, height * 0.65);
      sheenGrad.addColorStop(0, "rgba(254, 240, 138, 0.18)");
      sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, height * 0.53, width, height * 0.12);

      // =========================================================================
      // PASS 5: Realistic Dense Crops (Golden Wheat & Yellow Mustard Fields)
      // =========================================================================
      const cropStalkCount = Math.floor(width / 10);
      
      for (let i = 0; i < cropStalkCount; i++) {
        const sx = i * 10;
        const sy = height;
        const stalkH = 110 + Math.sin(i * 0.7) * 35; // Natural uneven crop height
        const windSway = Math.sin(time * 1.8 + i * 0.2) * 14;

        // Alternating Crops: Mustard Flowers (yellow tufts) vs Golden Wheat (amber stalks)
        const isMustard = i % 4 === 0;

        ctx.strokeStyle = isMustard ? "#CA8A04" : "#D97706";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + windSway * 0.5, sy - stalkH * 0.5, sx + windSway, sy - stalkH);
        ctx.stroke();

        if (isMustard) {
          // Yellow Mustard Flower Clusters
          ctx.fillStyle = "#FACC15";
          ctx.beginPath();
          ctx.arc(sx + windSway, sy - stalkH, 4.5, 0, Math.PI * 2);
          ctx.arc(sx + windSway - 3, sy - stalkH + 3, 3.5, 0, Math.PI * 2);
          ctx.arc(sx + windSway + 3, sy - stalkH + 3, 3.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Golden Wheat Grain Head
          ctx.fillStyle = "#F59E0B";
          ctx.beginPath();
          ctx.ellipse(sx + windSway, sy - stalkH, 3, 7, windSway * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =========================================================================
      // PASS 6: Flocking Birds with Aerodynamic Motion
      // =========================================================================
      birds.forEach((bird) => {
        bird.x += bird.speed;
        bird.wingPhase += 0.16;
        if (bird.x > width + 80) bird.x = -80;

        const wy = Math.sin(bird.wingPhase) * 6 * bird.size;

        ctx.save();
        ctx.strokeStyle = "#1E293B";
        ctx.lineWidth = 2 * bird.size;
        ctx.beginPath();
        ctx.moveTo(bird.x - 10 * bird.size, bird.y + wy);
        ctx.quadraticCurveTo(bird.x - 3 * bird.size, bird.y - 4 * bird.size, bird.x, bird.y);
        ctx.quadraticCurveTo(bird.x + 3 * bird.size, bird.y - 4 * bird.size, bird.x + 10 * bird.size, bird.y + wy);
        ctx.stroke();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
