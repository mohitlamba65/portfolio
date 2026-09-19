"use client";

import { useEffect, useRef, useState } from "react";
import Skills3DSphere from "@/components/3d/Skills3DSphere";
import { SkillCategory } from "@/types/portfolio";

export default function ControlRoomSkills({ skills }: { skills: any[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<SkillCategory | "all">("all");

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

  const filterOptions: { id: SkillCategory | "all"; label: string }[] = [
    { id: "all", label: "All Systems" },
    { id: "backend", label: "Backend Core" },
    { id: "ai", label: "AI & Agents" },
    { id: "data", label: "Databases & Cache" },
    { id: "infra", label: "Infrastructure" },
    { id: "frontend", label: "Full Stack" },
  ];

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
    },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 sm:py-32 border-b border-[var(--line)] relative"
    >
      <div className="section-inner">
        {/* Section Header */}
        <div className="reveal flex items-center gap-2 font-mono text-xs tracking-widest text-[var(--cyan)] uppercase mb-4">
          <span className="w-4 h-[1px] bg-[var(--cyan)]" />
          <span>02 / TECHNICAL_ARSENAL</span>
        </div>

        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[var(--text)] mb-4 tracking-tight">
          Everything's connected to everything.
        </h2>
        <p className="reveal text-base sm:text-lg text-[var(--text-dim)] font-light max-w-2xl mb-8">
          Interactive 3D representation of technologies, frameworks, and architecture patterns. Filter by subsystem or drag to rotate.
        </p>

        {/* Filter Pills */}
        <div className="reveal flex flex-wrap gap-2.5 mb-8">
          {filterOptions.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[var(--cyan)] text-[#04120F] border-[var(--cyan)] font-bold shadow-md shadow-teal-500/20"
                    : "bg-[var(--bg-panel)] text-[var(--text-dim)] border-[var(--line)] hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* 3D WebGL Constellation Container */}
        <div className="reveal w-full h-[450px] sm:h-[500px] border border-[var(--line)] rounded-[var(--radius)] relative overflow-hidden bg-[#0A0D14] mb-16 shadow-2xl shadow-black/40 group">
          {/* Subtle Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundSize: "40px 40px",
              backgroundImage:
                "linear-gradient(to right, rgba(53,231,199,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(53,231,199,0.04) 1px, transparent 1px)",
            }}
          />
          <div className="absolute top-4 left-4 font-mono text-[10px] text-[var(--text-faint)] tracking-widest uppercase z-10 pointer-events-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--cyan)] animate-pulse" />
            <span>INTERACTIVE_SYSTEM_GRAPH // DRAG TO ROTATE</span>
          </div>

          {/* 3D Sphere Component */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing">
            <Skills3DSphere
              skills={skills}
              filter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>

        {/* Categorized Technical Breakdown */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat.id);
            return (
              <div
                key={cat.id}
                className="reveal relative pl-6 border-l-2 border-[var(--line)] hover:border-[var(--cyan)] transition-colors group"
              >
                <span className="absolute -left-[5px] top-0 w-2 h-2 bg-[var(--cyan)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-mono text-xs text-[var(--cyan)] font-bold">{cat.num} /</span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[var(--text)] group-hover:text-[var(--cyan)] transition-colors">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-dim)] leading-relaxed mb-4">{cat.impact}</p>

                <div className="flex flex-wrap gap-2">
                  {catSkills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded bg-[var(--bg-panel)] border border-[var(--line)] font-mono text-xs text-[var(--text-dim)] hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

