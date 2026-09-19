"use client";

import { useEffect, useRef } from "react";

export default function ControlRoomExperience({ experience }: { experience: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".reveal").forEach((el, i) => {
            setTimeout(() => {
              el.classList.add("in");
            }, i * 150);
          });
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 border-t border-[var(--line)]">
      <div className="reveal font-mono text-sm text-[var(--cyan)] mb-12 tracking-widest uppercase">
        04 / Execution_Log
      </div>

      <div className="relative pl-8 md:pl-0">
        {/* Timeline Line */}
        <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[var(--line)] via-[var(--cyan)] to-[var(--line)] opacity-30 md:-translate-x-1/2" />

        <div className="flex flex-col gap-16">
          {experience.map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={exp.id} className={`reveal relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[-1px] md:left-1/2 top-2 md:top-6 w-4 h-4 rounded-full bg-[var(--bg)] border-2 border-[var(--cyan)] shadow-[0_0_10px_rgba(53,231,199,0.3)] md:-translate-x-1/2 z-10" />

                {/* Date Side */}
                <div className={`md:w-1/2 flex flex-col ${isEven ? 'md:text-right' : 'md:text-left'} pt-1 md:pt-4`}>
                  <div className="font-mono text-[var(--cyan)] text-sm mb-1">{exp.period}</div>
                  <div className="font-display text-xl text-[var(--text)] font-semibold">{exp.company}</div>
                </div>

                {/* Content Side */}
                <div className="md:w-1/2 bg-[var(--bg-panel)] p-6 rounded border border-[var(--line)] hover:border-[var(--cyan)] transition-colors relative group">
                  <div className="absolute top-6 w-4 h-[1px] bg-[var(--line)] group-hover:bg-[var(--cyan)] transition-colors hidden md:block" style={isEven ? { right: '100%' } : { left: '100%' }} />
                  
                  <h4 className="font-display text-lg text-[var(--text)] mb-4">{exp.role}</h4>
                  <ul className="space-y-3 font-mono text-sm text-[var(--text-dim)]">
                    {exp.description.map((item: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-[var(--text-faint)]">&gt;</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
