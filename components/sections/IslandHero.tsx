"use client";

import { useEffect, useRef, useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { IslandAboutContent } from "@/components/sections/IslandAbout";
import { RESUME_VIEWER_PATH } from "@/lib/resume-viewer";
import { ContactIcon, FileDocumentIcon, ShippedIcon } from "@/components/ui/contact-icons";
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

  useEffect(() => {
    let ri = 0,
      ci = 0,
      deleting = false;
    let timeout: ReturnType<typeof setTimeout>;
    const loop = () => {
      const word = roles[ri];
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
  }, []);

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
  }, []);

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

          <p className="hero-tag reveal-item">
            {profile.heroTag ||
              "I build the parts of a product most people never see — the pipelines, the agents, the systems that keep running at 3 am."}
          </p>

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

          <div className="dash-strip reveal-item">
            <div className="dash-stat">
              <div className="num" data-count={stats.githubContributions ?? 806} data-suffix="">
                0
              </div>
              <div className="lbl">TOTAL CONTRIBUTIONS</div>
            </div>
            <div className="dash-stat">
              <div className="num" data-count={stats.totalCommits ?? 150} data-suffix="+">
                0
              </div>
              <div className="lbl">COMMITS (LAST YEAR)</div>
            </div>
            <div className="dash-stat">
              <div className="num" data-count="1" data-suffix="M+">
                0
              </div>
              <div className="lbl">USERS ON SYSTEMS SHIPPED</div>
            </div>
            <div className="dash-stat">
              <div className="num" data-count={stats.publicRepos ?? 22} data-suffix="">
                0
              </div>
              <div className="lbl">PUBLIC REPOS</div>
            </div>
          </div>

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
