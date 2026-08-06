"use client";

import React, { useEffect, useRef } from "react";

interface CropLifecycleCanvasProps {
  currentTime: number; // 0 to 20 seconds
  className?: string;
}

export const CropLifecycleCanvas: React.FC<CropLifecycleCanvasProps> = ({
  currentTime,
  className = "",
}) => {
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

    // Persistent Particle Systems
    const bokehCount = 35;
    const bokehs = Array.from({ length: bokehCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 4,
      speedY: -0.3 - Math.random() * 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));

    const pestCount = 14;
    const pests = Array.from({ length: pestCount }, (_, i) => ({
      angle: (i / pestCount) * Math.PI * 2,
      dist: 40 + Math.random() * 80,
      size: 2.5 + Math.random() * 2,
      wingSpeed: 0.3 + Math.random() * 0.2,
      wingPhase: Math.random() * Math.PI,
    }));

    const sparkleCount = 25;
    const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
      size: 1.5 + Math.random() * 2.5,
      life: Math.random(),
    }));

    let frameTime = 0;

    const render = () => {
      frameTime += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Clamp time [0, 20]
      const t = Math.max(0, Math.min(20, currentTime));

      // Calculate Timeline Phase Values
      // 1. Damage Ratio (0 to 1)
      let damage = 0;
      if (t >= 4 && t < 9) {
        damage = (t - 4) / 5; // 0 -> 1 smoothly
      } else if (t >= 9 && t < 12) {
        damage = 1; // max damage during scan
      } else if (t >= 12 && t < 18) {
        damage = 1 - (t - 12) / 6; // 1 -> 0 healing
      } else {
        damage = 0;
      }

      // 2. Camera Dolly Zoom (1.0 to 1.18)
      const cameraScale = 1 + Math.sin((t / 20) * Math.PI) * 0.15;

      // 3. Lighting Mood (Sunrise warmth vs tense dimming)
      let sunIntensity = 1.0;
      if (t >= 4 && t < 9) {
        sunIntensity = 1.0 - damage * 0.35;
      } else if (t >= 9 && t < 12) {
        sunIntensity = 0.7;
      } else if (t >= 12 && t < 18) {
        sunIntensity = 0.7 + (1 - damage) * 0.45;
      }

      ctx.save();

      // Apply subtle camera pan / zoom center
      const centerX = width * 0.5;
      const centerY = height * 0.55;
      ctx.translate(centerX, centerY);
      ctx.scale(cameraScale, cameraScale);
      ctx.translate(-centerX, -centerY);

      // =========================================================================
      // PASS 1: Volumetric Golden Hour Sky & Background Lighting
      // =========================================================================
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        20,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      
      const rSun = Math.round(245 * sunIntensity);
      const gSun = Math.round(158 * sunIntensity);
      const bSun = Math.round(11 * sunIntensity);

      bgGrad.addColorStop(0, `rgba(${rSun}, ${gSun}, ${bSun}, 0.28)`);
      bgGrad.addColorStop(0.4, `rgba(15, 23, 42, 0.95)`);
      bgGrad.addColorStop(1, `#020617`);

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Golden Rim Light Flare
      const sunX = width * 0.5;
      const sunY = height * 0.28;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 320);
      sunGlow.addColorStop(0, `rgba(254, 240, 138, ${0.45 * sunIntensity})`);
      sunGlow.addColorStop(0.3, `rgba(245, 158, 11, ${0.25 * sunIntensity})`);
      sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      // Distant Horizon Bokeh Orbs
      bokehs.forEach((b) => {
        b.y += b.speedY;
        b.x += b.speedX;
        b.phase += 0.02;
        if (b.y < -20) b.y = height + 20;
        if (b.x < 0) b.x = width;
        if (b.x > width) b.x = 0;

        const currentAlpha = b.alpha * (0.6 + Math.sin(b.phase) * 0.4) * sunIntensity;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 240, 138, ${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#F59E0B";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // =========================================================================
      // PASS 2: Dark Moody Soil & Shallow Depth Bed
      // =========================================================================
      const soilY = height * 0.75;
      const soilGrad = ctx.createLinearGradient(0, soilY - 40, 0, height);
      soilGrad.addColorStop(0, "#29180E");
      soilGrad.addColorStop(0.3, "#180F08");
      soilGrad.addColorStop(1, "#070402");

      ctx.fillStyle = soilGrad;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, soilY + 40, width * 0.6, 90, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soil texture rim highlights
      ctx.strokeStyle = `rgba(217, 119, 6, ${0.2 * sunIntensity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, soilY + 10, width * 0.4, 30, 0, Math.PI, Math.PI * 2);
      ctx.stroke();

      // =========================================================================
      // PASS 3: Single Central Cinematic Crop Plant Render
      // =========================================================================
      const plantBaseX = width * 0.5;
      const plantBaseY = soilY + 10;
      const plantHeight = Math.min(height * 0.45, 320);

      // Main Stem
      const stemSway = Math.sin(frameTime * 1.2) * 4;
      const stemTopX = plantBaseX + stemSway;
      const stemTopY = plantBaseY - plantHeight;

      const stemGrad = ctx.createLinearGradient(plantBaseX, plantBaseY, stemTopX, stemTopY);
      const stemR = Math.round(34 + damage * 70);
      const stemG = Math.round(197 - damage * 110);
      const stemB = Math.round(94 - damage * 70);
      stemGrad.addColorStop(0, `rgb(${stemR}, ${stemG}, ${stemB})`);
      stemGrad.addColorStop(1, `rgb(${stemR + 20}, ${stemG + 40}, ${stemB})`);

      ctx.beginPath();
      ctx.moveTo(plantBaseX, plantBaseY);
      ctx.quadraticCurveTo(
        plantBaseX + stemSway * 0.5,
        plantBaseY - plantHeight * 0.5,
        stemTopX,
        stemTopY
      );
      ctx.lineWidth = 10;
      ctx.strokeStyle = stemGrad;
      ctx.lineCap = "round";
      ctx.stroke();

      // Golden Rim Light stroke on Stem Edge
      ctx.beginPath();
      ctx.moveTo(plantBaseX - 3, plantBaseY);
      ctx.quadraticCurveTo(
        plantBaseX + stemSway * 0.5 - 3,
        plantBaseY - plantHeight * 0.5,
        stemTopX - 3,
        stemTopY
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(254, 240, 138, ${0.7 * sunIntensity})`;
      ctx.stroke();

      // Draw 5 Detailed Leaves
      const leafConfigs = [
        { attachYRatio: 0.3, len: 140, angle: -0.65, side: -1 },
        { attachYRatio: 0.45, len: 160, angle: 0.55, side: 1 },
        { attachYRatio: 0.62, len: 175, angle: -0.5, side: -1 },
        { attachYRatio: 0.78, len: 155, angle: 0.45, side: 1 },
        { attachYRatio: 0.95, len: 110, angle: -0.2, side: -1 },
      ];

      leafConfigs.forEach((cfg, idx) => {
        const attachX = plantBaseX + stemSway * (1 - cfg.attachYRatio);
        const attachY = plantBaseY - plantHeight * cfg.attachYRatio;

        const leafSway = Math.sin(frameTime * 1.5 + idx) * 5;
        const targetAngle = cfg.angle + (leafSway * Math.PI) / 180 + (damage * 0.15 * cfg.side);
        
        const tipX = attachX + Math.cos(targetAngle) * cfg.len * cfg.side;
        const tipY = attachY + Math.sin(targetAngle) * cfg.len + damage * 15;

        // Control points for organic curved leaf blade
        const cp1X = attachX + Math.cos(targetAngle - 0.4 * cfg.side) * (cfg.len * 0.5) * cfg.side;
        const cp1Y = attachY + Math.sin(targetAngle - 0.4) * (cfg.len * 0.5) - 25;

        const cp2X = attachX + Math.cos(targetAngle + 0.4 * cfg.side) * (cfg.len * 0.5) * cfg.side;
        const cp2Y = attachY + Math.sin(targetAngle + 0.4) * (cfg.len * 0.5) + 20;

        // Dynamic Color calculation (Vivid Green -> Yellow/Brown -> Vivid Green)
        const lR = Math.round(34 + damage * 130);
        const lG = Math.round(197 - damage * 120);
        const lB = Math.round(94 - damage * 80);

        const leafGrad = ctx.createLinearGradient(attachX, attachY, tipX, tipY);
        leafGrad.addColorStop(0, `rgb(${lR}, ${lG}, ${lB})`);
        leafGrad.addColorStop(0.7, `rgb(${Math.max(20, lR - 15)}, ${lG + 30}, ${lB})`);
        leafGrad.addColorStop(1, `rgb(${Math.min(240, lR + 40)}, ${Math.max(40, lG - 30)}, ${lB})`);

        // Draw Leaf Base Shape
        ctx.beginPath();
        ctx.moveTo(attachX, attachY);
        ctx.quadraticCurveTo(cp1X, cp1Y, tipX, tipY);
        ctx.quadraticCurveTo(cp2X, cp2Y, attachX, attachY);
        ctx.fillStyle = leafGrad;
        ctx.fill();

        // Leaf Specular & Golden Rim Highlight
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.75 * sunIntensity})`;
        ctx.stroke();

        // Central Leaf Vein
        ctx.beginPath();
        ctx.moveTo(attachX, attachY);
        ctx.quadraticCurveTo((attachX + tipX) / 2, (attachY + tipY) / 2 - 5, tipX, tipY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * (1 - damage * 0.5)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Disease Spots Overlay (Phase 2 & 3: 4s to 12s)
        if (damage > 0.05) {
          const spotCount = 5;
          for (let sp = 0; sp < spotCount; sp++) {
            const spRatio = 0.25 + (sp / spotCount) * 0.55;
            const spotX = attachX + (tipX - attachX) * spRatio + Math.sin(sp * 3) * 8;
            const spotY = attachY + (tipY - attachY) * spRatio + Math.cos(sp * 3) * 6;
            const spotRadius = (3 + sp * 1.8) * damage;

            ctx.beginPath();
            ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(120, 53, 15, ${0.85 * damage})`;
            ctx.fill();

            // Halo around spot
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotRadius * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(234, 179, 8, ${0.45 * damage})`;
            ctx.fill();
          }
        }
      });

      // New Shoot Growth Sprouting (Phase 4 Recovery: 12s to 18s)
      if (t >= 12) {
        const healProgress = Math.min(1, (t - 12) / 6);
        const sproutLen = 45 * healProgress;
        const sproutX = stemTopX;
        const sproutY = stemTopY;

        ctx.beginPath();
        ctx.moveTo(sproutX, sproutY);
        ctx.quadraticCurveTo(sproutX - 15, sproutY - sproutLen * 0.5, sproutX - 22, sproutY - sproutLen);
        ctx.moveTo(sproutX, sproutY);
        ctx.quadraticCurveTo(sproutX + 15, sproutY - sproutLen * 0.5, sproutX + 22, sproutY - sproutLen);
        ctx.strokeStyle = "#4ADE80";
        ctx.lineWidth = 4 * healProgress;
        ctx.lineCap = "round";
        ctx.stroke();

        // Glowing tip of new shoot
        ctx.beginPath();
        ctx.arc(sproutX, sproutY - sproutLen, 5 * healProgress, 0, Math.PI * 2);
        ctx.fillStyle = "#86EFAC";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#22C55E";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // =========================================================================
      // PASS 4: Insect Pest Swarm (Phase 2 & 3: 4s to 12s)
      // =========================================================================
      if (t >= 4 && t < 14) {
        const pestVisibility = t < 12 ? Math.min(1, (t - 4) / 2) : Math.max(0, 1 - (t - 12) / 2);
        
        pests.forEach((p, pIdx) => {
          p.angle += 0.02 * (pIdx % 2 === 0 ? 1 : -1);
          p.wingPhase += p.wingSpeed;

          const pestX = plantBaseX + Math.cos(p.angle) * (p.dist + Math.sin(frameTime * 2 + pIdx) * 15);
          const pestY = plantBaseY - plantHeight * 0.55 + Math.sin(p.angle * 1.5) * (p.dist * 0.6);

          ctx.save();
          ctx.translate(pestX, pestY);
          ctx.rotate(p.angle);

          // Pest Body
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(69, 10, 10, ${0.9 * pestVisibility})`;
          ctx.fill();

          // Pest Wings Flapping
          const wingY = Math.sin(p.wingPhase) * 4;
          ctx.strokeStyle = `rgba(252, 165, 165, ${0.7 * pestVisibility})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(-p.size - 5, -3 + wingY);
          ctx.moveTo(p.size, 0);
          ctx.lineTo(p.size + 5, -3 + wingY);
          ctx.stroke();

          ctx.restore();
        });
      }

      // =========================================================================
      // PASS 5: AI HUD Laser Scan Line Overlay (Phase 3: 9s to 12s)
      // =========================================================================
      if (t >= 8.8 && t <= 12.2) {
        const scanProgress = (t - 8.8) / 3.4; // 0 -> 1 sweep
        const scanStartY = plantBaseY - plantHeight - 30;
        const scanEndY = plantBaseY + 20;
        const currentScanY = scanStartY + (scanEndY - scanStartY) * scanProgress;

        // Horizontal Glowing Laser Beam
        const laserGrad = ctx.createLinearGradient(
          plantBaseX - 220,
          currentScanY,
          plantBaseX + 220,
          currentScanY
        );
        laserGrad.addColorStop(0, "rgba(16, 185, 129, 0)");
        laserGrad.addColorStop(0.2, "rgba(52, 211, 153, 0.8)");
        laserGrad.addColorStop(0.5, "rgba(255, 255, 255, 1)");
        laserGrad.addColorStop(0.8, "rgba(52, 211, 153, 0.8)");
        laserGrad.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.beginPath();
        ctx.moveTo(plantBaseX - 220, currentScanY);
        ctx.lineTo(plantBaseX + 220, currentScanY);
        ctx.lineWidth = 3;
        ctx.strokeStyle = laserGrad;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#10B981";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Subtle Target Reticle Box
        ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(plantBaseX - 140, plantBaseY - plantHeight - 20, 280, plantHeight + 30);
        ctx.setLineDash([]);
      }

      // =========================================================================
      // PASS 6: Healing Sparkle Particles Burst (Phase 4: 12s to 18s)
      // =========================================================================
      if (t >= 12 && t < 18) {
        sparkles.forEach((sp) => {
          sp.y += sp.vy;
          sp.x += sp.vx;
          sp.life -= 0.015;

          if (sp.life <= 0) {
            sp.x = plantBaseX + (Math.random() - 0.5) * 160;
            sp.y = plantBaseY - Math.random() * plantHeight;
            sp.vy = -1 - Math.random() * 2;
            sp.life = 1;
          }

          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size * sp.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(74, 222, 128, ${sp.life})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#4ADE80";
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [currentTime]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};
