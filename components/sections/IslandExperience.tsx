"use client";

import { useEffect, useRef } from "react";
import { Skill, WorkExperience } from "@/types/portfolio";
import TechChipGrid from "@/components/shared/TechChipGrid";
import { companyMonogram } from "@/lib/company-monogram";
import gsap from "gsap";

interface IslandExperienceProps {
  experiences: WorkExperience[];
  skills: Skill[];
  defaultLocation?: string;
}

export default function IslandExperience({
  experiences,
  skills,
  defaultLocation,
}: IslandExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });

    const items = el.querySelectorAll<HTMLElement>(".tl-item");
    items.forEach((i) => i.classList.add("in"));
    const timeline = el.querySelector<HTMLElement>(".timeline");
    if (timeline) {
      setTimeout(() => timeline.style.setProperty("--tl-progress", "100%"), 200);
    }

    const cards = el.querySelectorAll<HTMLElement>(".exp-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.08 }
    );
  }, [experiences]);

  return (
    <div ref={sectionRef} className="tab-panel" id="experience" data-panel>
      <div className="panel-inner">
        <div className="kicker">EXPERIENCE</div>
        <h2 className="h2 reveal-item">How I got here.</h2>
        <p className="reveal-item work-intro">
          Roles where backend, AI, and reliability mattered — with the stack behind each one.
        </p>

        <div className="timeline" id="timeline">
          {experiences.map((exp, index) => {
            const location = exp.location || defaultLocation;
            const bullets = exp.bullets?.filter((b) => b.trim()) ?? [];
            const hasStack = (exp.techStack?.length ?? 0) > 0;

            return (
              <div key={exp.id} className="tl-item reveal-item">
                <article className="exp-card">
                  <div className="exp-ghost-num">{String(index + 1).padStart(2, "0")}</div>

                  <header className="exp-card-head">
                    <div className="exp-card-head-text">
                      <div className="exp-card-meta-row">
                        <span className="exp-company">{exp.company}</span>
                        {exp.period ? (
                          <span className="exp-period-pill">{exp.period}</span>
                        ) : null}
                      </div>
                      <h3 className="exp-role">{exp.role}</h3>
                      {location ? (
                        <p className="exp-location">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {location}
                        </p>
                      ) : null}
                      {exp.highlightMetric ? (
                        <p className="exp-metric">{exp.highlightMetric}</p>
                      ) : null}
                    </div>
                    <div className="exp-monogram" aria-hidden>
                      {companyMonogram(exp.company)}
                    </div>
                  </header>

                  <div className="exp-card-body">
                    <p className="exp-summary">{exp.description}</p>

                    {bullets.length > 0 ? (
                      <ul className="exp-bullets">
                        {bullets.map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}

                    {hasStack ? (
                      <div className="exp-stack-block">
                        <span className="exp-stack-label">Stack</span>
                        <TechChipGrid
                          labels={exp.techStack!}
                          skills={skills}
                          variant="experience"
                          ariaLabel={`Technologies at ${exp.company}`}
                        />
                      </div>
                    ) : null}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
