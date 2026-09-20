"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
  r: number;
  layer: number;
  alpha: number;
  alphaSpeed: number;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nw = 0, nh = 0;
    let nodes: Particle[] = [];
    let mouseX = -9999, mouseY = -9999;
    let shootingStar: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

    const resize = () => {
      nw = canvas.width = window.innerWidth;
      nh = canvas.height = window.innerHeight;
      nodes = [];
      // Increased quantity of dots for high visibility across all sections
      const count = Math.min(Math.floor((nw * nh) / 10500), 220);
      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.55 ? 0 : 1;
        nodes.push({
          x: Math.random() * nw,
          y: Math.random() * nh,
          baseVx: (Math.random() - 0.5) * (layer ? 0.38 : 0.18),
          baseVy: (Math.random() - 0.5) * (layer ? 0.38 : 0.18),
          vx: 0,
          vy: 0,
          r: layer ? 1.9 + Math.random() * 1.4 : 1.1 + Math.random() * 0.8,
          layer,
          alpha: 0.35 + Math.random() * 0.65,
          alphaSpeed: (0.008 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1)
        });
      }
    };

    const maybeSpawnStar = () => {
      if (shootingStar) return;
      if (Math.random() < 0.0065) {
        const fromLeft = Math.random() < 0.5;
        shootingStar = {
          x: fromLeft ? -50 : nw + 50,
          y: Math.random() * nh * 0.55,
          vx: (fromLeft ? 1 : -1) * (8.5 + Math.random() * 4),
          vy: 4.0 + Math.random() * 2.5,
          life: 1
        };
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, nw, nh);
      const rgb = isDark() ? "255,143,77" : "255,123,41";

      // Update nodes
      nodes.forEach((n) => {
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let gx = 0, gy = 0;
        if (dist < 150) {
          const force = (1 - dist / 150) * 0.45;
          gx = (dx / (dist || 1)) * force;
          gy = (dy / (dist || 1)) * force;
        }
        n.vx += (n.baseVx - n.vx) * 0.025 + gx * 0.06;
        n.vy += (n.baseVy - n.vy) * 0.025 + gy * 0.06;
        n.x += n.vx;
        n.y += n.vy;

        // Subtle shimmering
        n.alpha += n.alphaSpeed;
        if (n.alpha > 1) {
          n.alpha = 1;
          n.alphaSpeed = -Math.abs(n.alphaSpeed);
        } else if (n.alpha < 0.35) {
          n.alpha = 0.35;
          n.alphaSpeed = Math.abs(n.alphaSpeed);
        }

        if (n.x < -15) n.x = nw + 15;
        if (n.x > nw + 15) n.x = -15;
        if (n.y < -15) n.y = nh + 15;
        if (n.y > nh + 15) n.y = -15;
      });

      // Draw connecting lines between near nodes
      const near = nodes.filter((n) => n.layer === 1);
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const dx = near[i].x - near[j].x;
          const dy = near[i].y - near[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 125) {
            const lineOpacity = (1 - dist / 125) * 0.22;
            ctx.strokeStyle = `rgba(${rgb},${lineOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(near[i].x, near[i].y);
            ctx.lineTo(near[j].x, near[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const baseAlpha = n.layer ? 0.8 : 0.48;
        ctx.fillStyle = `rgba(${rgb},${baseAlpha * n.alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shooting stars
      maybeSpawnStar();
      if (shootingStar) {
        const s = shootingStar;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.018;
        if (s.life <= 0 || s.x < -100 || s.x > nw + 100 || s.y > nh + 100) {
          shootingStar = null;
        } else {
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
          grad.addColorStop(0, `rgba(${rgb},${s.life})`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield-canvas"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  );
}
