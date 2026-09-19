"use client";

import React, { useState, useEffect, useRef } from "react";
import { Skill, SkillCategory } from "@/types/portfolio";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { Link2, Network, BookOpen, Settings, Cpu, Cloud, Layout, Database } from "lucide-react";

interface SkillsViewProps {
  skills: Skill[];
}

const CATEGORY_META: Record<
  SkillCategory | "all",
  { label: string; color: string }
> = {
  all: { label: "All", color: "var(--signal-primary)" },
  backend: { label: "Backend", color: "var(--signal-primary)" },
  ai: { label: "AI / Agents", color: "var(--signal-ai)" },
  data: { label: "Data", color: "var(--signal-data)" },
  frontend: { label: "Frontend", color: "var(--signal-frontend)" },
  infra: { label: "Infra", color: "var(--signal-infra)" },
};

const FallbackIcons: Record<string, React.ReactNode> = {
  langchain: <Link2 className="w-full h-full" />,
  langgraph: <Network className="w-full h-full" />,
  rag: <BookOpen className="w-full h-full" />,
  mcp: <Settings className="w-full h-full" />,
  "llm-apis": <Cpu className="w-full h-full" />,
  "rest-apis": <Cloud className="w-full h-full" />,
  "system-design": <Layout className="w-full h-full" />,
  mongoose: <Database className="w-full h-full" />,
};

export default function SkillsView({ skills }: SkillsViewProps) {
  const [filter, setFilter] = useState<SkillCategory | "all">("all");
  const thumbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSkills = skills.filter(
    (s) => filter === "all" || s.category === filter
  );

  const categories = Object.keys(CATEGORY_META) as (SkillCategory | "all")[];

  // Animate the sliding segmented thumb
  useEffect(() => {
    if (!thumbRef.current || !containerRef.current) return;
    
    const activeBtn = containerRef.current.querySelector(`button[data-filter="${filter}"]`) as HTMLElement;
    if (activeBtn) {
      gsap.to(thumbRef.current, {
        x: activeBtn.offsetLeft - 4, // 4px padding in the container
        width: activeBtn.offsetWidth,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [filter]);

  return (
    <div className="space-y-10 animate-tab-enter">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-[var(--signal-primary)] uppercase">
          <span className="w-4 h-px bg-[var(--signal-primary)]"></span> STACK
        </div>
        <h2 className="text-[clamp(28px,4vw,42px)] font-semibold font-display tracking-tight text-[var(--text)]">
          Tools I actually reach for.
        </h2>
        <p className="text-[16.5px] text-[var(--text-dim)] max-w-[60ch] mb-[30px]">
          Real icons, real color, no metaphors. Hover a tile, filter by category, or just look around.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-[28px]">
        <div 
          ref={containerRef}
          className="relative inline-flex p-1 border border-[var(--border-color)] rounded-[24px] bg-[var(--bg-panel)]"
        >
          <div 
            ref={thumbRef}
            className="absolute top-1 left-0 h-[calc(100%-8px)] rounded-[20px] bg-[var(--signal-primary)] z-0"
          />
          {categories.map((cat) => (
            <button
              key={cat}
              data-filter={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "relative z-10 font-mono text-[11.5px] px-[15px] py-2 rounded-[20px] transition-colors whitespace-nowrap",
                filter === cat ? "text-[var(--bg)]" : "text-[var(--text-dim)]"
              )}
            >
              {CATEGORY_META[cat].label}
            </button>
          ))}
        </div>
        <div className="font-mono text-[11px] text-[var(--text-faint)]">
          {filteredSkills.length} TECHNOLOGIES
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-4 border border-[var(--border-color)] rounded-[12px]"
           style={{
             backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
             backgroundSize: '20px 20px',
             backgroundPosition: '-10px -10px'
           }}>
        {filteredSkills.map((skill) => {
          const catColor = CATEGORY_META[skill.category].color;
          const iconUrl = skill.icon ? `https://cdn.simpleicons.org/${skill.icon}/${catColor.replace('var(--', '').replace(')', '')}` : null;
          
          return (
            <div
              key={skill.id}
              className="group relative flex flex-col items-center text-center gap-[11px] p-[20px_14px] rounded-[var(--radius)] border border-[var(--border-color)] bg-[var(--bg-panel)] overflow-hidden transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_10px_24px_var(--shadow)]"
              style={{ '--cat-color': catColor } as React.CSSProperties}
            >
              {/* Radial glow background on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                   style={{
                     background: `radial-gradient(120px circle at 50% 0%, color-mix(in srgb, ${catColor} 18%, transparent), transparent 70%)`
                   }}
              />
              
              <div className="relative z-10 w-[28px] h-[28px] transition-all duration-300 group-hover:scale-[1.14]">
                {iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconUrl} alt={skill.name} className="w-full h-full object-contain filter-none group-hover:drop-shadow-[0_0_10px_color-mix(in_srgb,var(--cat-color)_55%,transparent)]" />
                ) : (
                  <div className="w-full h-full text-[var(--text-dim)] group-hover:text-[var(--cat-color)] group-hover:drop-shadow-[0_0_10px_color-mix(in_srgb,var(--cat-color)_55%,transparent)] transition-colors">
                    {FallbackIcons[skill.id] || FallbackIcons["system-design"]}
                  </div>
                )}
              </div>
              
              <div className="relative z-10 text-[12.5px] font-medium text-[var(--text)]">
                {skill.name}
              </div>
              
              <div className="relative z-10 flex gap-[3px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[5px] h-[5px] rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: i < skill.level ? catColor : 'var(--border-color)'
                    }}
                  />
                ))}
              </div>
              
              <style jsx>{`
                div.group:hover { border-color: ${catColor}; }
              `}</style>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-[18px] mt-[22px] pt-[18px] border-t border-[var(--border-color)]">
        <div className="flex items-center gap-[7px] font-mono text-[10.5px] text-[var(--text-faint)]">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--signal-primary)]"></span>
          BACKEND — the power-on light
        </div>
        <div className="flex items-center gap-[7px] font-mono text-[10.5px] text-[var(--text-faint)]">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--signal-ai)]"></span>
          AI / AGENTS — reasoning signal
        </div>
        <div className="flex items-center gap-[7px] font-mono text-[10.5px] text-[var(--text-faint)]">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--signal-data)]"></span>
          DATA — flow signal
        </div>
        <div className="flex items-center gap-[7px] font-mono text-[10.5px] text-[var(--text-faint)]">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--signal-frontend)]"></span>
          FRONTEND — interface signal
        </div>
        <div className="flex items-center gap-[7px] font-mono text-[10.5px] text-[var(--text-faint)]">
          <span className="w-[7px] h-[7px] rounded-full bg-[var(--signal-infra)]"></span>
          INFRA — infrastructure signal
        </div>
      </div>
    </div>
  );
}
