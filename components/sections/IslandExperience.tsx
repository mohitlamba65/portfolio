"use client";

import { useEffect, useRef, useState } from "react";
import { WorkExperience } from "@/types/portfolio";
import gsap from "gsap";

interface IslandExperienceProps {
  experiences: WorkExperience[];
}

export default function IslandExperience({ experiences }: IslandExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Reveal
    el.querySelectorAll<HTMLElement>(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });

    // Timeline
    const items = el.querySelectorAll<HTMLElement>(".tl-item");
    items.forEach(i => i.classList.add("in"));
    const timeline = el.querySelector<HTMLElement>(".timeline");
    if (timeline) {
      setTimeout(() => timeline.style.setProperty("--tl-progress", "100%"), 200);
    }
  }, []);

  return (
    <div ref={sectionRef} className="tab-panel" id="experience" data-panel>
      <div className="panel-inner">
        <div className="kicker">EXPERIENCE</div>
        <h2 className="h2 reveal-item">How I got here.</h2>

        <div className="timeline" id="timeline">
          {experiences.map(exp => {
            const isOpen = openId === exp.id;
            const hasBullets = exp.bullets && exp.bullets.length > 0;
            const hasStack = exp.techStack && exp.techStack.length > 0;
            const hasMore = hasBullets || hasStack;

            return (
              <div key={exp.id} className="tl-item reveal-item">
                <div className="tl-eyebrow">
                  {exp.company.toUpperCase()}
                  {exp.period ? ` · ${exp.period.toUpperCase()}` : ""}
                </div>
                <h4>{exp.role}</h4>
                <p>{exp.description}</p>

                {hasMore && (
                  <>
                    <button
                      className={`tl-more${isOpen ? " open" : ""}`}
                      onClick={() => setOpenId(isOpen ? null : exp.id)}
                    >
                      More from this role{" "}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </button>

                    <div className={`tl-extra${isOpen ? " open" : ""}`}>
                      {hasBullets && (
                        <ul>
                          {exp.bullets!.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {hasStack && (
                        <div className="tl-tags">
                          {exp.techStack!.map(tech => (
                            <span key={tech}>{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
