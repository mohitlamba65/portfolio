"use client";

import { useEffect, useRef } from "react";
import { Project } from "@/types/portfolio";

interface IslandWorkProps {
  projects: Project[];
}

export default function IslandWork({ projects }: IslandWorkProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
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

            const dotColor =
              proj.status === "building" || proj.status === "private"
                ? "var(--amber)"
                : "var(--cyan)";

            return (
              <div key={proj.id} className="proj-card reveal-item">
                <div className="ghost-num">{String(i + 1).padStart(3, "0")}</div>

                {/* Top row */}
                <div className="proj-top">
                  <div>
                    <span className="proj-eyebrow">
                      {proj.eyebrow || `PROJECT ${i + 1}`}
                    </span>
                  </div>
                  <div className={statusClass}>
                    <span className="dotlive" style={{ background: dotColor }} />
                    {proj.statusLabel || (proj.status === "live" ? "LIVE" : proj.status === "building" ? "BUILDING" : "PRIVATE")}
                  </div>
                </div>

                <h3>{proj.title}</h3>
                <div className="proj-provenance">{proj.provenance || ""}</div>
                <p className="desc">{proj.description}</p>

                {/* Tags */}
                {proj.techStack?.length > 0 && (
                  <div className="proj-tags">
                    {proj.techStack.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                )}

                {/* Bottom */}
                <div className="proj-bottom">
                  {proj.heroStat ? (
                    <div className="proj-herostat">
                      <div className="n">{proj.heroStat.value}</div>
                      <div className="l">{proj.heroStat.label}</div>
                    </div>
                  ) : <div />}

                  {proj.githubUrl ? (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="proj-link">
                      {proj.status === "building" ? "Follow along on GitHub" : "View repository"}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
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
