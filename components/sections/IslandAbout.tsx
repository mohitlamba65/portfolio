"use client";

import { useEffect, useRef, useState } from "react";
import { Profile, SystemStats } from "@/types/portfolio";
import gsap from "gsap";

interface IslandAboutProps {
  profile: Profile;
  stats: SystemStats;
}

export default function IslandAbout({ profile, stats }: IslandAboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ users: 0, contribs: 0, commits: 0, repos: 0 });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Reveal items
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });

    // Timeline dots
    el.querySelectorAll(".tl-item").forEach((item) => item.classList.add("in"));
    const timeline = el.querySelector<HTMLElement>("#about-timeline");
    if (timeline) timeline.style.setProperty("--tl-progress", "100%");

    // Animate counters
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setCounts({
        users: Math.floor(progress * 1),
        contribs: Math.floor(progress * (stats.githubContributions || 2770)),
        commits: Math.floor(progress * (stats.totalCommits || 1500)),
        repos: Math.floor(progress * (stats.publicRepos || 56)),
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [stats]);

  const bios = profile.bioParagraphs?.length
    ? profile.bioParagraphs
    : [
        "I'm a full-stack developer who ended up specializing in the harder half of the stack: backend systems and AI infrastructure. I like problems where the interesting part isn't the UI — it's what happens after the request leaves the browser.",
        "At EY, I helped build an EPFO WhatsApp engagement platform supporting 1M+ active campaign users — the kind of scale where every shortcut you take in the backend eventually finds you.",
        "More recently, at Mednex, I helped build an autonomous GTM AI platform now running campaigns for 50+ B2B clients — agentic orchestration, RAG, and list-building pipelines.",
        "I design around SOLID principles and layered boundaries — Clean and Hexagonal Architecture — because six months from now, someone (often me) has to change this code without fear.",
      ];

  const principles = [
    { code: "01", title: "SOLID", desc: "Every class has one reason to change. Makes large systems survivable." },
    { code: "02", title: "Clean Architecture", desc: "Business logic that doesn't know or care what database it's talking to." },
    { code: "03", title: "Hexagonal Architecture", desc: "Ports and adapters, so swapping a provider is a config change, not a rewrite." },
    { code: "04", title: "System Design", desc: "Thinking in failure modes and load before writing the first line." },
  ];

  return (
    <div ref={sectionRef} className="tab-panel" id="about" data-panel>
      <div className="panel-inner">
        <div className="kicker">ABOUT</div>

        <div className="grid2">
          {/* Left: bio text */}
          <div id="about-text">
            {profile.profilePhotoUrl && (
              <div className="reveal-item in mb-8 relative inline-block group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--cyan)]/40 to-[var(--violet)]/40 blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
                <img
                  src={profile.profilePhotoUrl}
                  alt={profile.name}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover border-2 border-[var(--cyan)]/50 shadow-2xl bg-[var(--bg-panel)]"
                />
              </div>
            )}
            {bios.map((p, i) => (
              <p
                key={i}
                className="reveal-item"
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>

          {/* Right: stat panel */}
          <div className="stat-panel reveal-item">
            <div className="stat-row">
              <span className="stat-label">EPFO PLATFORM USERS (EY)</span>
              <span className="stat-num">{counts.users}M+</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">B2B CLIENTS ON GTM PLATFORM</span>
              <span className="stat-num">{stats.b2bClients || 50}+</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">GITHUB CONTRIBUTIONS</span>
              <span className="stat-num">{counts.contribs.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">PUBLIC REPOS</span>
              <span className="stat-num">{counts.repos}</span>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="principles">
          {principles.map((p) => (
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
