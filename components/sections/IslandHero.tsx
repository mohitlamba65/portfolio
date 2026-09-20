"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import gsap from "gsap";

interface IslandHeroProps {
  data: PortfolioData;
  onTabChange: (tab: string) => void;
}

const roles = ["Backend Engineer", "AI / Agentic Systems Builder", "Full Stack Developer"];

export default function IslandHero({ data, onTabChange }: IslandHeroProps) {
  const { profile, stats } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedRole, setTypedRole] = useState("Backend Engineer");

  // Typing animation
  useEffect(() => {
    let ri = 0, ci = 0, deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        setTypedRole(word.slice(0, ci));
        if (ci === word.length) { deleting = true; timeout = setTimeout(loop, 1400); return; }
      } else {
        ci--;
        setTypedRole(word.slice(0, ci));
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      timeout = setTimeout(loop, deleting ? 35 : 70);
    };
    timeout = setTimeout(loop, 900);
    return () => clearTimeout(timeout);
  }, []);

  // Animate reveal items + stat counters
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".reveal-item, .module").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });

    // Scramble counters
    el.querySelectorAll<HTMLElement>("[data-count]").forEach(target => {
      if (target.dataset.done) return;
      target.dataset.done = "1";
      const targetNum = parseInt(target.dataset.count || "0", 10);
      const suffix = target.dataset.suffix || "";
      const digits = String(targetNum).length;
      target.textContent = "0".repeat(digits) + suffix;
      target.style.opacity = ".4";

      let ticks = 0;
      const max = 7;
      const id = setInterval(() => {
        ticks++;
        const rnd = Array.from({ length: digits }).map(() => Math.floor(Math.random() * 10)).join("");
        target.textContent = rnd + suffix;
        if (ticks >= max) {
          clearInterval(id);
          target.style.opacity = "1";
          const obj = { v: 0 };
          gsap.to(obj, {
            v: targetNum, duration: 0.9, ease: "power2.out",
            onUpdate: () => { target.textContent = Math.floor(obj.v) + suffix; }
          });
        }
      }, 45);
    });
  }, []);

  // Canvas: living starfield with depth + mouse gravity + shooting stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Particle {
      x: number; y: number;
      baseVx: number; baseVy: number;
      vx: number; vy: number;
      r: number; layer: number;
    }

    let nw = 0, nh = 0;
    let nodes: Particle[] = [];
    let mouseX = -9999, mouseY = -9999;
    let shootingStar: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);

    const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

    const resize = () => {
      nw = canvas.width = window.innerWidth;
      nh = canvas.height = window.innerHeight;
      nodes = [];
      const count = Math.floor((nw * nh) / 26000);
      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.55 ? 0 : 1;
        nodes.push({
          x: Math.random() * nw, y: Math.random() * nh,
          baseVx: (Math.random() - .5) * (layer ? 0.35 : 0.15),
          baseVy: (Math.random() - .5) * (layer ? 0.35 : 0.15),
          vx: 0, vy: 0,
          r: layer ? 1.6 + Math.random() * 1.2 : 0.8 + Math.random() * 0.6,
          layer
        });
      }
    };

    const maybeSpawnStar = () => {
      if (shootingStar) return;
      if (Math.random() < 0.0025) {
        const fromLeft = Math.random() < 0.5;
        shootingStar = {
          x: fromLeft ? -50 : nw + 50, y: Math.random() * nh * 0.5,
          vx: (fromLeft ? 1 : -1) * 9, vy: 4.5, life: 1
        };
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, nw, nh);
      const rgb = isDark() ? "255,143,77" : "255,123,41";

      nodes.forEach(n => {
        const dx = n.x - mouseX, dy = n.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let gx = 0, gy = 0;
        if (dist < 140) {
          const force = (1 - dist / 140) * 0.35;
          gx = (dx / (dist || 1)) * force;
          gy = (dy / (dist || 1)) * force;
        }
        n.vx += (n.baseVx - n.vx) * 0.02 + gx * 0.05;
        n.vy += (n.baseVy - n.vy) * 0.02 + gy * 0.05;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = nw + 10; if (n.x > nw + 10) n.x = -10;
        if (n.y < -10) n.y = nh + 10; if (n.y > nh + 10) n.y = -10;
      });

      const near = nodes.filter(n => n.layer === 1);
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const dx = near[i].x - near[j].x, dy = near[i].y - near[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(${rgb},${0.09 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(near[i].x, near[i].y); ctx.lineTo(near[j].x, near[j].y); ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        ctx.fillStyle = `rgba(${rgb},${n.layer ? 0.55 : 0.28})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      });

      maybeSpawnStar();
      if (shootingStar) {
        const s = shootingStar;
        s.x += s.vx; s.y += s.vy; s.life -= 0.02;
        if (s.life <= 0 || s.x < -100 || s.x > nw + 100 || s.y > nh + 100) {
          shootingStar = null;
        } else {
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 8, s.y - s.vy * 8);
          grad.addColorStop(0, `rgba(${rgb},${s.life})`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.strokeStyle = grad; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 8, s.y - s.vy * 8); ctx.stroke();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", () => { resize(); });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const modules = [
    { id: "about", num: "01", title: "About", desc: "Who I am, how I think, what I care about." },
    { id: "stack", num: "02", title: "Stack", desc: "The tools I actually reach for." },
    { id: "work", num: "03", title: "Work", desc: "Things I've built and shipped." },
    { id: "experience", num: "04", title: "Experience", desc: "How I got here." },
  ];

  return (
    <div ref={sectionRef} className="tab-panel active" id="home" data-panel>
      <canvas ref={canvasRef} id="home-canvas" />
      <div className="panel-inner">
        <div className="hero-eyebrow reveal-item">
          <span className="dot" />
          {profile.availabilityBadge || "AVAILABLE FOR BACKEND · AI ENGINEERING ROLES"}
        </div>

        <h1 className="hero-name reveal-item">{profile.name || "Mohit Lamba"}</h1>

        <div className="hero-role-line reveal-item">
          <span>{typedRole}</span>
          <span className="cursor-blink" />
        </div>

        <p className="hero-tag reveal-item">
          {profile.heroTag || "I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3am."}
        </p>

        <div className="hero-cta reveal-item">
          <button className="btn btn-primary" onClick={() => onTabChange("work")}>See what I&apos;ve shipped</button>
          <button className="btn btn-ghost" onClick={() => onTabChange("contact")}>Get in touch</button>
        </div>

        <div className="dash-strip reveal-item">
          <div className="dash-stat">
            <div className="num" data-count={stats.githubContributions || 2770} data-suffix="">0</div>
            <div className="lbl">GITHUB CONTRIBUTIONS</div>
          </div>
          <div className="dash-stat">
            <div className="num" data-count={stats.totalCommits || 1500} data-suffix="+">0</div>
            <div className="lbl">TOTAL COMMITS</div>
          </div>
          <div className="dash-stat">
            <div className="num" data-count="1" data-suffix="M+">0</div>
            <div className="lbl">USERS ON SYSTEMS SHIPPED</div>
          </div>
          <div className="dash-stat">
            <div className="num" data-count={stats.publicRepos || 56} data-suffix="">0</div>
            <div className="lbl">PUBLIC REPOS</div>
          </div>
        </div>

        <div className="modules reveal-item">
          {modules.map(m => (
            <div key={m.id} className="module" onClick={() => onTabChange(m.id)}>
              <div className="mnum">{m.num}</div>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
