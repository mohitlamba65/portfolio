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

  const modules = [
    { id: "about", num: "01", title: "About", desc: "Who I am, how I think, what I care about." },
    { id: "stack", num: "02", title: "Stack", desc: "The tools I actually reach for." },
    { id: "work", num: "03", title: "Work", desc: "Things I've built and shipped." },
    { id: "experience", num: "04", title: "Experience", desc: "How I got here." },
  ];

  return (
    <div ref={sectionRef} className="tab-panel active" id="home" data-panel>
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
