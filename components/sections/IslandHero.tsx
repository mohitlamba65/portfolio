"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { IslandAboutContent } from "@/components/sections/IslandAbout";
import { RESUME_VIEWER_PATH } from "@/lib/resume-viewer";
import { DEFAULT_HERO_ROLES, resolveHeroStatCards } from "@/lib/hero-stat-cards";
import { HeroDashStatStrip } from "@/components/shared/HeroStatDisplay";
import { ContactIcon, FileDocumentIcon, ShippedIcon } from "@/components/ui/contact-icons";
import gsap from "gsap";

interface IslandHeroProps {
  data: PortfolioData;
  onTabChange: (tab: string) => void;
}

function heroTagLines(profile: PortfolioData["profile"]): string[] {
  const lines = profile.heroTagLines?.map((l) => l.trim()).filter(Boolean);
  if (lines?.length) return lines;
  if (profile.heroTag?.trim()) {
    return profile.heroTag
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [
    "I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3 am.",
  ];
}

export default function IslandHero({ data, onTabChange }: IslandHeroProps) {
  const { profile, stats } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const roles = useMemo(
    () => (profile.heroRoles?.length ? profile.heroRoles : DEFAULT_HERO_ROLES),
    [profile.heroRoles]
  );
  const [typedRole, setTypedRole] = useState(roles[0] ?? "Backend Engineer");
  const resolvedStats = useMemo(() => resolveHeroStatCards(stats), [stats]);
  const tagLines = useMemo(() => heroTagLines(profile), [profile]);

  useEffect(() => {
    if (!roles.length) return;
    let ri = 0;
    let ci = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    setTypedRole("");
    const loop = () => {
      const word = roles[ri] ?? "";
      if (!word) return;
      if (!deleting) {
        ci++;
        setTypedRole(word.slice(0, ci));
        if (ci === word.length) {
          deleting = true;
          timeout = setTimeout(loop, 1400);
          return;
        }
      } else {
        ci--;
        setTypedRole(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      timeout = setTimeout(loop, deleting ? 35 : 70);
    };
    timeout = setTimeout(loop, 900);
    return () => clearTimeout(timeout);
  }, [roles]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".hero-block .reveal-item, .hero-block .module").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });

    el.querySelectorAll<HTMLElement>(".dash-strip [data-count]").forEach((target) => {
      if (target.dataset.done) return;
      target.dataset.done = "1";
      const targetNum = parseInt(target.dataset.count || "0", 10);
      const suffix = target.dataset.suffix || "";
      const digits = Math.max(1, String(targetNum).length);
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
  }, [resolvedStats]);

  const modules = [
    { id: "work", num: "01", title: "Projects", desc: "Stack highlights and shipped systems." },
    { id: "experience", num: "02", title: "Experience", desc: "How I got here." },
    {
      id: "resume",
      num: "03",
      title: "Resume",
      desc: "Open PDF in a new tab.",
      external: RESUME_VIEWER_PATH,
    },
  ] as const;

  const scrollToAbout = () => {
    document.getElementById("about-on-home")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={sectionRef} className="tab-panel active" id="home" data-panel>
      <div className="panel-inner">
        <div className="hero-block">
          <div className="hero-eyebrow reveal-item">
            <span className="dot" />
            {profile.availabilityBadge || "AVAILABLE FOR BACKEND · AI ENGINEERING ROLES"}
          </div>

          <h1 className="hero-name reveal-item">{profile.name || "Mohit Lamba"}</h1>

          <div className="hero-role-line reveal-item">
            <span>{typedRole}</span>
            <span className="cursor-blink" />
          </div>

          <div className="hero-tag-block reveal-item">
            {tagLines.map((line, i) => (
              <p key={i} className="hero-tag">
                {line}
              </p>
            ))}
          </div>

          <div className="hero-cta reveal-item">
            <button className="btn btn-primary" onClick={() => onTabChange("work")}>
              <ShippedIcon />
              See what I&apos;ve shipped
            </button>
            <a href={RESUME_VIEWER_PATH} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <FileDocumentIcon />
              View resume
            </a>
            <button className="btn btn-ghost" onClick={() => onTabChange("contact")}>
              <ContactIcon />
              Get in touch
            </button>
          </div>

          <HeroDashStatStrip stats={resolvedStats} />

          <div className="modules reveal-item">
            <div className="module" onClick={scrollToAbout}>
              <div className="mnum">↳</div>
              <h4>About me</h4>
              <p>Scroll to who I am and how I work.</p>
            </div>
            {modules.map((m) => (
              <div
                key={m.id}
                className="module"
                onClick={() =>
                  "external" in m && m.external
                    ? window.open(m.external, "_blank", "noopener,noreferrer")
                    : onTabChange(m.id)
                }
              >
                <div className="mnum">{m.num}</div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <IslandAboutContent profile={profile} stats={stats} />
      </div>
    </div>
  );
}
