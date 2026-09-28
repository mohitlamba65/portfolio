"use client";

import { useEffect, useMemo, useRef } from "react";
import { Profile, SystemStats } from "@/types/portfolio";
import {
  resolveAboutPhotoCard,
  resolveAboutPrinciples,
  TRAIT_ACCENT_COLORS,
} from "@/lib/about-sidebar-defaults";
import { resolveHeroStatCards } from "@/lib/hero-stat-cards";
import { HeroAboutStatPanel } from "@/components/shared/HeroStatDisplay";
import gsap from "gsap";

interface IslandAboutContentProps {
  profile: Profile;
  stats: SystemStats;
}

const bios = [
  `I'm a full-stack developer who ended up specializing in the <em>harder half</em> of the stack: <strong>backend systems and AI infrastructure</strong>. I like problems where the interesting part isn't the UI — it's what happens after the request leaves the browser.`,
  `At <strong>EY</strong>, I helped build an EPFO WhatsApp engagement platform supporting <strong>1M+ active campaign users</strong> — the kind of scale where every shortcut you take in the backend eventually finds you. That's where I learned to care about reliability, not just features.`,
  `More recently, at <strong>Mednex</strong>, I helped build an autonomous GTM AI platform now running campaigns for <strong>50+ B2B clients</strong> across thousands of leads — agentic orchestration, RAG, and list-building pipelines, not just a thin LLM wrapper.`,
  `I design around <strong>SOLID principles</strong> and layered boundaries — Clean and Hexagonal Architecture — because six months from now, someone (often me) has to change this code without fear.`,
];

/** About block embedded on the home panel (not a separate tab). */
export function IslandAboutContent({ profile, stats }: IslandAboutContentProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resolvedStats = useMemo(() => resolveHeroStatCards(stats), [stats]);
  const photoCard = useMemo(() => resolveAboutPhotoCard(profile), [profile]);
  const principles = useMemo(() => resolveAboutPrinciples(profile), [profile]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const counters = el.querySelectorAll<HTMLElement>(".stat-panel [data-count]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
            const rnd = Array.from({ length: digits })
              .map(() => Math.floor(Math.random() * 10))
              .join("");
            target.textContent = rnd + suffix;
            if (ticks >= max) {
              clearInterval(id);
              target.style.opacity = "1";
              const obj = { v: 0 };
              gsap.to(obj, {
                v: targetNum,
                duration: 0.9,
                ease: "power2.out",
                onUpdate: () => {
                  target.textContent = Math.floor(obj.v) + suffix;
                },
              });
            }
          }, 45);
        });
      },
      { threshold: 0.1 }
    );

    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [resolvedStats]);

  useEffect(() => {
    const card = document.getElementById("op-card");
    const frame = document.getElementById("op-frame");
    if (!card || !frame) return;

    const xTo = gsap.quickTo(frame, "rotationY", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(frame, "rotationX", { duration: 0.5, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      xTo(px * 14);
      yTo(-py * 14);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const paragraphs =
    profile.bioParagraphs?.length > 0 ? profile.bioParagraphs : null;

  return (
    <div ref={sectionRef} id="about-on-home" className="home-about-block">
      <div className="kicker">ABOUT</div>
      <div className="grid2">
        <div id="about-text">
          {paragraphs
            ? paragraphs.map((text, i) => (
                <p key={i} className="reveal-item">
                  {text}
                </p>
              ))
            : bios.map((p, i) => (
                <p key={i} className="reveal-item" dangerouslySetInnerHTML={{ __html: p }} />
              ))}

          <HeroAboutStatPanel stats={resolvedStats} />
        </div>

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
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
            <div className="op-meta-block">
              <div className="op-meta">
                <span className="op-dot"></span>
                {photoCard.metaLine1}
              </div>
              {photoCard.metaLine2 ? (
                <div className="op-meta op-meta-secondary">{photoCard.metaLine2}</div>
              ) : null}
            </div>
          </div>

          <div className="trait-row">
            {photoCard.traits?.map((trait, i) => (
              <span
                key={`${trait}-${i}`}
                className="trait"
                style={
                  { "--tc": TRAIT_ACCENT_COLORS[i % TRAIT_ACCENT_COLORS.length] } as React.CSSProperties
                }
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="principles">
        {principles.map((p) => (
          <div key={p.code} className="principle reveal-item">
            {p.code ? <div className="pcode">{p.code}</div> : null}
            <h4>{p.title}</h4>
            {p.desc ? <p>{p.desc}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
