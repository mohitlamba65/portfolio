"use client";

import { useEffect, useRef } from "react";
import Skills3DSphere from "@/components/3d/Skills3DSphere";

export default function ControlRoomSkills({ skills }: { skills: any[] }) {
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

  const categories = [
    {
      id: "backend",
      num: "01",
      title: "Backend Core & Distributed Systems",
      impact: "Designing stateless microservices capable of handling millions of concurrent operations with predictable latencies.",
    },
    {
      id: "ai",
      num: "02",
      title: "Agentic AI & LLM Pipelines",
      impact: "Building tool-using AI architectures that safely interact with real-world infrastructure and complex schemas.",
    },
    {
      id: "data",
      num: "03",
      title: "Data Storage & Caching",
      impact: "Optimizing relational, key-value, and vector databases for scale, ensuring sub-millisecond retrieval times.",
    },
    {
      id: "infra",
      num: "04",
      title: "Infrastructure & Cloud",
      impact: "Deploying infrastructure as code with high availability, robust observability, and self-healing mechanisms.",
    }
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-24 border-t border-[var(--line)] min-h-[90vh]">
      <div className="reveal font-mono text-sm text-[var(--cyan)] mb-12 tracking-widest uppercase">
        02 / Technical_Arsenal
      </div>

      <div className="reveal w-full h-[500px] border border-[var(--line)] rounded relative overflow-hidden bg-[#0A0D14] mb-16 group">
        {/* Subtle decorative grid/overlay for the 3D view */}
        <div className="absolute inset-0 pointer-events-none border-[rgba(53,231,199,0.05)] border-t border-l" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(53,231,199,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(53,231,199,0.03) 1px, transparent 1px)' }} />
        <div className="absolute top-4 left-4 font-mono text-xs text-[var(--text-faint)] tracking-widest uppercase z-10 pointer-events-none">
          Interactive Data Visualization
        </div>
        
        {/* 3D Component */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <Skills3DSphere skills={skills} filter="all" onFilterChange={() => {}} />
        </div>
      </div>

      {/* Quieter Text Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-12">
        {categories.map((cat, i) => {
          const catSkills = skills.filter(s => s.category === cat.id);
          return (
            <div key={cat.id} className="reveal relative pl-8 border-l border-[var(--line)] hover:border-[var(--cyan)] transition-colors">
              <span className="absolute -left-1.5 top-0 w-3 h-3 bg-[var(--bg-panel)] border border-[var(--line)] rounded-full" />
              <div className="flex gap-4 items-baseline mb-3">
                <span className="font-mono text-[var(--text-dim)]">{cat.num} /</span>
                <h3 className="font-display text-xl text-[var(--text)]">{cat.title}</h3>
              </div>
              <p className="text-[var(--text-faint)] mb-4">{cat.impact}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-[var(--text-dim)]">
                {catSkills.map((s, idx) => (
                  <span key={s.id} className="hover:text-[var(--cyan)] transition-colors">
                    {s.name}
                    {idx < catSkills.length - 1 && <span className="text-[var(--line)] ml-4">/</span>}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
