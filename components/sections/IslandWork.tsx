"use client";

import { useEffect, useRef } from "react";
import { Project } from "@/types/portfolio";
import gsap from "gsap";

interface IslandWorkProps {
  projects: Project[];
}

export default function IslandWork({ projects }: IslandWorkProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>(".reveal-item, .proj-card");
    gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, stagger: .05, ease: "power2.out", delay: .05 });

    // Animate stat counters
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
          gsap.to(obj, { v: targetNum, duration: 0.9, ease: "power2.out", onUpdate: () => { target.textContent = Math.floor(obj.v) + suffix; } });
        }
      }, 45);
    });
  }, []);

  return (
    <div ref={sectionRef} className="tab-panel" id="work" data-panel>
      <div className="panel-inner">
        <div className="kicker">WORK</div>
        <h2 className="h2 reveal-item">Things I&apos;ve built and run.</h2>

        <div className="proj-list">
          {projects.map((proj, i) => {
            const statusClass =
              proj.status === "private"
                ? "proj-status private"
                : proj.status === "building"
                ? "proj-status building"
                : "proj-status";

            // Parse hero stat for data-count
            let countVal = 0;
            let countSuffix = "";
            if (proj.heroStat) {
              const match = proj.heroStat.value.match(/^([\d.]+)(.*)$/);
              if (match) {
                countVal = parseFloat(match[1]);
                countSuffix = match[2];
              }
            }

            return (
              <div key={proj.id} className="proj-card reveal-item">
                <div className="ghost-num">{String(i + 1).padStart(3, "0")}</div>

                <div className="proj-top">
                  <div>
                    <span className="proj-eyebrow">{proj.eyebrow || `PROJECT ${i + 1}`}</span>
                  </div>
                  <div className={statusClass}>
                    <span className="dotlive"></span>
                    {proj.statusLabel || (proj.status === "live" ? "LIVE" : proj.status === "building" ? "BUILDING" : "PRIVATE")}
                  </div>
                </div>

                <h3>{proj.title}</h3>
                <div className="proj-provenance">{proj.provenance || ""}</div>
                <p className="desc">{proj.description}</p>

                {proj.techStack?.length > 0 && (
                  <div className="proj-tags">
                    {proj.techStack.map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                <div className="proj-bottom">
                  {proj.heroStat ? (
                    <div className="proj-herostat">
                      <div
                        className="n stat-num"
                        data-count={countVal}
                        data-suffix={countSuffix}
                      >
                        0
                      </div>
                      <div className="l">{proj.heroStat.label}</div>
                    </div>
                  ) : <div />}

                  {proj.githubUrl ? (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                      {proj.status === "building" ? "Follow along on GitHub" : "View repository"}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </a>
                  ) : proj.status === "private" ? (
                    <span className="proj-link" style={{ color: "var(--text-faint)" }}>
                      Source is proprietary — happy to walk through the architecture
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
