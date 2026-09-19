"use client";

import { useEffect, useRef } from "react";
import { Profile, SystemStats } from "@/types/portfolio";
import gsap from "gsap";

interface IslandAboutProps {
  profile: Profile;
  stats: SystemStats;
}

const bios = [
  `I'm a full-stack developer who ended up specializing in the <em>harder half</em> of the stack: <strong>backend systems and AI infrastructure</strong>. I like problems where the interesting part isn't the UI — it's what happens after the request leaves the browser.`,
  `At <strong>EY</strong>, I helped build an EPFO WhatsApp engagement platform supporting <strong>1M+ active campaign users</strong> — the kind of scale where every shortcut you take in the backend eventually finds you. That's where I learned to care about reliability, not just features.`,
  `More recently, at <strong>Mednex</strong>, I helped build an autonomous GTM AI platform now running campaigns for <strong>50+ B2B clients</strong> across thousands of leads — agentic orchestration, RAG, and list-building pipelines, not just a thin LLM wrapper.`,
  `I design around <strong>SOLID principles</strong> and layered boundaries — Clean and Hexagonal Architecture — because six months from now, someone (often me) has to change this code without fear.`,
];

const principles = [
  { code: "01", title: "SOLID", desc: "Every class has one reason to change. Makes large systems survivable." },
  { code: "02", title: "Clean Architecture", desc: "Business logic that doesn't know or care what database it's talking to." },
  { code: "03", title: "Hexagonal Architecture", desc: "Ports and adapters, so swapping a provider is a config change, not a rewrite." },
  { code: "04", title: "System Design", desc: "Thinking in failure modes and load before writing the first line." },
];

export default function IslandAbout({ profile, stats }: IslandAboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Reveal items
    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
    el.querySelectorAll<HTMLElement>(".tl-item").forEach(item => item.classList.add("in"));
    const timeline = el.querySelector<HTMLElement>("#about-timeline");
    if (timeline) timeline.style.setProperty("--tl-progress", "100%");
  }, []);

  // Animate stat counters when they enter the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const counters = el.querySelectorAll<HTMLElement>("[data-count]");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target = entry.target as HTMLElement;
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
            gsap.to(obj, { v: targetNum, duration: 0.9, ease: "power2.out", onUpdate: () => { target.textContent = Math.floor(obj.v) + suffix; } });
          }
        }, 45);
      });
    }, { threshold: 0.1 });

    counters.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  // HUD tilt
  useEffect(() => {
    const card = document.getElementById("op-card");
    const frame = document.getElementById("op-frame");
    if (!card || !frame) return;

    const xTo = gsap.quickTo(frame, "rotationY", { duration: .5, ease: "power3" });
    const yTo = gsap.quickTo(frame, "rotationX", { duration: .5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      xTo(px * 14);
      yTo(-py * 14);
    };
    const onLeave = () => { xTo(0); yTo(0); };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={sectionRef} className="tab-panel" id="about" data-panel>
      <div className="panel-inner">
        <div className="kicker">ABOUT</div>
        <div className="grid2">
          {/* Left: bio text + stat panel */}
          <div id="about-text">
            {bios.map((p, i) => (
              <p key={i} className="reveal-item" dangerouslySetInnerHTML={{ __html: p }} />
            ))}

            <div className="stat-panel">
              <div className="stat-row">
                <span className="stat-label">EPFO PLATFORM USERS (EY)</span>
                <span className="stat-num" data-count="1" data-suffix="M+">0</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">B2B CLIENTS ON GTM PLATFORM</span>
                <span className="stat-num" data-count={stats.b2bClients || 50} data-suffix="+">0</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">GITHUB CONTRIBUTIONS</span>
                <span className="stat-num" data-count={stats.githubContributions || 2770} data-suffix="">0</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">PUBLIC REPOS</span>
                <span className="stat-num" data-count={stats.publicRepos || 56} data-suffix="">0</span>
              </div>
            </div>
          </div>

          {/* Right: HUD operator card + traits */}
          <div className="about-side">
            <div className="op-card" id="op-card">
              <div className="op-frame" id="op-frame">
                <span className="op-corner tl"></span>
                <span className="op-corner tr"></span>
                <span className="op-corner bl"></span>
                <span className="op-corner br"></span>
                <div className="op-scanline"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profilePhotoUrl || ""}
                  alt={profile.name}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="op-photo-fallback">
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              <div className="op-meta">
                <span className="op-dot"></span>
                OPERATOR: {profile.name.toUpperCase()} — STATUS: ACTIVE
              </div>
            </div>

            <div className="trait-row">
              <span className="trait" style={{ "--tc": "var(--cyan)" } as React.CSSProperties}>Debugs at 2am</span>
              <span className="trait" style={{ "--tc": "var(--amber)" } as React.CSSProperties}>Writes tests before demos</span>
              <span className="trait" style={{ "--tc": "var(--violet)" } as React.CSSProperties}>Reads the RFC</span>
              <span className="trait" style={{ "--tc": "var(--pink)" } as React.CSSProperties}>Ships boring code, on purpose</span>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="principles">
          {principles.map(p => (
            <div key={p.code} className="principle reveal-item">
              <div className="pcode">{p.code}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
