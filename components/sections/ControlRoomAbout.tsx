"use client";

import { useEffect, useRef } from "react";

export default function ControlRoomAbout({ profile }: { profile: any }) {
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
    }, { threshold: 0.2 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const pills = [
    { text: "Always bet on Postgres", color: "#35E7C7", bg: "rgba(53, 231, 199, 0.1)" },
    { text: "Logs or it didn't happen", color: "#FFA645", bg: "rgba(255, 166, 69, 0.1)" },
    { text: "Stateless > Stateful", color: "#FF5D5D", bg: "rgba(255, 93, 93, 0.1)" },
    { text: "Ship small, ship often", color: "#A78BFA", bg: "rgba(167, 139, 250, 0.1)" }
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 border-t border-[var(--line)]">
      <div className="reveal font-mono text-sm text-[var(--cyan)] mb-12 tracking-widest uppercase">
        01 / Core_Architecture
      </div>
      
      <div className="grid md:grid-cols-2 gap-16">
        <div className="reveal">
          <p className="text-xl md:text-2xl text-[var(--text)] leading-relaxed font-display font-light">
            I don't just write code; I architect systems that survive contact with reality. 
            My expertise lies at the intersection of high-throughput backend services, 
            intelligent agentic workflows, and the rigorous infrastructure required to host them.
          </p>

          {/* Personality Pills */}
          <div className="mt-12 flex flex-wrap gap-4">
            {pills.map((pill, idx) => (
              <div 
                key={idx}
                className="px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wide border"
                style={{ color: pill.color, backgroundColor: pill.bg, borderColor: `${pill.color}40` }}
              >
                {pill.text}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="reveal p-6 bg-[var(--bg-panel)] border border-[var(--line)] rounded">
            <h3 className="text-[var(--cyan)] font-mono text-sm mb-3">&gt; Philosophy.build()</h3>
            <p className="text-[var(--text-dim)]">Code is read more often than it is written. I prioritize obviousness over cleverness, and reliability over raw speed.</p>
          </div>
          <div className="reveal p-6 bg-[var(--bg-panel)] border border-[var(--line)] rounded">
            <h3 className="text-[var(--amber)] font-mono text-sm mb-3">&gt; Systems.scale()</h3>
            <p className="text-[var(--text-dim)]">A system is only as strong as its weakest bottleneck. I design for failure, assuming every component will eventually break.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
