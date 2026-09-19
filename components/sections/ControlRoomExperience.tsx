"use client";

import { useEffect, useRef } from "react";
import { Award, Calendar, MapPin } from "lucide-react";

export default function ControlRoomExperience({ experiences }: { experiences: any[] }) {
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
      id="experience"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[var(--line)] relative"
    >
      <div className="section-inner">
        {/* Section Header */}
        <div className="reveal flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--cyan)] uppercase mb-4">
          <span className="w-4 h-[1px] bg-[var(--cyan)]" />
          <span>04 / EXECUTION_LOG</span>
        </div>

        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[var(--text)] mb-4 tracking-tight">
          How I got here & where I've scaled.
        </h2>
        <p className="reveal text-base sm:text-lg text-[var(--text-dim)] font-light max-w-2xl mb-12">
          Engineering timeline across high-throughput messaging infrastructure, distributed databases, and agentic AI systems.
        </p>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 space-y-12">
          {/* Vertical Timeline Guide Line */}
          <div className="absolute left-[7px] sm:left-[11px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[var(--cyan)] via-[var(--line)] to-[var(--line)] opacity-60" />

          {experiences.map((exp, i) => (
            <div key={exp.id || i} className="reveal relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[30px] sm:-left-[38px] top-1.5 w-5 h-5 rounded-full bg-[var(--bg)] border-2 border-[var(--cyan)] flex items-center justify-center shadow-[0_0_10px_rgba(53,231,199,0.5)] z-10 transition-transform group-hover:scale-125">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)]" />
              </div>

              {/* Experience Card */}
              <div className="p-6 sm:p-8 bg-[var(--bg-panel)] border border-[var(--line)] rounded-[var(--radius)] hover:border-[var(--cyan)]/60 transition-all duration-300 shadow-lg shadow-black/20">
                {/* Top Metadata Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-display font-semibold text-[var(--text)] mb-1 group-hover:text-[var(--cyan)] transition-colors">
                      {exp.role}
                    </h3>
                    <div className="font-mono text-sm text-[var(--cyan)] font-semibold">
                      {exp.company}
                    </div>
                  </div>

                  {exp.highlightMetric && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
                      <Award size={13} />
                      <span>{exp.highlightMetric}</span>
                    </div>
                  )}
                </div>

                {/* Sub Metadata (Period & Location) */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-faint)] mb-5">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {exp.period}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {exp.location}
                    </span>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-sm sm:text-base text-[var(--text-dim)] font-light leading-relaxed mb-6">
                    {exp.description}
                  </p>
                )}

                {/* Bullet Points */}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-3 mb-6 font-mono text-xs sm:text-sm text-[var(--text-dim)]">
                    {exp.bullets.map((bullet: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-[var(--cyan)] font-bold flex-shrink-0">&gt;</span>
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech Stack Chips */}
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--line)]">
                    <span className="text-[11px] font-mono uppercase text-[var(--text-faint)] mr-2">
                      Stack:
                    </span>
                    {exp.techStack.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[var(--bg-panel-2)] border border-[var(--line)] font-mono text-xs text-[var(--text-dim)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

