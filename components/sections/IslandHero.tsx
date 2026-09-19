"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import gsap from "gsap";

interface IslandHeroProps {
  data: PortfolioData;
  onTabChange: (tab: string) => void;
}

function countUp(el: HTMLElement, target: number, suffix: string) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.3,
    ease: "power2.out",
    onUpdate: () => { el.textContent = Math.floor(obj.v) + suffix; },
  });
}

export default function IslandHero({ data, onTabChange }: IslandHeroProps) {
  const { profile, stats } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typedRole, setTypedRole] = useState("Backend Engineer");

  const roles = ["Backend Engineer", "AI / Agentic Systems Builder", "Full Stack Developer"];

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

  // Animate reveal items
  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".reveal-item");
    items?.forEach((el, i) => {
      setTimeout(() => el.classList.add("in"), i * 80);
    });
    // Animate counters
    sectionRef.current?.querySelectorAll("[data-count]").forEach((el) => {
      const htmlEl = el as HTMLElement;
      countUp(htmlEl, parseInt(htmlEl.dataset.count || "0"), htmlEl.dataset.suffix || "");
    });
  }, []);

  // Network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let nw = 0, nh = 0;

    const resize = () => {
      nw = canvas.width = window.innerWidth;
      nh = canvas.height = window.innerHeight;
      nodes = [];
      const count = Math.floor((nw * nh) / 32000);
      for (let i = 0; i < count; i++) {
        nodes.push({ x: Math.random() * nw, y: Math.random() * nh, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, nw, nh);
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const rgb = isDark ? "53,231,199" : "12,142,122";
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > nw) n.vx *= -1; if (n.y < 0 || n.y > nh) n.vy *= -1; });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(${rgb},${0.10 * (1 - dist / 130)})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${rgb},0.45)`;
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2); ctx.fill(); });
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div ref={sectionRef} className="tab-panel active" id="home" data-panel>
      <canvas ref={canvasRef} id="home-canvas" />
      <div className="panel-inner">
        {/* Eyebrow */}
        <div className="hero-eyebrow reveal-item">
          <span className="dot" />
          {profile.availabilityBadge || "AVAILABLE FOR BACKEND · AI ENGINEERING ROLES"}
        </div>

        {/* Name */}
        <h1 className="hero-name reveal-item">{profile.name || "Mohit Lamba"}</h1>

        {/* Typing role */}
        <div className="hero-role-line reveal-item">
          <span>{typedRole}</span>
          <span className="cursor-blink" />
        </div>

        {/* Tagline */}
        <p className="hero-tag reveal-item">
          {profile.heroTag || "I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3am."}
        </p>

        {/* CTAs */}
        <div className="hero-cta reveal-item">
          <button className="btn btn-primary" onClick={() => onTabChange("work")}>
            See what I&apos;ve shipped
          </button>
          <button className="btn btn-ghost" onClick={() => onTabChange("contact")}>
            Get in touch
          </button>
        </div>

        {/* Dash strip stats */}
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
            <div className="num" data-count={1} data-suffix="M+">0</div>
            <div className="lbl">USERS ON SYSTEMS SHIPPED</div>
          </div>
          <div className="dash-stat">
            <div className="num" data-count={stats.publicRepos || 56} data-suffix="">0</div>
            <div className="lbl">PUBLIC REPOS</div>
          </div>
        </div>

        {/* Module cards */}
        <div className="modules reveal-item">
          {[
            { id: "about", num: "01", title: "About", desc: "Who I am, how I think, what I care about." },
            { id: "stack", num: "02", title: "Stack", desc: "The tools I actually reach for." },
            { id: "work", num: "03", title: "Work", desc: "Things I've built and shipped." },
            { id: "experience", num: "04", title: "Experience", desc: "How I got here." },
          ].map((m) => (
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
