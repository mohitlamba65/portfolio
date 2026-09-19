"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, ArrowUpRight, Code2 } from "lucide-react";

export default function ControlRoomProjects({ projects }: { projects: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("in");
              }, i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[var(--line)] relative"
    >
      <div className="section-inner">
        {/* Section Header */}
        <div className="reveal flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--cyan)] uppercase mb-4">
          <span className="w-4 h-[1px] bg-[var(--cyan)]" />
          <span>03 / SELECTED_PROJECTS</span>
        </div>

        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[var(--text)] mb-12 tracking-tight">
          Things I've built and run in production.
        </h2>

        {/* Project Cards List */}
        <div className="flex flex-col gap-8">
          {projects.map((proj, i) => {
            const isLive = proj.liveUrl || proj.status === "live";
            const isPrivate = !proj.githubUrl && !proj.liveUrl;

            return (
              <div
                key={proj.id || i}
                className="reveal bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)] p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-300 hover:border-[var(--cyan)]/60 shadow-lg shadow-black/20 group"
              >
                {/* Subtle cyber background grid accent on right */}
                <div
                  className="absolute top-0 right-0 h-full w-32 opacity-10 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, var(--cyan) 0 1px, transparent 1px 16px)",
                  }}
                />

                {/* Top status header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="font-mono text-[11px] text-[var(--text-faint)] uppercase tracking-wider">
                    {proj.category
                      ? `SYSTEM // ${proj.category.toUpperCase()}`
                      : "ARCHITECTURE // SYSTEM"}
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-[var(--bg-panel-2)] font-mono text-[11px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isPrivate
                          ? "bg-[var(--amber)] shadow-[0_0_6px_rgba(255,166,69,0.6)]"
                          : "bg-[var(--cyan)] shadow-[0_0_6px_rgba(53,231,199,0.6)] animate-pulse"
                      }`}
                    />
                    <span className="text-[var(--text-dim)] uppercase">
                      {isPrivate ? "PRODUCTION · PROPRIETARY" : "DEPLOYED · ACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl sm:text-3xl font-display font-semibold text-[var(--text)] mb-4 group-hover:text-[var(--cyan)] transition-colors">
                  {proj.title}
                </h3>

                <p className="text-sm sm:text-base text-[var(--text-dim)] font-light leading-relaxed max-w-3xl mb-6">
                  {proj.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {proj.techStack?.map((tech: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[var(--bg-panel-2)] border border-[var(--line)] font-mono text-xs text-[var(--text-dim)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[var(--line)] font-mono text-xs">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[var(--cyan)] hover:underline font-semibold"
                    >
                      <Code2 size={14} />
                      <span>View repository</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors"
                    >
                      <ExternalLink size={14} />
                      <span>Live system demo</span>
                      <ArrowUpRight size={14} />
                    </a>
                  )}

                  {isPrivate && (
                    <span className="text-[var(--text-faint)]">
                      Proprietary architecture — happy to walk through design & telemetry
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

