"use client";

import { useEffect, useRef } from "react";
import { WorkExperience } from "@/types/portfolio";

interface IslandExperienceProps {
  experiences: WorkExperience[];
}

export default function IslandExperience({ experiences }: IslandExperienceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      setTimeout(() => item.classList.add("in"), i * 80);
    });
    // Animate timeline dots and line
    el.querySelectorAll(".tl-item").forEach((item) => item.classList.add("in"));
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
          {experiences.map((exp) => (
            <div key={exp.id} className="tl-item reveal-item">
              <div className="tl-eyebrow">
                {exp.company.toUpperCase()}
                {exp.period ? ` · ${exp.period.toUpperCase()}` : ""}
              </div>
              <h4>{exp.role}</h4>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
